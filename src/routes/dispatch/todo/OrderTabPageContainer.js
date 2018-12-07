import createOrderTabPageContainer, {buildOrderTabPageCommonState, updateTable} from '../../order/common/OrderTabPage/createOrderTabPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";

const STATE_PATH = ['todo'];
const action = new Action(STATE_PATH);

//根据页面需求覆写和扩展页面状态属性
const buildOrderTabPageState = async () => {
  const urlConfig = '/api/dispatch/todo/config';
  const urlList = '/api/dispatch/todo/list';
  const statusNames = ['transport_order', 'order_type'];
  return buildOrderTabPageCommonState(urlConfig, urlList, statusNames);
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const searchActionCreator = (key, filter) => async (dispatch) => {
  let data, options, url;
  switch (key) {
    case 'customerId': {
      url = `/api/config/customer_contact/allCustomer`;
      data = await helper.fetchJson(url, helper.postOption({maxNumber: 10, filter}));
      break;
    }
    case 'dispatchUser':
    case 'customerServiceId': {
      url = `/api/basic/user/name`;
      data = await helper.fetchJson(url, helper.postOption({filter}));
      break;
    }
    case 'carModeId': {
      url = `/api/order/input/car_mode_drop_list`;
      data = await helper.fetchJson(url, helper.postOption({maxNumber: 10, carMode: filter}));
      break;
    }
    case 'departure':
    case 'destination': {
      url = `/api/config/customer_factory/charge_place_options`;
      data = await helper.fetchJson(url, helper.postOption({maxNumber: 10, placeName: filter}));
      break;
    }
    case 'supplierId': {
      url = `/api/config/supplierDriver/all_supplier`;
      data = await helper.fetchJson(url, helper.postOption({maxNumber: 10, filter}));
      break;
    }
    case 'carInfoId': {
      url = `/api/dispatch/todo/car_drop_list`;
      data = await helper.fetchJson(url, helper.postOption({maxNumber: 10, filter}));
      break;
    }
    case 'driverId': {
      url = `/api/dispatch/todo/driver_drop_list`;
      data = await helper.fetchJson(url, helper.postOption({maxNumber: 10, filter}));
      break;
    }
    default:
      return;
  }
  if (data.returnCode === 0) {
    options = data.result instanceof Array? data.result:data.result.data;
    dispatch(action.update({options}, 'filters', {key: 'key', value: key}));
  }
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

};

//人工派供应商
const dispatchSupplierActionCreator = (tabKey) => async (dispatch, getState) => {

};

//司机or供应商确认
const confirmDriverOrSupplierActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/dispatch/todo/confirm_driver_or_supplier`, helper.postOption(ids));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('确认成功');
  return updateTable(dispatch, action, getSelfState(getState()));
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
  confirmDriver: confirmDriverOrSupplierActionCreator, //司机确认
  revokeDriver: revokeDriverOrSupplierActionCreator, //撤消派单
  confirmSupplier: confirmDriverOrSupplierActionCreator, //供应商确认
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
  onSearch: searchActionCreator,
  onClick: clickActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onLink: linkActionCreator
};

export default createOrderTabPageContainer(action, getSelfState, actionCreatorsEx);
export {buildOrderTabPageState};

