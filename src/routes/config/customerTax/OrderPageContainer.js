import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import helper, {getObject, fetchJson, showError, postOption, showSuccessMsg} from '../../../common/common';
import {search2} from '../../../common/search';
import {showImportDialog} from '../../../common/modeImport';
import {exportExcelFunc} from '../../../common/exportExcelSetting';
import showEditDialog from './EditDialogContainer'
import {toFormValue} from "../../../common/check";

const STATE_PATH = ['customerTax'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/config/customer_tax/list';
const URL_ENABLE = '/api/config/customer_tax/enable';
const URL_DELETE = '/api/config/customer_tax/delete';
const URL_ALLCUSTOMER = '/api/config/customer_contact/customer';
const URL_ALLITEM = '/api/config/customer_tax/allItems';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak))
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
  const {editConfig} = getSelfState(getState());
  await showEditDialog(editConfig,{},false);
};

// 弹出编辑对话框
const editAction = async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    return showError('请勾选一条记录');
  }
  await showEditDialog(editConfig,tableItems[index],true);
};

// 批量删除
const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems.filter(item => item.checked);
  if (checkedItems.length === 0) return showError('请选择记录') ;
  if(checkedItems.some(item => item.enabledType !== 'enabled_type_unenabled')){
    return showError('只能删除未启用状态的记录!');
  }
  const ids = checkedItems.map(item => item.id);
  const {returnCode, returnMsg} = await fetchJson(URL_DELETE, postOption(ids, 'delete'));
  if (returnCode === 0) {
    showSuccessMsg('记录已删除');
    return updateTable(dispatch, getState);
  }else{
    return showError(returnMsg);
  }
};

//启用记录
const enableAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems.filter(item => item.checked);
  if (checkedItems.length === 0) return showError('请选择记录') ;
  if(checkedItems.some(item => item.enabledType === 'enabled_type_enabled')){
    return showError('包含已启用状态的记录!');
  }
  const ids = checkedItems.map(item => item.id);
  const {returnCode, returnMsg} = await fetchJson(`${URL_ENABLE}/enabled_type_enabled`, postOption(ids, 'put'));
  if (returnCode === 0) {
    showSuccessMsg('记录已启用');
    return updateTable(dispatch, getState);
  }else{
    return showError(returnMsg);
  }
};

//禁用记录
const disableAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems.filter(item => item.checked);
  if (checkedItems.length === 0) return showError('请选择记录') ;
  if(checkedItems.some(item => item.enabledType !== 'enabled_type_enabled')){
    return showError('只能禁用已启用状态的记录!');
  }
  const ids = checkedItems.map(item => item.id);
  const {returnCode, returnMsg} = await fetchJson(`${URL_ENABLE}/enabled_type_disabled`, postOption(ids, 'put'));
  if (returnCode === 0) {
    showSuccessMsg('记录已禁用');
    return updateTable(dispatch, getState);
  }else{
    return showError(returnMsg);
  }
};

//导入按钮
const importActionCreator = () => {
  return showImportDialog('customer_tax_import');
};

//导出
const exportActionCreator =(dispatch, getState)=>{
  const {tableCols, tableItems} = getSelfState(getState());
  return exportExcelFunc(tableCols, tableItems);
};

const toolbarActions = {
  reset: resetActionCreator(),
  search: searchAction,
  add: addAction,
  edit: editAction,
  enable: enableAction,
  disable: disableAction,
  delete: delAction,
  import: importActionCreator,
  export:exportActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    return {type: 'unknown',};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const changeActionCreator = (key, value) => {
  if (key === 'taxRate') {
    if (value > 100) {
      value = null;
      showError('税率必须小于100');
    }
  }
  return action.assign({[key]: value}, 'searchData');
};

const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  await showEditDialog(editConfig,tableItems[index],true);
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

const filterSearchActionCreator = (key, value) =>async(dispatch)=> {
  if(key === 'customerId'){
    const option = helper.postOption({maxNumber: 65536, customerId: value});
    let data = await fetchJson(URL_ALLCUSTOMER, option);
    if (data.returnCode === 0) {
      dispatch(action.update({options:data.result},"filters",{key:"key",value:key}));
    }
  }else if(key === 'chargeItemId'){
    const option = helper.postOption({maxNumber: 65536, customerId: value});
    let data = await fetchJson(URL_ALLITEM, option);
    if (data.returnCode === 0) {
      dispatch(action.update({options:data.result},"filters",{key:"key",value:key}));
    }
  }
};

const actionCreators = {
  onSearch:filterSearchActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator
};


const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable};
