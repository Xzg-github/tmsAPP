import createOrderTabPageContainer, {buildOrderTabPageCommonState, updateTable} from '../../order/common/OrderTabPage/createOrderTabPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";

const STATE_PATH = ['trackOrder'];
const action = new Action(STATE_PATH);

//根据页面需求覆写和扩展页面状态属性
const buildOrderTabPageState = async () => {
  const urlConfig = '/api/track/track_order/config';
  const urlList = '/api/track/track_order/list';
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
      url = `/api/order/input/charge_place_options`;
      data = await helper.fetchJson(url, helper.postOption({maxNumber: 10, districtName: filter}));
      break;
    }
    case 'supplierId': {
      url = `/api/config/supplierDriver/all_supplier`;
      data = await helper.fetchJson(url, helper.postOption({maxNumber: 10, filter}));
      break;
    }
    case 'carInfoId': {
      url = `/api/dispatch/done/car_drop_list`;
      data = await helper.fetchJson(url, helper.postOption({maxNumber: 10, carNumber: filter}));
      break;
    }
    case 'driverId': {
      url = `/api/dispatch/done/driver_drop_list`;
      data = await helper.fetchJson(url, helper.postOption({maxNumber: 10, diverName: filter}));
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

//运输已开始
const startedActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/track/track_order/started`, helper.postOption(ids));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('操作成功');
  return updateTable(dispatch, action, getSelfState(getState()), ['transport']);
};

//运输已完成
const completedActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/track/track_order/completed`, helper.postOption(ids));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('操作成功');
  return updateTable(dispatch, action, getSelfState(getState()), ['complete', 'sign']);
};

const buttons = {
  started: startedActionCreator,
  completed: completedActionCreator,
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
const linkActionCreator = (tabKey, key, rowIndex, item) => (dispatch, getState) => {
  const selfState = getSelfState(getState());
  return showOrderInfoPage(dispatch, item, selfState);
};

const actionCreatorsEx = {
  onSearch: searchActionCreator,
  onClick: clickActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onLink: linkActionCreator
};

export default createOrderTabPageContainer(action, getSelfState, actionCreatorsEx);
export {buildOrderTabPageState};

