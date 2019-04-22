import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import helper, {fetchJson, showError} from '../../../common/common';
import {search2} from '../../../common/search';
import {commonExport, exportExcelFunc} from '../../../common/exportExcelSetting';
import {toFormValue} from "../../../common/check";
import showEditDialog from './EditDialogContainer';
import showTemplateManagerDialog from "../../../standard-business/template/TemplateContainer";
import {dealExportButtons} from "../customerContact/RootContainer";

const STATE_PATH = ['customerService'];
const URL_LIST = '/api/config/customer_service/list';
const URL_ACTIVE = '/api/config/customer_service/active';
const URL_INVALID = '/api/config/customer_service/invalid';
const URL_DETAIL = '/api/config/customer_service/detail';
const URL_CUSTOMER_OPTIONS = '/api/config/customer_contact/customer';
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
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

//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak));
};

// 清空搜索框
const resetActionCreator = () => {
  return action.assign({searchData: {}});
};

// 弹出新增对话框
const addAction = async (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  if (true === await showEditDialog(editConfig, {}, false)) {
    return updateTable(dispatch, getState);
  }
};

// 弹出编辑对话框
const editAction = async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const id = tableItems[index].id;
    const {returnCode, returnMsg, result} = await fetchJson(`${URL_DETAIL}/${id}`);
    if (returnCode === 0) {
      if (true === await showEditDialog(editConfig, result, true)) {
        return updateTable(dispatch, getState);
      }
    } else {
      showError(returnMsg);
    }
  }else {
    helper.showError('请勾选一条记录编辑');
  }
};

const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const id = tableItems[index].id;
  const {returnCode, returnMsg, result} = await fetchJson(`${URL_DETAIL}/${id}`);
  if (returnCode === 0) {
    if (true === await showEditDialog(editConfig, result, true)) {
      return updateTable(dispatch, getState);
    }
  } else {
    showError(returnMsg);
  }
};

// 删除(失效)
const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems.filter(item => item.checked === true).map(item => item.id);
  if (ids.length > 0) {
    const {returnCode, returnMsg} = await fetchJson(URL_INVALID, helper.postOption(ids, 'put'));
    if (returnCode === 0) {
      helper.showSuccessMsg('记录已失效');
      return updateTable(dispatch, getState);
    } else {
      showError(returnMsg);
    }
  }else {
    helper.showError('请先勾选记录');
  }
};

// 激活
const activeAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems.filter(item => item.checked === true).map(item => item.id);
  if (ids.length > 0) {
    const {returnCode, returnMsg} = await fetchJson(URL_ACTIVE, helper.postOption(ids, 'put'));
    if (returnCode === 0) {
      helper.showSuccessMsg('记录已激活');
      return updateTable(dispatch, getState);
    } else {
      showError(returnMsg);
    }
  }else {
    helper.showError('请先勾选记录');
  }
};

//页面导出
const exportPageActionCreator = (subKey) => (dispatch, getState) => {
  const {tableCols=[]} = JSON.parse(subKey);
  const {tableItems} = getSelfState(getState());
  return exportExcelFunc(tableCols, tableItems);
};

// 查询导出
const exportSearchActionCreator = (subKey) => (dispatch, getState) =>{
  const {tableCols=[]} = JSON.parse(subKey);
  const {searchData} = getSelfState(getState());
  return commonExport(tableCols, '/archiver-service/customer/care/search', searchData);
};

//模板管理
const templateManagerActionCreator = async (dispatch, getState) => {
  const {tableCols, buttons} = getSelfState(getState());
  if(true === await showTemplateManagerDialog(tableCols, helper.getRouteKey())) {
    dispatch(action.assign({buttons: dealExportButtons(buttons, tableCols)}));
  }
};
const toolbarActions = {
  reset: resetActionCreator(),
  search: searchAction,
  add: addAction,
  edit: editAction,
  del: delAction,
  active: activeAction,
  exportSearch: exportSearchActionCreator,
  exportPage :exportPageActionCreator,
  templateManager: templateManagerActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    return {type: 'unknown'};
  }
};

const subClickActionCreator = (key, subKey) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key](subKey);
  } else {
    return {type: 'unknown',};
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

const filterSearchActionCreator = (key, value) =>async(dispatch)=> {
  if(key === 'customerId'){
    const option = helper.postOption({maxNumber: 10, filter: value});
    let data = await fetchJson(URL_CUSTOMER_OPTIONS, option);
    if (data.returnCode === 0) {
      dispatch(action.update({options:data.result},"filters",{key:"key",value:key}));
    }
  }
};

const actionCreators = {
  onSearch:filterSearchActionCreator,
  onClick: clickActionCreator,
  onSubClick: subClickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
