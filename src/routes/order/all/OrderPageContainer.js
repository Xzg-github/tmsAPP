import createOrderPageContainer, {buildOrderPageCommonState} from '../common/OrderPage/createOrderPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";

const STATE_PATH = ['all'];
const action = new Action(STATE_PATH);

//根据页面需求覆写和扩展页面状态属性
const buildOrderPageState = async () => {
  const urlConfig = '/api/order/all/config';
  const urlList = '/api/order/all/list';
  const statusNames = ['transport_order', 'order_type'];
  return buildOrderPageCommonState(urlConfig, urlList, statusNames);
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


const buttons = {
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
  onSearch: searchActionCreator,
  onClick: clickActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onLink: linkActionCreator
};

export default createOrderPageContainer(action, getSelfState, actionCreatorsEx);
export {buildOrderPageState};

