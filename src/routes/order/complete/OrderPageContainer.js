import createOrderPageContainer, {buildOrderPageCommonState, updateTable} from '../common/OrderPage/createOrderPageContainer';
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

const revokeActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems.filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/order/complete/revoke`, helper.postOption(ids));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('撤销成功');
  return updateTable(dispatch, action, getSelfState(getState()));
};

const changeActionCreator = async (dispatch, getState) => {
  const selfState = getSelfState(getState());
  const items = selfState.tableItems.filter(item => item.checked === true);
  if (items.length !== 1) return helper.showError(`请勾选一条记录`);
  return showOrderInfoPage(dispatch, items[0], selfState, false);
};

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
  onSearch: searchActionCreator,
  onClick: clickActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onLink: linkActionCreator
};

export default createOrderPageContainer(action, getSelfState, actionCreatorsEx);
export {buildOrderPageState};

