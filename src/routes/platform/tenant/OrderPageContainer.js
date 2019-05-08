import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {fetchJson, showError, showSuccessMsg} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search2} from '../../../common/search';
import helper from "../../../common/common";
import showUserManagerDialog from "./userManager/showUserManagerDialog";
import showEditDialog from './EditDialogContainer';

const STATE_PATH = ['basic', 'tenant'];
const URL_LIST = '/api/basic/tenant/list';
const URL_ACTIVE = '/api/basic/tenant/active';
const URL_DEL = '/api/basic/tenant';

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const checkedOne = (tableItems) => {
  const index = tableItems.reduce((result, item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return index.length !== 1 ? -1 : index[0];
};

const changeActionCreator = (key, value) => (dispatch) =>{
  dispatch(action.assign({[key]: value}, 'searchData'));
};

const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch, getState) =>{
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex));
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

const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState);
};

const resetActionCreator = (dispatch) =>{
  dispatch( action.assign({searchData: {}}) );
};

const addAction = async (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  if (true === await showEditDialog(editConfig, {}, false)) {
    helper.showSuccessMsg(`操作成功`);
    return searchClickActionCreator(dispatch, getState);
  }
};

const editAction = async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index !== -1) {
    if (true === await showEditDialog(editConfig, tableItems[index], true)) {
      helper.showSuccessMsg(`操作成功`);
      return searchClickActionCreator(dispatch, getState);
    }
  }
};

const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  if (true === await showEditDialog(editConfig, tableItems[rowIndex], true)) {
    helper.showSuccessMsg(`操作成功`);
    return searchClickActionCreator(dispatch, getState);
  }
};

const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index === -1) {
    showError('请勾选一条记录进行删除');
    return;
  }
  const item = tableItems[index];
  const {returnCode, returnMsg, result} = await fetchJson(`${URL_DEL}/${item.guid}`, 'delete');
  if (returnCode === 0) {
    if (result.active) {
      dispatch(action.update(result, 'tableItems', index));
    } else {
      dispatch(action.del('tableItems', index));
    }
    showSuccessMsg('删除成功');
  }else {
    showError(returnMsg);
  }
};

const activeAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index === -1) {
    showError('请勾选一条记录进行激活');
    return;
  }
  const item = tableItems[index];
  const {returnCode, returnMsg, result} = await fetchJson(`${URL_ACTIVE}/${item.guid}`, 'put');
  if (returnCode === 0) {
    dispatch(action.update(result, 'tableItems', index));
    showSuccessMsg('激活成功');
  }else {
    showError(returnMsg);
  }
};

// 用户管理
const userAction = async (dispatch, getState) => {
  const {tableItems, userConfig} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    return showUserManagerDialog(userConfig, tableItems[index]);
  }else {
    helper.showError('请先勾选一条记录');
  }
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchClickActionCreator,
  add: addAction,
  edit: editAction,
  del: delAction,
  active: activeAction,
  user: userAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onSearch: formSearchActionCreator,
  onDoubleClick: doubleClickActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
