import createOrderTabPageContainer, {buildOrderTabPageCommonState, updateTable} from '../../../standard-business/OrderTabPage/createOrderTabPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";
import {showImportDialog} from '../../../common/modeImport';

const STATE_PATH = ['append'];
const action = new Action(STATE_PATH);

//根据页面需求覆写和扩展页面状态属性
const buildOrderTabPageState = async () => {
  const urlConfig = '/api/bill/append/config';
  const urlList = '/api/bill/append/list';
  const statusNames = ['transport_order', 'order_type'];
  return buildOrderTabPageCommonState(urlConfig, urlList, statusNames);
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const showOrderInfoPage = (dispatch, item, selfState, readonly) => {
  const key = item.orderNumber ? item.orderNumber : helper.genTabKey('add', selfState.tabs);
  const title = item.orderNumber ? item.orderNumber : '新增';
  if (helper.isTabExist(selfState.tabs, key)) {
    dispatch(action.assign({activeKey: key}));
  } else {
    const closeFunc = () => {
      const newTabs = selfState.tabs.filter(tab => tab.key !== key);
      dispatch(action.assign({tabs: newTabs, [key]: undefined, activeKey: 'index'}));
      return updateTable(dispatch, action, selfState, ['committed']);
    };
    const payload = {
      id: item.id,
      isAppend: true,
      readonly,
      closeFunc
    };
    dispatch(action.add({key, title}, 'tabs'));
    dispatch(action.assign({[key]: payload, activeKey: key}));
  }
};

//新增
const addActionCreator = (tabKey) => async (dispatch, getState) => {
  return showOrderInfoPage(dispatch, {}, getSelfState(getState()), false);
};

//编辑
const editActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if (checkedItems.length !== 1) return helper.showError(`请勾选一条记录`);
  return showOrderInfoPage(dispatch, checkedItems[0], getSelfState(getState()), false);
};

const importActionCreator = (tabKey) => async () => {
  return showImportDialog('supplement_import');
};

const commitActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/bill/append/commit_batch`, helper.postOption(ids));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('操作成功');
  return updateTable(dispatch, action, getSelfState(getState()), ['committed']);
};

const delActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/bill/append/del`, helper.postOption(ids, 'delete'));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('操作成功');
  return updateTable(dispatch, action, getSelfState(getState()));
};

const buttons = {
  add: addActionCreator,
  edit: editActionCreator,
  import: importActionCreator,
  commit: commitActionCreator,
  del: delActionCreator,
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
  return showOrderInfoPage(dispatch, item, selfState, true);
};

// 查看
const linkActionCreator = (tabKey, key, rowIndex, item) => (dispatch, getState) => {
  const selfState = getSelfState(getState());
  return showOrderInfoPage(dispatch, item, selfState, true);
};

const actionCreatorsEx = {
  onClick: clickActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onLink: linkActionCreator
};

export default createOrderTabPageContainer(action, getSelfState, actionCreatorsEx);
export {buildOrderTabPageState};

