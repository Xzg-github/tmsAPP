import { connect } from 'react-redux';
import OrderPage from './OrderPage/OrderPage';
import {
  findOnlyCheckedIndex,
  getObject,
  showSuccessMsg,
  showError,
  fetchJson,
  getJsonResult
} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';


const STATE_PATH = ['message', 'messageSubscribe'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/message/messageSubscribe/list';
const URL_CANCEL = '/api/message/messageSubscribe/delete'

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const cancelActionCreator = async(dispatch, getState) => {
  const {tableItems} =getSelfState(getState());
  const index = findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    return showError('请选择一条消息取消订阅');
  }
  let checkedId = tableItems[index].id;
  const {returnCode} = await fetchJson(`${URL_CANCEL}/${checkedId}`,'delete');
  if(returnCode !== 0){
    showError('操作失败');
    return;
  }
  const messageList = getJsonResult(await fetchJson(URL_LIST));
  dispatch(action.assign({tableItems: messageList}));
  showSuccessMsg('操作成功');
};

const toolbarActions = {
  subscribe_cancel: cancelActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const actionCreators = {
  onClick: clickActionCreator,
  onCheck: checkActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
