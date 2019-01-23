import createOrderPageContainer, {buildOrderPageCommonState, updateTable} from '../../../standard-business/OrderPage/createOrderPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";
import showUpdateDialog from "./UpdateDialog";
import showPositionDialog from "./PositionDialog";
import showLineDialog from "./LineDialog";

const STATE_PATH = ['trackTransport'];
const action = new Action(STATE_PATH);

//根据页面需求覆写和扩展页面状态属性
const buildOrderPageState = async () => {
  const urlConfig = '/api/track/track_transport/config';
  const urlList = '/api/track/track_transport/list';
  const statusNames = ['transport_order', 'order_type'];
  return buildOrderPageCommonState(urlConfig, urlList, statusNames);
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

//查看位置
const positionActionCreator = (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems.filter(item => item.checked === true);
  if (checkedItems.length < 1) {
    helper.showError('请先勾选记录');
  }
  return showPositionDialog(checkedItems);
};

//查看轨迹
const lineActionCreator = (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems.filter(item => item.checked === true);
  if (checkedItems.length !== 1) {
    helper.showError('请勾选一条记录');
  }else {
    return showLineDialog(checkedItems[0]);
  }
};

//位置更新
const updateActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems.filter(item => item.checked === true);
  if (checkedItems.length !== 1) {
    helper.showError('请勾选一条记录');
  } else {
    if (true === await showUpdateDialog(checkedItems[0])) {
      return updateTable(dispatch, action, getSelfState(getState()));
    }
  }
};

//更新为已完成
const completeActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems.filter(item => item.checked === true);
  if (checkedItems.length < 1) return helper.showError(`请先勾选记录`);
  if (!checkedItems.every(item => item.statusType === 'status_in_transport')) return helper.showError(`只能操作运单状态为运输已开始的单`);
  const ids = checkedItems.map(item => item.id);
  const url = `/api/track/track_order/completed`;
  const {returnCode, returnMsg} = await helper.fetchJson(url, helper.postOption(ids));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg(`操作成功`);
  return updateTable(dispatch, action, getSelfState(getState()));
};

//获取最新位置
const refreshActionCreator = async (dispatch, getState) => {
  const {returnCode} = await helper.fetchJson(`/api/track/track_transport/refresh_position`);
  if (returnCode !== 0) {
    helper.showError(`操作失败`);
  }else {
    helper.showSuccessMsg(`操作成功`);
  }
};

const buttons = {
  position: positionActionCreator,
  line: lineActionCreator,
  update: updateActionCreator,
  complete: completeActionCreator,
  refresh: refreshActionCreator,
};

const clickActionCreator = (key) => {
  if (buttons[key]) {
    return buttons[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

//双击暂无定义响应
const doubleClickActionCreator = (index) => (dispatch, getState) => {
};

// 查看
const linkActionCreator = (key, rowIndex, item) => (dispatch, getState) => {
  const selfState = getSelfState(getState());
  if (key === 'orderNumber') {
    return showOrderInfoPage(dispatch, item, selfState, true);
  }else if (key === 'firstTransportOrderId') {
    return showOrderInfoPage(dispatch, {id: item[key].value, orderNumber: item[key].title}, selfState, true);
  }
};

const actionCreatorsEx = {
  onClick: clickActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onLink: linkActionCreator
};

export default createOrderPageContainer(action, getSelfState, actionCreatorsEx);
export {buildOrderPageState};

