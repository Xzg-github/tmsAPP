import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {postOption, getObject, fetchJson, showError, showSuccessMsg} from '../../../common/common';
import {toFormValue, hasSign} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildEditState} from './EditDialogContainer';
import {search2} from '../../../common/search';
import {showColsSetting} from '../../../common/tableColsSetting';
import {showImportDialog} from '../../../common/modeImport';
import {exportExcelFunc} from '../../../common/exportExcelSetting';
import helper from "../../../common/common";

const STATE_PATH = ['config', 'insideFactory'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/config/inside_factory/list';
const URL_DELETE = '/api/config/inside_factory/delete';
const URL_ENABLE = '/api/config/inside_factory/enable';
const URL_ALLCUSTOMER = '/api/config/inside_factory/allCustomer';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak));
};

const checkedOne = (tableItems) => {
  const index = tableItems.reduce((result, item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return index.length !== 1 ? -1 : index[0];
};

const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1, sortInfo:{}, filterInfo:{}};
  return search2(dispatch, action, URL_LIST, 1, pageSize, toFormValue(searchData), newState);
};

const resetActionCreator = (dispatch) =>{
  dispatch( action.assign({searchData: {}}) );
};

//新增
const addAction = (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const payload = buildEditState(editConfig, {}, false);
  dispatch(action.assign(payload, 'edit'));
};

//编辑
const editAction = (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index !== -1) {
    const payload = buildEditState(editConfig, tableItems[index], true);
    dispatch(action.assign(payload, 'edit'));
  }else{
    return showError('请勾选一条记录');
  }
};

// 批量删除 后端接口需要数据ID组成的数组
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

//启用
const enableAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems.filter(item => item.checked);
  if (checkedItems.length === 0) return showError('请选择记录') ;
  if(checkedItems.some(item => item.enabledType !== 'enabled_type_unenabled')){
    return showError('只能启用未启用状态的记录!');
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

//禁用联系人
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

//配置字段按钮
const configActionCreator = (dispatch, getState) => {
  const {tableCols} = getSelfState(getState());
  const okFunc = (newCols) => {
    dispatch(action.assign({tableCols: newCols}));
  };
  showColsSetting(tableCols, okFunc, 'customer_factory');
};

//导入按钮
const importActionCreator = () => {
  return showImportDialog('customer_consignee_consignor_import');
};

//导出
const exportActionCreator =(dispatch,getState)=>{
  const {tableItms, searchData} = getSelfState(getState());
  return exportExcelFunc(tableItms, searchData);
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchClickActionCreator,
  add: addAction,
  edit: editAction,
  enable: enableAction,
  disable: disableAction,
  delete: delAction,
  config: configActionCreator,
  import: importActionCreator,
  export:exportActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const formSearchActionCreator = (key, value) => async (dispatch) => {
  if(key === 'customerId'){
    const option = helper.postOption({maxNumber: 10, customerId: value});
    let data = await fetchJson(URL_ALLCUSTOMER, option);
    if (data.returnCode === 0) {
      dispatch(action.update({options:data.result},'filters',{key:'key',value:key}));
    }
  }
};

const changeActionCreator = (key, value) => (dispatch) =>{
  dispatch(action.assign({[key]: value}, 'searchData'));
};

const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch) =>{
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex));
};

const doubleClickActionCreator = (rowIndex) => (dispatch, getState) => {
  if (!hasSign('factory', 'factory_edit')) return;
  const {tableItems, editConfig} = getSelfState(getState());
  const payload = buildEditState(editConfig, tableItems[rowIndex], true);
  dispatch(action.assign(payload, 'edit'));
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage, sortInfo:{}, filterInfo:{}};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage, sortInfo:{}, filterInfo:{}};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
};

//前端表格排序和过滤
const tableChangeActionCreator = (sortInfo, filterInfo) => (dispatch) => {
  dispatch(action.assign({sortInfo, filterInfo}));
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
  onSearch: formSearchActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onTableChange: tableChangeActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export{updateTable};
