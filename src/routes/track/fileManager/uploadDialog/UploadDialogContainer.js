import { connect } from 'react-redux';
import UploadDialog from './UploadDialog';
import helper from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showPopup from '../../../../standard-business/showPopup';
import {fetchDictionary} from '../../../../common/dictionary';

const action = new Action(['temp'], false);

const getSelfState = (rootState) => {
  return getPathValue(rootState, ['temp']);
};

const changeActionCreator = (rowIndex, keyName, value) => (dispatch) => {
  dispatch(action.update({[keyName]: value}, 'items', rowIndex));
};

const checkActionCreator = (rowIndex, keyName, checked) => (dispatch) => {
  dispatch(action.update({checked}, 'items', rowIndex));
};

const linkActionCreator = (keyName, rowIndex) => async (dispatch, getState) => {
  const {items} = getSelfState(getState());
  const item = items[rowIndex];
  const URL_DOWNLOAD= '/api/track/file_manager/download';  // 点击下载
  if(item.fileFormat === 'id'){
    const {returnCode, result, returnMsg} = await helper.fetchJson(`${URL_DOWNLOAD}/${item.fileUrl}`);
    if (returnCode !== 0) {
      return helper.showError(returnMsg);
    }
    helper.download(`/api/proxy/zuul/file-center-service/${result[item.fileUrl]}`,'file');
  }else {
    helper.download(item.fileUrl, 'file');
  }
};

const delActionCreator = (dispatch,getState) => {
  const {items, delFileList} = getSelfState(getState());
  const newItems = items.filter(item => item.checked !== true);
  const newDelFiles = items.filter(item => item.checked === true && !!item.fileUrl).map(item => item.fileUrl);
  dispatch(action.assign({items: newItems, delFileList: delFileList.concat(newDelFiles)}));
};

const uploadActionCreator = async (dispatch, getState) => {
  const {items} = getSelfState(getState());
  const checkedItems = items.filter(item => item.checked === true);
  if (checkedItems.length !== 1) return helper.showError(`请勾选一条记录`);
  if (!!checkedItems[0].fileName) return helper.showError(`此记录已有附件，请新增记录后上传`);
  const url = `/api/proxy/zuul/tms-service/file/upload/document`;
  const start = await helper.uploadWithFileCheck(url);
  if (start) {
    const sss = await start();
    const {status, name, response={}} = sss;
    if (status && response.returnCode === 0) {
      helper.showSuccessMsg(`[${name}]上传成功`);
      const file = {fileName: name, fileUrl: response.result, fileFormat: 'id'};
      dispatch(action.update(file, 'items', {key: 'checked', value: true}));
      dispatch(action.add(file.fileUrl, 'addFileList'));
    } else {
      helper.showError(`[${name}]上传失败:${response.returnMsg}`);
    }
  }
};

const addActionCreator = (dispatch) => {
  dispatch(action.add({}, 'items'));
};

const formChangeActionCreator = (key, value) => (dispatch) => {
  dispatch(action.assign({[key]: value}, 'formValue'));
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const {controls, formValue, items, delFileList} = getSelfState(getState());
  if (!helper.validValue(controls, formValue)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  const fileList = items.filter(item => !!item.fileName);
  if (fileList.length < 1) return helper.showError('附件不能为空');
  dispatch(action.assign({confirmLoading: true}));
  const commitList = fileList.map(item => ({
    ...helper.convert(item),
    driverTaskName: item.driverTaskId ? item.driverTaskId.title : '',
    taskTypeFileName: item.taskTypeFile ? item.taskTypeFile.title : '',
    checked: undefined
  }));
  const newValue = {
    id: formValue.id,
    remark: formValue.remark,
    uploadType: 'PC',
    fileList: commitList
  };
  const URL_OK = '/api/track/file_manager/upload'; //确定
  let data = await helper.fetchJson(URL_OK, helper.postOption(helper.convert(newValue), 'put'));
  dispatch(action.assign({confirmLoading: false}));
  if (data.returnCode !== 0) {
    return helper.showError(data.returnMsg);
  }else {
    const URL_DEL_FILE = '/api/track/file_manager/upload_del'; //删除远程文件
    delFileList.length > 0 && await helper.fetchJson(`${URL_DEL_FILE}/${delFileList.join(',')}`, 'delete');
    dispatch(action.assign({visible: false, res: true}));
  }
};

//取消删除上传在文件中心的文件，编辑的时候保留原有的文件
const cancelActionCreator= () => async (dispatch, getState) => {
  const {addFileList} = getSelfState(getState());
  const URL_DEL_FILE = '/api/track/file_manager/upload_del'; //删除远程文件
  addFileList.length > 0 && helper.fetchJson(`${URL_DEL_FILE}/${addFileList.join(',')}`, 'delete');
  dispatch(action.assign({visible: false}));
};

const buttons = {
  add: addActionCreator,
  del: delActionCreator,
  upload: uploadActionCreator
};

const clickActionCreator = (key) => {
  if (buttons[key]) {
    return buttons[key];
  }else {
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
  onFormChange: formChangeActionCreator,
  onExitValid: exitValidActionCreator,
  onContentChange: changeActionCreator,
  onCheck: checkActionCreator,
  onLink: linkActionCreator,
  onClick: clickActionCreator,
};

/*
* 功能：上传、编辑对话框
* 参数：data: 【必需】待上传、编辑的记录信息
* 返回值：成功返回true，取消或关闭时返回空
*/
export default async (data, isModify=false) => {
  let controls = [
    {key: 'orderNumber', title: '运单号', type:'readonly', required:true},
    {key: 'taskTypeName', title: '文件任务', type:'readonly', required:true}
  ];
  if (isModify) {
    controls = controls.concat([{key: 'remark', title: '修改原因',type:'text', required:true}]);
  }
  const buttons = [
    {key: 'add', title: '新增'},
    {key: 'del', title: '删除'},
    {key: 'upload', title: '上传'},
  ];
  const taskTypeCodeArr = data.taskTypeCode.split(',');
  const taskTypeOptions = helper.getJsonResult(await fetchDictionary(['task_type_file'])).task_type_file.filter(item => taskTypeCodeArr.includes(item.value));
  const {returnCode, result, returnMsg} = await helper.fetchJson(`/api/order/input/track_driver/${data.id}`);
  if (returnCode !== 0) return helper.showError(returnMsg);
  const driverTaskOptions = result.map(item => ({value: item.taskTypeId, title: item.taskTypeName}));
  const cols = [
    {key: 'checked', title: '', type: 'checkbox'},
    {key: 'index', title: '序号', type: 'index'},
    {key: 'taskTypeFile', title: '文件任务', type: 'search', options: taskTypeOptions},
    {key: 'driverTaskId', title: '节点', type: 'search', options: driverTaskOptions},
    {key: 'fileName', title: '附件', link: true},
  ];
  const items = data.fileList ? data.fileList.map(item => ({...item,
    driverTaskId: item.driverTaskId ? {value: item.driverTaskId, title: item.driverTaskName} : '',
    taskTypeFile: item.taskTypeFile ? {value: item.taskTypeFile, title: item.taskTypeFileName} : ''
  })) : [];
  const props =  {
    label: {
      ok: '确定',
      cancel: '取消'
    },
    title: '文件上传及编辑',
    controls,
    formValue: data,
    valid: false,
    buttons,
    cols,
    items,
    addFileList: [],
    delFileList: [],
    visible: true
  };
  global.store.dispatch(action.create(props));
  const Container = connect(mapStateToProps, actionCreators)(UploadDialog);
  return showPopup(Container, {}, true);
};
