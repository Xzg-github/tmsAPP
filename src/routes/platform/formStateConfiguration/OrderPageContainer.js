import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import helper, {getObject, showError} from '../../../common/common';
import {search} from '../../../common/search';
import {buildEditPageState} from '../../platform/currencyFile/common/state';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {toFormValue} from "../../../common/check";
import {toTableItems} from '../../../common/orderAdapter';

const STATE_PATH = ['platform', 'formStateConfiguration'];
const action = new Action(STATE_PATH);
const URL_LIST = '/api/platform/formStateConfiguration/list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const search2 = async (dispatch, action, url, currentPage, pageSize, filter, newState={}, path=undefined) => {
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;
  const {returnCode, returnMsg, result} = await search(url, from, to, filter);
  if (returnCode === 0) {
    const payload = {
      ...newState,
      tableItems: toTableItems(result),
      maxRecords: result.returnTotalItem
    };
    let dictionaryCode ;
    result.data.forEach(item => {
      dictionaryCode = []
      item.dictionaryCodeList.forEach(item => {
        dictionaryCode.push(item.dictionaryCode)
      })
      item.dictionaryCode = dictionaryCode
    });
    dispatch(action.assign(payload, path));
  } else {
    showError(returnMsg);
  }
};


const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak));
};


const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'searchData');
};

// 双击进入编辑
const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const {dictionaryCodeList} = tableItems[rowIndex];
  editConfig.tableItems = dictionaryCodeList ? dictionaryCodeList : [] ;
  editConfig.controls[0].type = 'readonly';
  const payload = buildEditPageState(editConfig, tableItems[rowIndex], true);
  dispatch(action.assign(payload, 'edit'));
};


const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const searchActionCreator = (key, value) => async (dispatch, getState) => {

};

// 清空搜索框
const resetAction = (dispatch, getState) => {
  dispatch(action.assign({searchData:{}}));
};

// 搜索
const searchAction = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState);
};

// 弹出新增对话框
const addAction = async (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  editConfig.tableItems = [];
  editConfig.controls[0].type = 'text';
  const payload = buildEditPageState(editConfig, {}, false);
  dispatch(action.assign(payload, 'edit'));
};

const editAction = async (dispatch, getState) => {
  const {editConfig, tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const {dictionaryCodeList} = tableItems[index];
    editConfig.tableItems = dictionaryCodeList ? dictionaryCodeList : [] ;
    editConfig.controls[0].type = 'readonly';
    const payload = buildEditPageState(editConfig, tableItems[index], true);
    dispatch(action.assign(payload, 'edit'));
  }else {
    const msg = '请勾选一个';
    showError(msg);
  }
};

const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index =  helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    showError('请勾选一条记录进行删除');
    return;
  }
  const item = tableItems[index];
  let checkedType = item.formType;
  if(checkedType) {
    const confirm = {
      title: '请确认操作',
      ok: '确认',
      cancel: '取消',
      content: '是否确认删除'
    };
    dispatch(action.assign({...confirm, checkedType}, 'confirm'));
  }
};

const toolbarActions = {
  reset: resetAction,
  search: searchAction,
  add: addAction,
  edit: editAction,
  del:delAction
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
  onSearch: searchActionCreator,
  onCheck: checkActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onDoubleClick: doubleClickActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable};



