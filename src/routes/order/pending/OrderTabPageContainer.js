import createOrderTabPageContainer, {buildOrderTabPageCommonState, updateTable} from '../../../standard-business/OrderTabPage/createOrderTabPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";
import showDispatchDialog from './dispatchDialog/DispatchDialogContainer';

const STATE_PATH = ['pending'];
const action = new Action(STATE_PATH);

//根据页面需求覆写和扩展页面状态属性
const buildOrderTabPageState = async (home) => {
  const urlConfig = '/api/order/pending/config';
  const urlList = '/api/order/pending/list';
  const statusNames = ['transport_order', 'order_type'];
  return buildOrderTabPageCommonState(urlConfig, urlList, statusNames, home, true);
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const showOrderInfoPage = (dispatch, item, selfState, readonly) => {
  const key = item.orderNumber;
  if (helper.isTabExist(selfState.tabs, key)) {
    dispatch(action.assign({activeKey: key}));
  } else {
    const closeFunc = () => {
      const newTabs = selfState.tabs.filter(tab => tab.key !== key);
      dispatch(action.assign({tabs: newTabs, [key]: undefined, activeKey: 'index'}));
      return updateTable(dispatch, action, selfState, ['sending']);
    };
    const payload = {
      id: item.id,
      readonly,
      closeFunc
    };
    dispatch(action.add({key, title: key}, 'tabs'));
    dispatch(action.assign({[key]: payload, activeKey: key}));
  }
};

//完善
const editActionCreator = (tabKey) => async (dispatch, getState) => {
  const selfState = getSelfState(getState());
  const items = selfState.tableItems[tabKey].filter(item => item.checked === true);
  if (items.length !== 1) return helper.showError(`请勾选一条记录`);
  return showOrderInfoPage(dispatch, items[0], selfState, false);
};

//删除
const deleteActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/order/pending`, helper.postOption(ids, 'delete'));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('删除成功');
  return updateTable(dispatch, action, getSelfState(getState()));
};

//任务派发
const sendActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if (checkedItems.length !== 1) return helper.showError(`请先勾选一条记录`);
  if (true === await showDispatchDialog(checkedItems[0])) {
    return updateTable(dispatch, action, getSelfState(getState()));
  }
};

const buttons = {
  edit: editActionCreator,
  del: deleteActionCreator,
  send: sendActionCreator,
};

const clickActionCreator = (tabKey, key) => {
  if (buttons[key]) {
    return buttons[key](tabKey);
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const doubleClickActionCreator = (tabKey, index) => (dispatch, getState) => {
  if (tabKey === 'completing') {
    const selfState = getSelfState(getState());
    const item = selfState.tableItems[tabKey][index];
    return showOrderInfoPage(dispatch, item, selfState, false);
  }
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

