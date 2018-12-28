import { connect } from 'react-redux';
import OrderPage from '../../../../components/OrderPage';
import helper,{postOption, fetchJson, showError, showSuccessMsg, convert, getJsonResult, fuzzySearchEx, deepCopy} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {search2} from '../../../../common/search';
import showAddDialog from './AddDialog/AddDialogContainer';
import {showOutputDialog} from '../../../../components/ModeOutput/ModeOutput';

const STATE_PATH = ['receiveApply'];
const action = new Action(STATE_PATH);
const URL_LIST = '/api/bill/receiveApply/list';
const URL_DELETE = '/api/bill/receiveApply/delete';
const URL_COMMIT = '/api/bill/receiveApply/commit';
const URL_REVOKE = '/api/bill/receiveApply/revoke';
const URL_ACCEPT = '/api/bill/receiveApply/accept';
const URL_INVOICE = '/api/bill/receiveApply/invoice';

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
  const {addDialogConfig} = getSelfState(getState());
  showAddDialog(addDialogConfig);
};

const setReadonly = (arr=[]) => {
  return arr.map(o => {
    o.btns = [];
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
  const key = item['receivableInvoiceSysnumber'];
  if (helper.isTabExist(tabs, key)) return dispatch(action.assign({activeKey: key}));
  const config = deepCopy(editConfig);
  if (readonly) {
    config.controls = setReadonly(config.controls);
  }
  dispatch(action.add({key, title: key}, 'tabs'));
  dispatch(action.assign({[key]: {readonly, config, itemData: item}, activeKey: key}));
};

const editActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if(index === -1) return showError('请勾选一条数据！');
  const item = tableItems[index];
  if (item.statusType !== 'status_draft' && item.statusType !== 'status_handling_completed') {
    return showError('只有草稿和已受理状态才能编辑！');
  }
  showEditPage(dispatch, getState, item);
};

// 双击编辑
const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const item = tableItems[index];
  if (item.statusType !== 'status_draft' && item.statusType !== 'status_handling_completed') {
    return showError('只有草稿和已受理状态才能编辑！');
  }
  showEditPage(dispatch, getState, item);
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
};

// 提交
const commitActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkList = tableItems.filter(o=> o.checked);
  if(checkList.length === 0) return showError('请勾选一条数据！');
  if(checkList.find(o => o.statusType !== "status_draft")) return showError('请选择草稿状态的数据！');
  const ids = checkList.map(o => o.id);
  const {returnCode, returnMsg, result} = await fetchJson(URL_COMMIT, postOption(ids));
  if(returnCode !==0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
};

// 撤销
const revokeActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkList = tableItems.filter(o=> o.checked);
  if(checkList.length === 0) return showError('请勾选一条数据！');
  if(checkList.find(o => o.statusType !== "status_handling_awaiting")) return showError('请选择待受理状态的数据！');
  const ids = checkList.map(o => o.id);
  const {returnCode, returnMsg, result} = await fetchJson(URL_REVOKE, postOption(ids));
  if(returnCode !==0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
};

// 受理
const acceptActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkList = tableItems.filter(o=> o.checked);
  if(checkList.length === 0) return showError('请勾选一条数据！');
  if(checkList.find(o => o.statusType !== "status_handling_awaiting")) return showError('请选择待受理状态的数据！');
  const ids = checkList.map(o => o.id);
  const {returnCode, returnMsg, result} = await fetchJson(URL_ACCEPT, postOption(ids));
  if(returnCode !==0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
};


// 开票
const invoiceActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkList = tableItems.filter(o=> o.checked);
  if(checkList.length === 0) return showError('请勾选一条数据！');
  if(checkList.find(o => o.statusType !== "status_handling_completed")) return showError('请选择已受理状态的数据！');
  const ids = checkList.map(o => o.id);
  const {returnCode, returnMsg, result} = await fetchJson(URL_INVOICE, postOption(ids));
  if(returnCode !==0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
};

// 输出
const outputActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkList = tableItems.filter(o=> o.checked);
  if(!checkList.length) return showError('请勾选一条数据！');
  showOutputDialog(checkList, 'receivable_pay');
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchActionCreator,
  add: addActionCreator,
  edit: editActionCreator,
  delete: deleteActionCreator,
  commit: commitActionCreator,
  revoke: revokeActionCreator,
  accept: acceptActionCreator,
  invoice: invoiceActionCreator,
  output: outputActionCreator
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
