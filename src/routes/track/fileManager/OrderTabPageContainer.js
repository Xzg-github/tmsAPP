import createOrderTabPageContainer, {buildOrderTabPageCommonState, updateTable} from '../../../standard-business/OrderTabPage/createOrderTabPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";
import showUploadDialog from './uploadDialog/UploadDialogContainer';

const STATE_PATH = ['fileManager'];
const action = new Action(STATE_PATH);

//根据页面需求覆写和扩展页面状态属性
const buildOrderTabPageState = async (home) => {
  const urlConfig = '/api/track/file_manager/config';
  const urlList = '/api/track/file_manager/list';
  const statusNames = ['transport_order', 'order_type'];
  return buildOrderTabPageCommonState(urlConfig, urlList, statusNames, home, true);
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const showOrderInfoPage = (dispatch, item, selfState) => {
  const key = item.orderNumber;
  if (helper.isTabExist(selfState.tabs, key)) {
    dispatch(action.assign({activeKey: key}));
  } else {
    const payload = {
      id: item.id,
      readonly: true,
    };
    dispatch(action.add({key, title: key}, 'tabs'));
    dispatch(action.assign({[key]: payload, activeKey: key}));
  }
};

//上传
const uploadActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if (checkedItems.length !== 1) return helper.showError(`请先勾选一条记录`);
  if (true === await showUploadDialog(checkedItems[0])) {
    return updateTable(dispatch, action, getSelfState(getState()), ['checking']);
  }
};

//编辑
const editActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if (checkedItems.length !== 1) return helper.showError(`请先勾选一条记录`);
  if (true === await showUploadDialog(checkedItems[0])) {
    return updateTable(dispatch, action, getSelfState(getState()));
  }
};

//修改文件
const modifyActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if (checkedItems.length !== 1) return helper.showError(`请先勾选一条记录`);
  if (true === await showUploadDialog(checkedItems[0], true)) {
    return updateTable(dispatch, action, getSelfState(getState()));
  }
};

//审核通过
const checkActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/track/file_manager/check`, helper.postOption(ids));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('操作成功');
  return updateTable(dispatch, action, getSelfState(getState()), ['checked']);
};

const buttons = {
  upload: uploadActionCreator,
  edit: editActionCreator,
  check: checkActionCreator,
  check1: checkActionCreator,
  modify: modifyActionCreator,
};

const clickActionCreator = (tabKey, key) => {
  if (buttons[key]) {
    return buttons[key](tabKey);
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

// 查看
const doubleClickActionCreator = (tabKey, index) => (dispatch, getState) => {
  const selfState = getSelfState(getState());
  const item = selfState.tableItems[tabKey][index];
  return showOrderInfoPage(dispatch, item, selfState);
};

// 查看
const linkActionCreator = (tabKey, key, rowIndex, item) => async (dispatch, getState) => {
  if (key === 'orderNumber') {
    const selfState = getSelfState(getState());
    return showOrderInfoPage(dispatch, item, selfState);
  }else if (key === 'fileList') {
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
  }
};

const actionCreatorsEx = {
  onClick: clickActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onLink: linkActionCreator
};

export default createOrderTabPageContainer(action, getSelfState, actionCreatorsEx);
export {buildOrderTabPageState};

