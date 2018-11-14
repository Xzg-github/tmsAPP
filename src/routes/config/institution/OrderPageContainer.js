import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import helper, {getObject, swapItems, fetchJson, showError} from '../../../common/common';
import {search2} from '../../../common/search';
import {buildEditState} from './EditDialogContainer';

const STATE_PATH = ['basic', 'institution'];
const URL_LIST = '/api/basic/institution/list';
const URL_DEL = '/api/basic/institution';
const URL_ACTIVE = '/api/basic/institution/active';
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

// 清空搜索框
const resetActionCreator = () => {
  return action.assign({searchData: {}});
};

// 弹出新增对话框
const addAction = (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const payload = buildEditState(editConfig, {}, false);
  dispatch(action.assign(payload, 'edit'));
};

// 弹出编辑对话框
const editAction = (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const payload = buildEditState(editConfig, tableItems[index], true);
    dispatch(action.assign(payload, 'edit'));
  }
};

const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const payload = buildEditState(editConfig, tableItems[index], true);
  dispatch(action.assign(payload, 'edit'));
};

// 编辑完成后的动作
const afterEditActionCreator = (institution, edit) => (dispatch) => {
  if (institution) {
    if (!edit) {
      dispatch(action.add(institution, 'tableItems', 0));
    } else {
      const index = {key: 'guid', value: institution.guid};
      dispatch(action.update(institution, 'tableItems', index));
    }
  }
  dispatch(action.assign({edit: undefined}));
};

// 删除(失效)机构
const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    return;
  }

  const item = tableItems[index];
  const {returnCode, returnMsg, result} = await fetchJson(`${URL_DEL}/${item.guid}`, 'delete');
  if (returnCode !== 0) {
    showError(returnMsg);
    return;
  }

  if (result.active) {
    dispatch(action.update(result, 'tableItems', index));
  } else {
    dispatch(action.del('tableItems', index));
  }
};

// 激活机构
const activeAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    return;
  }

  const item = tableItems[index];
  const {returnCode, returnMsg, result} = await fetchJson(`${URL_ACTIVE}/${item.guid}`, 'put');
  if (returnCode !== 0) {
    showError(returnMsg);
    return;
  }

  dispatch(action.update(result, 'tableItems', index));
};

const toolbarActions = {
  reset: resetActionCreator(),
  search: searchAction,
  add: addAction,
  edit: editAction,
  del: delAction,
  active: activeAction
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

const swapActionCreator = (key1, key2) => (dispatch, getState) => {
  const {tableCols} = getSelfState(getState());
  dispatch(action.assign({tableCols: swapItems(tableCols, key1, key2)}));
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
  onSwapCol: swapActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {afterEditActionCreator};
