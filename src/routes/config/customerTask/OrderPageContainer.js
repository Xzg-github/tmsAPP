import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import createOrderPageContainer, {buildOrderPageCommonState, updateTable} from '../../../standard-business/OrderPage/createOrderPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";
import showEditDialog from './EditDialogContainer';

const STATE_PATH = ['customerTask'];
const action = new Action(STATE_PATH);

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const urlConfig = '/api/config/customer_task/config';
  const urlList = '/api/config/customer_task/list';
  const payload = await buildOrderPageCommonState(urlConfig, urlList);
  dispatch(action.create(payload));
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const addActionCreator = async (dispatch, getState) => {
  const selfState = getSelfState(getState());
  if (true === await showEditDialog({}, 0)) {
    return updateTable(dispatch, action, selfState);
  }
};

const editActionCreator = async (dispatch, getState) => {
  const selfState = getSelfState(getState());
  const checkedItems = selfState.tableItems.filter(item => item.checked === true);
  if (checkedItems.length !== 1) return helper.showError(`请先勾选一条记录`);
  if (true === await showEditDialog(checkedItems[0], 1)) {
    return updateTable(dispatch, action, selfState);
  }
};

const lookActionCreator = async (dispatch, getState) => {
  const selfState = getSelfState(getState());
  const checkedItems = selfState.tableItems.filter(item => item.checked === true);
  if (checkedItems.length !== 1) return helper.showError(`请先勾选一条记录`);
  return showEditDialog(checkedItems[0], 2);
};

const delActionCreator = async (dispatch, getState) => {
  const selfState = getSelfState(getState());
  const checkedIds = selfState.tableItems.filter(item => item.checked === true).map(item => item.id);
  if (checkedIds.length < 1) return helper.showError('请先勾选记录');
  const url = `/api/config/customer_task/del`;
  const {returnCode, result, returnMsg} = await helper.fetchJson(url, helper.postOption(checkedIds));
  if (returnCode !== 0) return helper.showError(returnMsg);
  return updateTable(dispatch, action, selfState);
};

const buttons = {
  add: addActionCreator,
  edit: editActionCreator,
  del: delActionCreator,
  look: lookActionCreator
};

const clickActionCreator = (key) => {
  if (buttons[key]) {
    return buttons[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const selfState = getSelfState(getState());
  const item = selfState.tableItems[index];
  if (true === await showEditDialog(item, 1)) {
    return updateTable(dispatch, action, selfState);
  }
};

const actionCreatorsEx = {
  onClick: clickActionCreator,
  onDoubleClick: doubleClickActionCreator,
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(createOrderPageContainer(action, getSelfState, actionCreatorsEx));
export default connect(mapStateToProps, actionCreators)(Component);

