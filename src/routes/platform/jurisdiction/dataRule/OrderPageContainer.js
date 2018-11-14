import { connect } from 'react-redux';
import OrderPage from '../../../basic/fromOddDefine/components/OrderPage/OrderPage';
import helper, {fetchJson, getObject, postOption, showError} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {search2} from '../../../../common/search';
import {buildEditDialogState} from '../../../../common/state';

const STATE_PATH = ['platform', 'jurisdiction', 'dataRule'];
const action = new Action(STATE_PATH);
const URL_DEL = '/api/platform/jurisdiction/dataRule/del';
const URL_SEARCH = '/api/platform/jurisdiction/dataRule/search';


const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) => (dispatch) =>{
  dispatch(action.assign({[key]: value}, 'searchData'));
};

const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch, getState) =>{
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex));
};

const searchAction = async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  const {result, returnCode, returnMsg} = await fetchJson(URL_SEARCH, postOption(searchData));
  if (returnCode !==0 ) return showError(returnMsg);
  dispatch(action.assign({tableItems: result}));
};


const resetAction = (dispatch) =>{
  dispatch( action.assign({searchData: {}}) );
};

const addAction = (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const payload = buildEditDialogState(editConfig, {}, false);
  dispatch(action.assign(payload, 'edit'));
};

const editAction = (dispatch, getState) => {
  const {editConfig, tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条进行编辑');
    return;
  }
  const payload = buildEditDialogState(editConfig, tableItems[index], true);
  payload.editIndex = index;
  dispatch(action.assign(payload, 'edit'));
};

const doubleClickActionCreator = (rowIndex) => (dispatch, getState) => {
  const {editConfig, tableItems} = getSelfState(getState());
  const payload = buildEditDialogState(editConfig, tableItems[rowIndex], true);
  payload.editIndex = rowIndex;
  dispatch(action.assign(payload, 'edit'));
};

const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条记录进行删除');
    return;
  }
  const item = tableItems[index];
  const {returnCode, returnMsg} = await fetchJson(`${URL_DEL}/${item.id}`, 'delete');
  if (returnCode === 0) {
    dispatch(action.del('tableItems', index));
    helper.showSuccessMsg('删除成功');
  }else {
    helper.showError(returnMsg);
  }
};



const toolbarActions = {
  reset: resetAction,
  search: searchAction,
  add: addAction,
  edit: editAction,
  del: delAction,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState);
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onDoubleClick: doubleClickActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
