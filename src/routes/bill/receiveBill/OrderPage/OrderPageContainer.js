import { connect } from 'react-redux';
import OrderPage from '../../../../components/OrderPage';
import helper,{postOption, fetchJson, showError, showSuccessMsg, convert, getJsonResult, fuzzySearchEx, deepCopy} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import { exportExcelFunc, commonExport } from '../../../../common/exportExcelSetting';
import {search2} from '../../../../common/search';
import showAddDialog from './AddDialog/AddDialogContainer';
import {showOutputDialog} from '../../../../components/ModeOutput/ModeOutput';

const STATE_PATH = ['receiveBill'];
const action = new Action(STATE_PATH);
const URL_LIST = '/api/bill/receiveBill/list';
const URL_DELETE = '/api/bill/receiveBill/delete';
const URL_AUDIT_BATCH = '/api/bill/receiveBill/auditBatch';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const formSearchActionCreator = (key, filter, control) => async (dispatch,getState) => {
  const {filters} = getSelfState(getState());
  const result = getJsonResult(await fuzzySearchEx(filter, control));
  const options = result.data ? result.data : result;
  const index = filters.findIndex(item => item.key === key);
  dispatch(action.update({options}, 'filters', index));
};

const changeActionCreator = (key, value) => async (dispatch, getState) =>  {
   dispatch(action.assign({[key]: value}, 'searchData'));
};

const searchActionCreator = async (dispatch, getState) => {
  const {searchData, currentPage, pageSize} = getSelfState(getState());
  await search2(dispatch, action, URL_LIST, currentPage, pageSize, convert(searchData), {currentPage: 1}, undefined, false);
};

const resetActionCreator = action.assign({searchData: {}});

const addActionCreator = async (dispatch, getState) => {
  const {addConfig} = getSelfState(getState());
  const flag = await showAddDialog(addConfig);
  flag && (await searchActionCreator(dispatch, getState));
};

const setReadonlyTables = (tables=[]) => {
  return tables.map(o => {
    o.cols = o.cols.filter(o => o.key !== 'checked').map(o => {
      if (o.key !== 'index') {
        o.type = 'readonly';
      }
      return o;
    });
    return o;
  });
};

// 弹出编辑页面
const showEditPage = (dispatch, getState, item, readonly=false) => {
  const {tabs, editConfig} = getSelfState(getState());
  const key = item['billNumber'];
  if (helper.isTabExist(tabs, key)) return dispatch(action.assign({activeKey: key}));
  const config = deepCopy(editConfig);
  if (!readonly && (item.statusType !== 'status_draft')) {
    return showError('只有草稿状态下才能编辑！');
  }
  if (readonly) {
    config.tables = setReadonlyTables(config.tables);
    config.footerButtons = config.footerButtons.filter(o => o.readonlyPage);
  }
  dispatch(action.add({key, title: key}, 'tabs'));
  dispatch(action.assign({[key]: {readonly, config, itemData: item}, activeKey: key}));
};

const editActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if(index === -1) return showError('请勾选一条数据！');
  showEditPage(dispatch, getState, tableItems[index]);
};

// 双击编辑
const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  showEditPage(dispatch, getState, tableItems[index]);
};

// 查看
const linkActionCreator = (key, rowIndex, item) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  showEditPage(dispatch, getState, tableItems[rowIndex], true);
};

// 删除
const deleteActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkList = tableItems.filter(o=> o.checked);
  if(checkList.length === 0) return showError('请勾选一条数据！');
  if(checkList.find(o => o.statusType !== "status_draft")) return showError('请选择草稿状态的数据！');
  const ids = checkList.map(o => o.id);
  const {returnCode, returnMsg, result} = await fetchJson(URL_DELETE, postOption(ids));
  if(returnCode !==0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  await searchActionCreator(dispatch, getState);
};

// 审核
const auditActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkList = tableItems.filter(o=> o.checked);
  if(!checkList.length) return showError('请勾选一条数据！');
  if(checkList.find(o => o.statusType === "status_check_all_completed")) return showError('请取消已审核的记录！');
  const ids = checkList.map(o => o.id);
  const {returnCode, returnMsg, result} = await fetchJson(URL_AUDIT_BATCH, postOption(ids));
  if(returnCode !==0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  await searchActionCreator(dispatch, getState);
};

// 输出
const outputActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkList = tableItems.filter(o=> o.checked);
  if(!checkList.length) return showError('请勾选一条数据！');
  showOutputDialog(checkList, 'receivable_pay');
};

// 查询导出
const exportSearchActionCreator = (dispatch, getState) => {
  const {tableCols, searchData} = getSelfState(getState());
  commonExport(tableCols, '/tms-service/receivable_bill/batch', searchData);
};

// 页面导出
const exportPageActionCreator = async (dispatch, getState) => {
  const {tableCols, tableItems} = getSelfState(getState());
  exportExcelFunc(tableCols, tableItems);
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchActionCreator,
  add: addActionCreator,
  edit: editActionCreator,
  delete: deleteActionCreator,
  audit: auditActionCreator,
  output: outputActionCreator,
  exportSearch: exportSearchActionCreator,
  exportPage: exportPageActionCreator
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else if(key.includes('createBill')) {
    return createBillActionCreator(key);
  } else {
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const pageNumberActionCreator = (currentPage) => async (dispatch, getState) => {
  const {searchData, pageSize} = getSelfState(getState());
  await search2(dispatch, action, URL_LIST, currentPage, pageSize, convert(searchData), {currentPage}, undefined, false);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  await search2(dispatch, action, URL_LIST, currentPage, pageSize, convert(searchData), {pageSize, currentPage}, undefined, false);
};

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onSearch: formSearchActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onLink: linkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
