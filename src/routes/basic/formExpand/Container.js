import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {EnhanceLoading} from '../../../components/Enhance';
import helper from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search, search2} from '../../../common/search';
import {buildOrderPageState} from '../../../common/state';
import {setDictionary2,fetchDictionary, getDictionaryNames} from '../../../common/dictionary';
import {dealActions} from '../../../common/check';
import showAddDialog from './AddDialog';
import showSetDialog from './setDialog/SetDialogContainer';

const STATE_PATH = ['basic', 'formExpand'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/basic/formExpand/config';
const URL_LIST = '/api/basic/formExpand/list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const config = await helper.fetchJson(URL_CONFIG);
  if (config.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  const {index, addConfig, setConfig} = config.result;
  const list = await search(URL_LIST, 0, index.pageSize, {});
  if (list.returnCode !== 0) {
    helper.showError(list.returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  const {tableCols, filters} = index;
  let data = await fetchDictionary(getDictionaryNames(tableCols, filters, addConfig.controls));
  if(data.returnCode !== 0){
    helper.showError(data.returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  setDictionary2(data.result, tableCols, filters, addConfig.controls);
  const payload = buildOrderPageState(list.result, index, {addConfig, setConfig});
  payload.buttons = dealActions(payload.buttons, 'formExpand');
  payload.status = 'page';
  dispatch(action.create(payload));
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'searchData');
};

// 搜索
const searchAction = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState);
};

// 清空搜索框
const resetActionCreator = () => {
  return action.assign({searchData: {}});
};

// 弹出新增对话框
const addAction = async (dispatch, getState) => {
  const {addConfig, setConfig} = getSelfState(getState());
  const res = await showAddDialog(addConfig);
  if (res.isOk) {
    await showSetDialog(res.item, setConfig);
    return searchAction(dispatch, getState);
  }
};

// 弹出设置表单字段对话框
const setAction = async (dispatch, getState) => {
  const {tableItems, setConfig} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    helper.showError('请先勾选一条记录');
    return;
  }
  const item = tableItems[index];
  if (true === await showSetDialog(item, setConfig)) {
    return searchAction(dispatch, getState);
  }
};

// 弹出设置表单字段对话框
const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const {tableItems, setConfig} = getSelfState(getState());
  const item = tableItems[index];
  if (true === await showSetDialog(item, setConfig)) {
    return searchAction(dispatch, getState);
  }
};

// 禁用
const disableAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    helper.showError('请先勾选一条记录');
    return;
  }
  const item = tableItems[index];
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/basic/formExpand/status/${item.id}/enabled_type_disabled`, 'put');
  if (returnCode !== 0) {
    helper.showError(returnMsg);
    return;
  }
  helper.showSuccessMsg('操作成功');
  dispatch(action.update({enabledType: 'enabled_type_disabled'}, 'tableItems', index));
};

// 启用
const enableAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    helper.showError('请先勾选一条记录');
    return;
  }
  const item = tableItems[index];
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/basic/formExpand/status/${item.id}/enabled_type_enabled`, 'put');
  if (returnCode !== 0) {
    helper.showError(returnMsg);
    return;
  }
  helper.showSuccessMsg('操作成功');
  dispatch(action.update({enabledType: 'enabled_type_enabled'}, 'tableItems', index));
};

const toolbarActions = {
  reset: resetActionCreator(),
  search: searchAction,
  add: addAction,
  set: setAction,
  enable: enableAction,
  disable: disableAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
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
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(OrderPage));
export default Container;

