import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {getObject, fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildAddState} from '../datalib/StandardAddDialogContainer';
import {EnhanceEditDialog} from '../../../components/Enhance';
import StandardAddDialogContainer from './StandardAddDialogContainer';
import {search2} from '../../../common/search';
import {toFormValue} from '../../../common/check';

const STATE_PATH = ['config', 'datalib', 'standard'];
const action = new Action(STATE_PATH);
const URL_STAN_LIST = '/api/config/datalib/stan_list';
const URL_STAN_DEL = '/api/config/datalib/stan_del';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const checkedOne = (tableItems) => {
  const index = tableItems.reduce((result, item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return index.length !== 1 ? -1 : index[0];
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'searchData');
};

const resetActionCreator = (dispatch) => {
  dispatch(action.assign({searchData: {}}));
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_STAN_LIST, currentPage, pageSize, toFormValue(searchDataBak));
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_STAN_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_STAN_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
};

// 根据过滤条件请求列表
const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_STAN_LIST, 1, pageSize, toFormValue(searchData), newState);
};

const addActionCreator = async(dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const payload = buildAddState(editConfig, {}, false);
  dispatch(action.assign(payload, 'edit'));
};

const copyActionCreator = async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index !== -1) {
    const payload = buildAddState(editConfig, tableItems[index], false, index);
    dispatch(action.assign(payload, 'edit'));
  }
};

const editActionCreator = async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index !== -1) {
    const payload = buildAddState(editConfig, tableItems[index], true, index);
    dispatch(action.assign(payload, 'edit'));
  }
};

const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const payload = await buildAddState(editConfig, tableItems[rowIndex], true, rowIndex);
  dispatch(action.assign(payload, 'edit'));
};

const delActionCreator = async(dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index === -1) {
    showError("只能删除一条");
    return;
  }
  const item = tableItems[index];
  const json = await fetchJson(`${URL_STAN_DEL}?id=${item.id}`, 'delete');
  if (json.returnCode) {
    showError(json.returnMsg);
  } else {
    dispatch(action.del('tableItems', index));
  }
};

const buttons = {
  reset: resetActionCreator,
  search: searchClickActionCreator,
  add: addActionCreator,
  copy: copyActionCreator,
  edit: editActionCreator,
  del: delActionCreator
};

const clickActionCreator = (key) => (dispatch, getState) => {
  if (buttons[key]) {
    return buttons[key](dispatch, getState);
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {

};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS.concat('edit'));
};

const actionCreators = {
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onClick: clickActionCreator,
  onSearch: formSearchActionCreator,
  onDoubleClick: doubleClickActionCreator
};

const Component = EnhanceEditDialog(OrderPage, StandardAddDialogContainer);
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
export {updateTable};
