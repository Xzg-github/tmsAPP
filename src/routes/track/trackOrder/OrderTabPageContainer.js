import createOrderTabPageContainer, {buildOrderTabPageCommonState, updateTable} from '../../../standard-business/OrderTabPage/createOrderTabPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";
import showPrompt from "../../order/common/PromptDialog";

const STATE_PATH = ['trackOrder'];
const action = new Action(STATE_PATH);

//根据页面需求覆写和扩展页面状态属性
const buildOrderTabPageState = async () => {
  const urlConfig = '/api/track/track_order/config';
  const urlList = '/api/track/track_order/list';
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
  const value = await showPrompt('运输已开始', '开始时间', undefined, 'date', {showTime: true});
  if(value) {
    const {returnCode, returnMsg} = await helper.fetchJson(`/api/track/track_order/started`, helper.postOption({ids, finishTime: value}));
    if (returnCode !== 0) return helper.showError(returnMsg);
    helper.showSuccessMsg('操作成功');
    return updateTable(dispatch, action, getSelfState(getState()), ['transport']);
  }
};

//运输已完成
const completedActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const value = await showPrompt('运输已完成', '完成时间', undefined, 'date', {showTime: true});
  if(value) {
    const {returnCode, returnMsg} = await helper.fetchJson(`/api/track/track_order/completed`, helper.postOption({ids, finishTime: value}));
    if (returnCode !== 0) return helper.showError(returnMsg);
    helper.showSuccessMsg('操作成功');
    return updateTable(dispatch, action, getSelfState(getState()), ['complete', 'sign']);
  }
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
  onClick: clickActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onLink: linkActionCreator
};

export default createOrderTabPageContainer(action, getSelfState, actionCreatorsEx);
export {buildOrderTabPageState};

