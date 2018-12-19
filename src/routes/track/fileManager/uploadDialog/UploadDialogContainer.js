import { connect } from 'react-redux';
import UploadDialog from './UploadDialog';
import helper from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showPopup from '../../../../standard-business/showPopup';

const FORMATS = ['image/jpeg', 'image/gif', 'image/bmp', 'image/jpg', 'image/png', 'image/tiff', 'image/gif', 'image/pcx', 'image/tga', 'image/exif', 'image/fpx', 'image/svg', 'image/psd', 'image/cdr', 'image/pcd', 'image/dxf', 'image/ufo', 'image/eps', 'image/ai', 'image/raw', 'image/WMF'];
const FORMATS1 = ['.jpeg', '.gif', '.bmp', '.jpg', '.png', '.tiff', '.gif', '.pcx', '.tga', '.exif', '.fpx', '.svg', '.psd', '.cdr', '.pcd', '.dxf', '.ufo', '.eps', '.ai', '.raw', '.WMF'];

const action = new Action(['temp'], false);

const getSelfState = (rootState) => {
  return getPathValue(rootState, ['temp']);
};

const changeActionCreator = ({file, fileList}) => (dispatch) => {
  if (!file) return; //过滤掉不符合条件的响应
  if (file.response && file.response.returnCode !== 0) { //检查是否上传到文件服务器成功
    helper.showError(`上传失败，${file.response.returnMsg || ''}`);
    const newList = fileList.filter(item => item.uid !== file.uid);
    dispatch(action.assign({fileList: newList}));
  }else {
    const newList = fileList.filter(item => item.status).map(item => (FORMATS.indexOf(item.type) === -1) ? {...item, thumbUrl: '/default.png'} : item);
    dispatch(action.assign({fileList: newList}));
  }
};

const removeActionCreator = (file) => async (dispatch,getState) => {
  const {delFileList} = getSelfState(getState());
  const {returnCode, result} = file.response || {};
  let delList = delFileList;
  returnCode === 0 && delList.push(result);
  dispatch(action.assign({delFileList:delList}));
};

const previewActionCreator = (file) => {
  return action.assign({
    previewImage: file.url || file.thumbUrl,
    previewVisible: true,
  });
};

const closePreviewActionCreator = () => {
  return action.assign({previewVisible: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const {controls, formValue, fileList, delFileList, isEdit} = getSelfState(getState());
  if (!helper.validValue(controls, formValue)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  if (fileList.length < 1) return helper.showError('附件不能为空');
  dispatch(action.assign({confirmLoading: true}));
  const commitList = fileList.map(item => ({fileFormat: item.fileFormat || 'id', fileName: item.name, fileUrl: item.response.result}));
  const newValue = {
    id: formValue.id,
    remark: formValue.remark,
    uploadType: '',
    fileList: commitList
  };
  const URL_OK = '/api/track/file_manager/upload'; //确定
  let data = await helper.fetchJson(URL_OK, helper.postOption(helper.convert(newValue), isEdit ? 'put':'post'));
  dispatch(action.assign({confirmLoading: false}));
  if (data.returnCode !== 0) {
    return helper.showError(data.returnMsg);
  }else {
    const URL_DEL_FILE = '/api/track/file_manager/upload_del'; //删除远程文件
    delFileList.length > 0 && await helper.fetchJson(`${URL_DEL_FILE}/${delFileList.join(',')}`, 'delete');
    dispatch(action.assign({visible: false, res: true}));
  }
};

const formChangeActionCreator = (key, value) => (dispatch) => {
  dispatch(action.assign({[key]: value}, 'formValue'));
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

//差集
const difference = (arr1, arr2) => {
  let a = new Set([...arr1]);
  let b = new Set([...arr2]);
  let intersectionSet = new Set([...a].filter(x => !b.has(x)));
  return Array.from(intersectionSet);
};

//取消删除上传在文件中心的文件，编辑的时候保留原有的文件
const cancelActionCreator= () => async (dispatch, getState) => {
  const {delFileList,editFileList,fileList} = getSelfState(getState());
  let editList = [];
  let allList = [];
  fileList.forEach(item => {
    const {returnCode, result} = item.response || {};
    returnCode === 0 && allList.push(result);
  });
  editFileList.forEach(item => {
    const {returnCode, result} = item.response || {};
    returnCode === 0 && editList.push(result);
  });
  let all = allList.concat(...delFileList);
  let delList = difference(all,editList);
  const URL_DEL_FILE = '/api/track/file_manager/upload_del'; //删除远程文件
  delList.length > 0 && helper.fetchJson(`${URL_DEL_FILE}/${delList.join(',')}`, 'delete');
  dispatch(action.assign({visible: false}));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
  onFormChange: formChangeActionCreator,
  onExitValid: exitValidActionCreator,
  onChange: changeActionCreator,
  onRemove: removeActionCreator,
  onPreview: previewActionCreator,
  onClosePreview: closePreviewActionCreator
};

const URL_DOWNLOAD= '/api/track/file_manager/download';  // 点击下载
const formatDisplayList =  async (originFileList=[]) => {
  let fileList = [], uid = 0;
  for(let item of originFileList) {
    let fileItem = {};
    if(item.fileFormat ==='id'){
      const { result, returnMsg, returnCode }  = await helper.fetchJson(`${URL_DOWNLOAD}/${item.fileUrl}`);
      if (returnCode !== 0) {
        helper.showError(returnMsg);
        return;
      }
      fileItem.url = `/api/proxy/file-center-service/${result[item.fileUrl]}`;
    }
    if (FORMATS1.indexOf(item.fileName.substr(item.fileName.lastIndexOf('.'))) !== -1) {
      fileItem.type = 'image/jpeg';
    }else {
      fileItem.thumbUrl = '/default.png';
    }
    fileItem.status='done';
    fileItem.name = item.fileName;
    fileItem.uid = ++uid;
    fileItem.response = { returnCode: 0, result: item.fileUrl };
    fileItem.fileFormat = item.fileFormat;
    fileList.push(fileItem);
  }
  return fileList
};

/*
* 功能：上传、编辑对话框
* 参数：data: 【必需】待上传、编辑的记录信息
* 返回值：成功返回true，取消或关闭时返回空
*/
export default async (data, isEdit = false) => {
  const controls = [
    {key: 'orderNumber', title: '运单号', type:'readonly', required:true},
    {key: 'taskTypeName', title: '文件任务', type:'readonly', required:true},
    {key: 'remark', title: '备注',type:'text'}
  ];
  const fileList = await formatDisplayList(data.fileList);
  const props =  {
    label: {
      ok: '确定',
      cancel: '取消'
    },
    title: '文件上传及编辑',
    controls,
    formValue: data,
    valid: false,
    fileList,
    delFileList: [],
    editFileList: fileList,
    previewVisible: false,
    previewImage: '',
    visible: true,
    isEdit
  };
  global.store.dispatch(action.create(props));
  const Container = connect(mapStateToProps, actionCreators)(UploadDialog);
  return showPopup(Container, {}, true);
};
