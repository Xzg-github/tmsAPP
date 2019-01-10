import createOrderPageContainer, {buildOrderPageCommonState} from '../../../standard-business/OrderPage/createOrderPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";

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

};

//查看轨迹
const lineActionCreator = (dispatch, getState) => {

};

//位置更新
const updateActionCreator = (dispatch, getState) => {

};

//更新为已完成
const completeActionCreator = (dispatch, getState) => {

};

//获取最新位置
const refreshActionCreator = (dispatch, getState) => {

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

