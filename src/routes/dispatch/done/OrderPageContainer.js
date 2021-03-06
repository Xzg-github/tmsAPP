import createOrderPageContainer, {buildOrderPageCommonState, updateTable} from '../../../standard-business/OrderPage/createOrderPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";
import showChangeDialog from './ChangeDialog/ChangeDialogContainer';

const STATE_PATH = ['done'];
const action = new Action(STATE_PATH);

//根据页面需求覆写和扩展页面状态属性
const buildOrderPageState = async () => {
  const urlConfig = '/api/dispatch/done/config';
  const urlList = '/api/dispatch/done/list';
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

const revokeActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems.filter(item => item.checked === true).map(item => item.id);
  if (ids.length < 1) return helper.showError(`请先勾选记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/dispatch/done/revoke`, helper.postOption(ids));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('撤销成功');
  return updateTable(dispatch, action, getSelfState(getState()));
};

const changeActionCreator = async (dispatch, getState) => {
  const selfState = getSelfState(getState());
  const items = selfState.tableItems.filter(item => item.checked === true);
  if (items.length !== 1) return helper.showError(`请勾选一条记录`);
  if (items[0].orderType !== 'status_completed_check') return helper.showError(`只能操作任务状态为已确认的运单`);
  if (true === await showChangeDialog(items[0])) {
    return updateTable(dispatch, action, getSelfState(getState()));
  }
};

const buttons = {
  revoke: revokeActionCreator,
  change: changeActionCreator,
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

