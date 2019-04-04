import createOrderTabPageContainer, {buildOrderTabPageCommonState, updateTable} from '../../../standard-business/OrderTabPage/createOrderTabPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";
import showDriverDialog from './DriverDialog/DriverDialogContainer';
import showSupplierDialog from './SupplierDialog/SupplierDialogContainer';
import showConfirmSupplierDialog from './ConfirmSupplierDialog/ConfirmSupplierDialogContainer';

const STATE_PATH = ['todo'];
const action = new Action(STATE_PATH);

//根据页面需求覆写和扩展页面状态属性
const buildOrderTabPageState = async (home) => {
  const urlConfig = '/api/dispatch/todo/config';
  const urlList = '/api/dispatch/todo/list';
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
    const payload = {
      id: item.id,
      readonly
    };
    dispatch(action.add({key, title: key}, 'tabs'));
    dispatch(action.assign({[key]: payload, activeKey: key}));
  }
};

//智能派单
const autoDispatchActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/dispatch/todo/auto_dispatch`, helper.postOption(ids));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('智能派单成功');
  return updateTable(dispatch, action, getSelfState(getState()), ['dispatch']);
};

//确认计划
const confirmPlanActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/dispatch/todo/confirm_plan`, helper.postOption(ids));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('确认计划成功');
  return updateTable(dispatch, action, getSelfState(getState()), ['driver', 'supplier']);
};

//撤消计划
const revokePlanActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/dispatch/todo/revoke_plan`, helper.postOption(ids));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('撤消计划成功');
  return updateTable(dispatch, action, getSelfState(getState()), ['auto']);
};

//人工派车
const dispatchDriverActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if (checkedItems.length !== 1) return helper.showError(`请勾选一条记录`);
  if (true === await showDriverDialog(checkedItems[0])) {
    return updateTable(dispatch, action, getSelfState(getState()), ['driver', 'supplier']);
  }
};

//人工派供应商
const dispatchSupplierActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if (checkedItems.length < 1) return helper.showError(`请先勾选记录`);
  if (true === await showSupplierDialog(checkedItems)) {
    return updateTable(dispatch, action, getSelfState(getState()), ['driver', 'supplier']);
  }
};

//司机确认
const confirmDriverActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/dispatch/todo/confirm_driver`, helper.postOption(ids));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('确认成功');
  return updateTable(dispatch, action, getSelfState(getState()));
};

//供应商确认
const confirmSupplierActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if (checkedItems.length !== 1) return helper.showError(`请勾选一条记录`);
  if (true === await showConfirmSupplierDialog(checkedItems.pop())) {
    helper.showSuccessMsg('确认成功');
    return updateTable(dispatch, action, getSelfState(getState()));
  }
};

//撤消派单
const revokeDriverOrSupplierActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/dispatch/todo/revoke_driver_or_supplier`, helper.postOption(ids));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('撤消成功');
  return updateTable(dispatch, action, getSelfState(getState()), ['dispatch']);
};

const buttons = {
  autoDispatch: autoDispatchActionCreator,   //智能派单
  confirmPlan: confirmPlanActionCreator,     //确认计划
  revokePlan: revokePlanActionCreator,      //撤消计划
  dispatchDriver: dispatchDriverActionCreator, //人工派车
  dispatchSupplier: dispatchSupplierActionCreator, //人工派供应商
  confirmDriver: confirmDriverActionCreator, //司机确认
  revokeDriver: revokeDriverOrSupplierActionCreator, //撤消派单
  confirmSupplier: confirmSupplierActionCreator, //供应商确认
  revokeSupplier: revokeDriverOrSupplierActionCreator, //撤消派单
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
  // onSearch: searchActionCreator,
  onClick: clickActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onLink: linkActionCreator
};

export default createOrderTabPageContainer(action, getSelfState, actionCreatorsEx);
export {buildOrderTabPageState};

