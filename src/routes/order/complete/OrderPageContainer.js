import createOrderPageContainer, {buildOrderPageCommonState, updateTable} from '../../../standard-business/OrderPage/createOrderPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";
import showPrompt from '../common/PromptDialog';

const STATE_PATH = ['complete'];
const action = new Action(STATE_PATH);

//根据页面需求覆写和扩展页面状态属性
const buildOrderPageState = async () => {
  const urlConfig = '/api/order/complete/config';
  const urlList = '/api/order/complete/list';
  const statusNames = ['transport_order', 'order_type'];
  const state = await buildOrderPageCommonState(urlConfig, urlList, statusNames, true);
  if (state) { //去掉搜索条件中任务状态和运单状态不符合当前模块的下拉值
    let index = state.filters.findIndex(item => item.key === 'orderType');
    const orderTypeArr = ['status_waiting_perfect', 'status_waiting_send', 'status_cancel_completed', 'status_check_all_completed']; //不符合的任务状态-待完善、待派发、已取消、已整审
    state.filters[index].options = state.filters[index].options.filter(item => !orderTypeArr.includes(item.value));
    index = state.filters.findIndex(item => item.key === 'statusType');
    const statusTypeArr = ['status_customer_order_completed', 'status_cancel_completed', 'status_settlement_completed']; //不符合的运单状态-已下单、已取消、已结算
    state.filters[index].options = state.filters[index].options.filter(item => !statusTypeArr.includes(item.value));
  }
  return state;
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const showOrderInfoPage = (dispatch, item, selfState, readonly) => {
  const key = item.orderNumber;
  if (helper.isTabExist(selfState.tabs, key)) {
    dispatch(action.assign({activeKey: key}));
  } else {
    const payload = {
      id: item.id,
      readonly
    };
    dispatch(action.add({key, title: key}, 'tabs'));
    dispatch(action.assign({[key]: payload, activeKey: key}));
  }
};

//撤销任务
const revokeActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems.filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/order/complete/revoke`, helper.postOption(ids));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('撤销成功');
  return updateTable(dispatch, action, getSelfState(getState()));
};

//运单更改
const changeActionCreator = async (dispatch, getState) => {
  const selfState = getSelfState(getState());
  const items = selfState.tableItems.filter(item => item.checked === true);
  if (items.length !== 1) return helper.showError(`请勾选一条记录`);
  const orderTypeArr = ['status_waiting_delivery', 'status_waiting_check', 'status_completed_check'];
  if(!orderTypeArr.includes(items[0].orderType)) {
    return helper.showError(`只能更改任务状态为待派单、待确认、已确认的单`);
  }
  return showOrderInfoPage(dispatch, items[0], selfState, false);
};

//取消运单
const cancelActionCreator = async (dispatch, getState) => {
  const selfState = getSelfState(getState());
  const items = selfState.tableItems.filter(item => item.checked === true);
  if (items.length !== 1) return helper.showError(`请勾选一条记录`);
  const value = await showPrompt('取消运单', '取消原因', '请确认是否取消运单，取消后的运单只能重新创建！');
  if (value) {
    const option = helper.postOption({reason: value, id: items[0].id});
    const {returnCode, returnMsg} = await helper.fetchJson(`/api/order/complete/cancel`, option);
    if (returnCode !== 0) {
      return helper.showError(returnMsg);
    }
    helper.showSuccessMsg('取消运单成功');
    return updateTable(dispatch, action, getSelfState(getState()));
  }
};

const buttons = {
  revoke: revokeActionCreator,
  change: changeActionCreator,
  cancel: cancelActionCreator,
};

const clickActionCreator = (key) => {
  if (buttons[key]) {
    return buttons[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const doubleClickActionCreator = (index) => (dispatch, getState) => {
  const selfState = getSelfState(getState());
  const item = selfState.tableItems[index];
  return showOrderInfoPage(dispatch, item, selfState, true);
};

// 查看
const linkActionCreator = (key, rowIndex, item) => (dispatch, getState) => {
  const selfState = getSelfState(getState());
  return showOrderInfoPage(dispatch, item, selfState, true);
};

const actionCreatorsEx = {
  onClick: clickActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onLink: linkActionCreator
};

export default createOrderPageContainer(action, getSelfState, actionCreatorsEx);
export {buildOrderPageState};

