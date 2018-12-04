import createOrderTabPageContainer, {buildOrderTabPageCommonState, updateTable} from '../common/OrderTabPage/createOrderTabPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";

const STATE_PATH = ['pending'];
const action = new Action(STATE_PATH);

//根据页面需求覆写和扩展页面状态属性
const buildOrderTabPageState = async () => {
  const urlConfig = '/api/order/pending/config';
  const urlList = '/api/order/pending/list';
  return buildOrderTabPageCommonState(urlConfig, urlList);
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
  const ids = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/order/pending/send`, helper.postOption(ids));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('任务派发成功');
  return updateTable(dispatch, action, getSelfState(getState()));
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
  onSearch: searchActionCreator,
  onClick: clickActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onLink: linkActionCreator
};

export default createOrderTabPageContainer(action, getSelfState, actionCreatorsEx);
export {buildOrderTabPageState};

