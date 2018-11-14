import { connect } from 'react-redux';
import OrderPage from './components/OrderPage/OrderPage';
import helper, {postOption, getObject,fetchJson, showError, showSuccessMsg} from '../../../common/common';
import {search2} from '../../../common/search';
import {buildEditDialogState} from '../../../common/state';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';


const STATE_PATH = ['basic', 'fromOddDefine'];
const action = new Action(STATE_PATH);
const URL_LIST = '/api/basic/fromOddDefine/list';
const URL_SEARCH = '/api/basic/fromOddDefine/search';
const URL_DELETE = '/api/basic/fromOddDefine/delete';
const URL_SET_DEFAULT = '/api/basic/fromOddDefine/setDefault';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'searchData');
};

// 双击进入编辑
const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const payload = await buildEditDialogState(editConfig, tableItems[rowIndex], true, rowIndex);
  dispatch(action.assign(payload, 'edit'));
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

// 清空搜索框
const resetAction = (dispatch, getState) => {
  dispatch(action.assign({searchData:{}}));
};

// 搜索
const searchAction = async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  const options = postOption(searchData);
  const {returnCode, result} = await fetchJson(URL_SEARCH, options);
  if (returnCode !== 0) {
    const msg = '搜索失败';
    showError(msg);
    return;
  }
  dispatch(action.assign({tableItems: result}));
};

// 弹出新增对话框
const addAction = (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const payload = buildEditDialogState(editConfig, {}, false);
  dispatch(action.assign(payload, 'edit'));
};

const editAction = (dispatch, getState) => {
  const {editConfig, tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const payload = buildEditDialogState(editConfig, tableItems[index], true);
    dispatch(action.assign(payload, 'edit'));
  }else {
    const msg = '请勾选一个';
    showError(msg)
  }
};


// 编辑完成后的动作
const afterEditActionCreator = (item, edit) => (dispatch) => {
  if (item) {
    if (!edit) {
      dispatch(action.add(item, 'tableItems', 0));
    } else {
      const index = {key: 'tableNumberName', value: item.tableNumberName};

      dispatch(action.update(item, 'tableItems', index));
    }
  }
  dispatch(action.assign({edit: undefined}));
};


const delAction = async (dispatch, getState) => {
  const { tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const items = tableItems[index];
    const {returnCode} = await fetchJson(`${URL_DELETE}/${items.id}`, 'delete');
    if (returnCode !== 0) {
      const msg = '删除失败';
      showError(msg);
      return;
    }
    const msg = '删除成功';
    showSuccessMsg(msg);
    dispatch(action.del('tableItems', index));
  }else {
    const msg = '请勾选一个';
    showError(msg);
    return;
  }
};

const setDefaultActionCreator = async (dispatch, getState) => {
  const {returnCode, result, returnMsg} = await fetchJson(URL_SET_DEFAULT);
  if(returnCode === 0){
    showSuccessMsg('设置成功！');
    searchAction(dispatch, getState);
  }else{
    showError(returnMsg);
  }
};

const batchEditActionCreator = async (dispatch, getState) => {
  const {tableItems, batchEdit} = getSelfState(getState());
  const checkItems = tableItems.filter(o=>o.checked);
  if(checkItems.length < 1) return showError('请勾选一条记录！');
  const payload = buildEditDialogState(batchEdit, {}, 'batchEdit');
  payload.checkItems = checkItems;
  dispatch(action.assign(payload, 'edit'));
};

const toolbarActions = {
  reset: resetAction,
  search: searchAction,
  add: addAction,
  edit: editAction,
  del: delAction,
  setDefault: setDefaultActionCreator,
  batchEdit: batchEditActionCreator,
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
  onDoubleClick: doubleClickActionCreator,
  //onLink: linkActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {afterEditActionCreator, searchAction};

