import createOrderPageContainer, {buildOrderPageCommonState} from '../../../standard-business/OrderPage/createOrderPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";
import showPrompt from "../common/PromptDialog";

const STATE_PATH = ['all'];
const action = new Action(STATE_PATH);

//根据页面需求覆写和扩展页面状态属性
const buildOrderPageState = async () => {
  const urlConfig = '/api/order/all/config';
  const urlList = '/api/order/all/list';
  const statusNames = ['transport_order', 'order_type'];
  return buildOrderPageCommonState(urlConfig, urlList, statusNames, true);
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

//设为模板
const templateActionCreator = async (dispatch, getState) => {
  const selfState = getSelfState(getState());
  const items = selfState.tableItems.filter(item => item.checked === true);
  if (items.length !== 1) return helper.showError(`请勾选一条记录`);
  const value = await showPrompt('设为模板', '模板名称', undefined, 'text');
  if (value) {
    const option = helper.postOption({templateName: value, transportOrderId: items[0].id});
    const {returnCode, returnMsg} = await helper.fetchJson(`/api/order/all/template`, option);
    if (returnCode !== 0) {
      return helper.showError(returnMsg);
    }
    helper.showSuccessMsg('设为模板成功');
  }
};


const buttons = {
  template: templateActionCreator,
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

