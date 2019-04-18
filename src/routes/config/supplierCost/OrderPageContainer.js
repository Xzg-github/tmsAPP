import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import helper,{fetchJson, showError} from '../../../common/common';
import {toFormValue, dealActions} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildOrderPageState} from '../../../common/orderAdapter';
import {search,search2} from '../../../common/search';
import showEditDialog from './EditDialogContainer';

const STATE_PATH = ['supplierCost'];
const URL_CONFIG = '/api/config/supplier_cost/config';
const URL_LIST = '/api/config/supplier_cost/list';
const URL_SUPPLIER_OPTIONS = '/api/config/supplier_contact/customer';
const URL_DEL = '/api/config/supplier_cost/del';

const action = new Action(STATE_PATH);

export const buildClearingUnitState = async () => {
  let res, data, config;
  data = await fetchJson(URL_CONFIG);
  if (data.returnCode !== 0) {
    showError('get config failed');
    return;
  }
  config = data.result;
  config.index.buttons = dealActions(config.index.buttons, 'supplier_cost');
  res = await search(URL_LIST, 0, config.index.pageSize, {});
  if(res.returnCode !== 0){
    showError(res.returnMsg);
    return;
  }

  data = res.result;
  return buildOrderPageState(data, config.index, {editConfig: config.edit});
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};


//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak));
};

const addAction = async (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  if (true === await showEditDialog(editConfig, {}, false)) {
    return updateTable(dispatch, getState);
  }
};

const editAction = async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    if (true === await showEditDialog(editConfig, tableItems[index], true)) {
      return updateTable(dispatch, getState);
    }
  }else {
    helper.showError('请勾选一条记录编辑');
  }
};

const findCheckedIndex1 = (items) => {
  const index = items.reduce((result = [], item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return !index.length ? -1 : index;
};

const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = findCheckedIndex1(tableItems);
  if (index === -1) {
    showError('请勾选一条记录进行删除');
    return;
  }
  const {returnCode, returnMsg} = await helper.fetchJson(URL_DEL, helper.postOption([tableItems[index].id], 'delete'));
  if (returnCode !== 0) return helper.showError(returnMsg);
  return updateTable(dispatch, getState);
};

const resetActionCreator = (dispatch) =>{
  dispatch( action.assign({searchData: {}}) );
};

const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, toFormValue(searchData), newState);
};


const toolbarActions = {
  add: addAction,
  edit:editAction,
  search: searchClickActionCreator,
  del: delAction,
  reset: resetActionCreator
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const changeActionCreator = (key, value) => (dispatch) =>{
  dispatch(action.assign({[key]: value}, 'searchData'));
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
  const {filters} = getSelfState(getState());
  let data, options, body;
  switch (key) {
    case 'supplierId': {
      body = {maxNumber: 20, filter:title};
      data = await fetchJson(URL_SUPPLIER_OPTIONS, helper.postOption(body));
      break;
    }
    default:
      return;
  }
  if (data.returnCode !== 0) {
    return;
  }
  options = data.result;
  const index = filters.findIndex(item => item.key === key);
  dispatch(action.update({options}, 'filters', index));
};
const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch, getState) =>{
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex));
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
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
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
