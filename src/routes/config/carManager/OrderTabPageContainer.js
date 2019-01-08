import createOrderTabPageContainer, {buildOrderTabPageCommonState, updateTable} from '../../../standard-business/OrderTabPage/createOrderTabPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";
import showChangeStateDialog from './changeDialog/ChangeDialogContainer';

const STATE_PATH = ['carManager'];
const action = new Action(STATE_PATH);

//根据页面需求覆写和扩展页面状态属性
const buildOrderTabPageState = async () => {
  const urlConfig = '/api/config/car_manager/config';
  const urlList = '/api/config/car_manager/list';
  return buildOrderTabPageCommonState(urlConfig, urlList);
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

//变更状态
const changeStateActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if (checkedItems.length !== 1) return helper.showError(`请勾选一条记录`);
  if (true === await showChangeStateDialog(checkedItems[0].id)) {
    return updateTable(dispatch, action, getSelfState(getState()), ['use', 'unuse', 'repair', 'accident', 'stop']);
  }
};

//清空运单
const clearActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if (checkedItems.length !== 1) return helper.showError(`请勾选一条记录`);
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/config/car_manager/clear/${checkedItems[0].id}`, 'post');
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg(`操作成功`);
  return updateTable(dispatch, action, getSelfState(getState()));
};

const buttons = {
  change: changeStateActionCreator,
  clear: clearActionCreator
};

const clickActionCreator = (tabKey, key) => {
  if (buttons[key]) {
    return buttons[key](tabKey);
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

//暂无定义双击响应
const doubleClickActionCreator = (tabKey, index) => (dispatch, getState) => {
};

// 查看
const linkActionCreator = (tabKey, key, rowIndex, item) => (dispatch, getState) => {
  const selfState = getSelfState(getState());
  if (key === 'transportOrderId' || key === 'firstTransportOrderId') {
    return showOrderInfoPage(dispatch, {id: item[key].value, orderNumber: item[key].title}, selfState, true);
  }
};

const actionCreatorsEx = {
  onClick: clickActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onLink: linkActionCreator
};

export default createOrderTabPageContainer(action, getSelfState, actionCreatorsEx);
export {buildOrderTabPageState};

