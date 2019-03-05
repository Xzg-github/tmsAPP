import createOrderTabPageContainer, {buildOrderTabPageCommonState, updateTable} from '../../../standard-business/OrderTabPage/createOrderTabPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";

const STATE_PATH = ['accept'];
const action = new Action(STATE_PATH);

//根据页面需求覆写和扩展页面状态属性
const buildOrderTabPageState = async () => {
  const urlConfig = '/api/order/accept/config';
  const urlList = '/api/order/accept/list';
  const statusNames = ['transport_order', 'order_type'];
  return buildOrderTabPageCommonState(urlConfig, urlList, statusNames, false, true);
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
      readonly: true
    };
    dispatch(action.add({key, title: key}, 'tabs'));
    dispatch(action.assign({[key]: payload, activeKey: key}));
  }
};

//接单
const acceptActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if (checkedItems.length !== 1) return helper.showError(`请先勾选记录`);
  const url = `/api/order/accept/accept`;
  const body = checkedItems.map(item => item.id);
  const {returnCode, returnMsg} = await helper.fetchJson(url, helper.postOption(body));
  if (returnCode !== 0) {
    return helper.showError(returnMsg);
  }
  return updateTable(dispatch, action, getSelfState(getState()));
};

//拒单
const rejectActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if (checkedItems.length !== 1) return helper.showError(`请先勾选记录`);
  const url = `/api/order/accept/reject`;
  const body = checkedItems.map(item => item.id);
  const {returnCode, returnMsg} = await helper.fetchJson(url, helper.postOption(body));
  if (returnCode !== 0) {
    return helper.showError(returnMsg);
  }
  return updateTable(dispatch, action, getSelfState(getState()), ['reject']);
};

const buttons = {
  accept: acceptActionCreator,
  reject: rejectActionCreator,
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
    return showOrderInfoPage(dispatch, item, selfState);
  }
};

// 查看
const linkActionCreator = (tabKey, key, rowIndex, item) => (dispatch, getState) => {
  const selfState = getSelfState(getState());
  return showOrderInfoPage(dispatch, item, selfState);
};

const actionCreatorsEx = {
  onClick: clickActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onLink: linkActionCreator
};

export default createOrderTabPageContainer(action, getSelfState, actionCreatorsEx);
export {buildOrderTabPageState};

