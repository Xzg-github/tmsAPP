import {connect} from 'react-redux';
import Contract from './Contract';
import {Action} from '../../../../../action-reducer/action';
import {EnhanceLoading} from '../../../../../components/Enhance';
import {getPathValue} from '../../../../../action-reducer/helper';
import helper, {getJsonResult, postOption, fetchJson, showError, showSuccessMsg} from '../../../../../common/common';
import execWithLoading from '../../../../../standard-business/execWithLoading';
import {afterEdit} from '../../OrderPageContainer';

const PARENT_PATH = ['customerPrice'];
const STATE_PATH = ['customerPrice', 'edit'];

const URL_DETAIL = '/api/config/customerPrice/detail';
const URL_CUSTOMER = '/api/config/customerPrice/customer';
const URL_SAVE_NEWADD = '/api/config/customerPrice/contractAdd';
const URL_SAVE_EDIT = '/api/config/customerPrice/contractSave';
const URL_SAVE_COMMIT = '/api/config/customerPrice/contractCommit';
const URL_DEL_FILE = '/api/track/file_manager/upload_del';
const URL_DOWNLOAD= '/api/track/file_manager/download';

const action = new Action(STATE_PATH);
const PATH = 'contract';  // PATH与tab页签的key值一致

const getParentState = (rootState) => {
  const parent = getPathValue(rootState, PARENT_PATH);
  return parent[parent.activeKey];
};

const getSelfState = (rootState) => {
  const parent = getParentState(rootState);
  return parent[parent.activeKey];
};

const changeActionCreator = (key, value) => async (dispatch, getState) => {
  dispatch(action.assign({[key]: value}, [PATH, 'value']));
};

const formSearchActionCreator = (key, value) => async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  let result = [], params = {maxNumber: 20, filter: value};
  switch (key) {
    case 'customerId':
    case 'balanceCompany': {
       result = getJsonResult(await fetchJson(URL_CUSTOMER, postOption(params)));
       break;
    }
  }
  const index = controls.findIndex(item => item.key === key);
  dispatch(action.update({options: result}, [PATH, 'controls'], index));
};

const saveActionCreator = async (dispatch, getState) => {
  execWithLoading(async () => {
    const {editType, fileList=[], value={}, controls} = getSelfState(getState());
    if (!helper.validValue(controls, value)) {
      return dispatch(action.assign({valid: true}, [PATH]));
    }
    await removeImages(getState);
    const url = editType === 2 ? URL_SAVE_EDIT : URL_SAVE_NEWADD;
    const {item} = getParentState(getState());
    const files = fileList.map(o => {
      return {
        fileFormat: o.fileFormat || 'id',
        fileName: o.name,
        fileUrl: o.fileUrl || o.response.result
      }
    });
    const params = {
      ...helper.getObject(helper.convert(value), controls.map(o => o.key)),
      id: editType === 2 ? item.id : null,
      fileList: files,
    };
    const {returnCode, returnMsg} = await fetchJson(url, helper.postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    await afterEdit(dispatch, getState);
  });
};

const commitActionCreator = async (dispatch, getState) => {
  execWithLoading(async () => {
    const {fileList=[], value={}, controls} = getSelfState(getState());
    if (!helper.validValue(controls, value)) {
      return dispatch(action.assign({valid: true}, [PATH]));
    }
    await removeImages(getState);
    const {item} = getParentState(getState());
    const files = fileList.map(o => {
      return {
        fileFormat: o.fileFormat || 'id',
        fileName: o.name,
        fileUrl: o.fileUrl || o.response.result
      }
    });
    const params = {
      ...helper.getObject(helper.convert(value), controls.map(o => o.key)),
      id: item.id,
      fileList: files,
    };
    const {returnCode, returnMsg} = await fetchJson(URL_SAVE_COMMIT, helper.postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    await afterEdit(dispatch, getState);
  });
};

const toolbarActions = {
  save: saveActionCreator,
  commit: commitActionCreator
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    return {type: 'unknown'};
  }
};

const onExitValidActionCreator = () => async (dispatch, getState) => {
  dispatch(action.assign({valid: false}, [PATH]));
};

const handleImgChange = (data={}) => async (dispatch, getState) => {
  const {file, fileList} = data;
  if (!file) return;
  const list = fileList.filter(o => o.status);
  // 控制最多上传10个
  let newList = list.length > 10 ? list.slice(0, 10) : list;
  if (file.response && file.response.returnCode !== 0) {
    helper.showError(`上传失败，${file.response.returnMsg || ''}`);
    newList = fileList.filter(item => item.uid !== file.uid);
  }
  dispatch(action.assign({fileList: newList}, [PATH]));
};

const handleImgRemove = (file) => async (dispatch, getState) => {
  const {delFiles=[]} = getSelfState(getState());
  const id = file.fileUrl || file.response.result;
  if (!delFiles.includes(id)) {
    delFiles.push(id);
  }
  dispatch(action.assign({delFiles}, [PATH]));
};

const removeImages = async (getState) => {
  // 删除文件服务中心的远程文件
  const {delFiles=[]} = getSelfState(getState());
  if (delFiles.length > 0) {
    const {returnCode, result, returnMsg} = await fetchJson(`${URL_DEL_FILE}/${delFiles}`, 'delete');
    returnCode === 0 ? showSuccessMsg(returnMsg) : showError(returnMsg);
  }
};

const getFiles = async (list=[]) => {
  let arr = [];
  for (let i in list) {
    const file = list[i];
    if(file.fileFormat === 'id') {
      const locationUrl = getJsonResult(await fetchJson(`${URL_DOWNLOAD}/${file.fileUrl}`));
      arr.push({
        ...file,
          uid: i,
          fileFormat: 'id',
          name: file.fileName,
          status: 'done',
          url: `/api/proxy/file-center-service/${locationUrl[file.fileUrl]}`
      });
    }
  }
  return arr;
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    dispatch(action.assign({status: 'loading'}, [PATH]));
    const {item={}, tabs, editType} = getParentState(getState());
    let state = {};
    if (editType === 2) {
      const data = getJsonResult(await fetchJson(`${URL_DETAIL}/${item.id}`));
      const {total={}, fileList=[], ...other={}} = data;
      state = {fileList, value: other};
      const newTabs = tabs.map(tab => {
        (tab.key === 'freight') && (tab.title = `${tab.title}（${total.masterTotal || 0}）`);
        (tab.key === 'extraCharge') && (tab.title = `${tab.title}（${total.additionalTotal || 0}）`);
        return tab;
      });
      dispatch(action.assign({tabs: newTabs}));
    } else {
      state = item;
    }
    if (state.fileList && state.fileList.length > 0) {
      state.fileList = await getFiles(state.fileList);
    }
    const payload = {editType, ...state, status: 'page'};
    dispatch(action.assign(payload, [PATH]));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}, [PATH]));
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onExitValid: onExitValidActionCreator,
  handleImgChange,
  handleImgRemove
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(Contract));
export default Container;
