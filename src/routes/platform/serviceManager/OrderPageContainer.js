import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {getObject, swapItems, fetchJson, showError, getActions} from '../../../common/common';
import {toFormValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildOrderPageState} from '../../../common/orderAdapter';
import {buildEditState} from './EditDialogContainer';
import {search, search2} from '../../../common/search';

const STATE_PATH = ['platform',  'serviceManager'];
const URL_CONFIG = '/api/platform/serviceManager/config';
const URL_LIST = '/api/platform/serviceManager/list';

const action = new Action(STATE_PATH);

export const buildUserApiState = async () => {
  let res, data, config;
  res = await fetchJson(URL_CONFIG);
  if (!res) {
    showError('get config failed');
    return;
  }
  config = res.result;

  const buttons = config.index.buttons;
  const actions = getActions('serviceManager');
  config.index.buttons = buttons.filter(button => actions.findIndex(item => item === button.sign)!==-1);

  res = await search(URL_LIST, 0, config.index.pageSize, {});
  if(res.returnCode !=0){
    showError(res.returnMsg);
    return;
  }else data = res.result;

  return buildOrderPageState(data, config.index, {editConfig: config.edit});
};

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

const changeActionCreator = (key, value) => (dispatch) =>{
  dispatch(action.assign({[key]: value}, 'searchData'));
};

const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch, getState) =>{
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex));
};

const swapActionCreator = (key1, key2) => (dispatch) => {
  const {tableCols} = getSelfState(getState());
  dispatch(action.assign({tableCols: swapItems(tableCols, key1, key2)}));
};

const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak));
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

const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, toFormValue(searchData), newState);
};

const resetActionCreator = (dispatch) =>{
  dispatch( action.assign({searchData: {}}) );
};

const addAction = (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const payload = buildEditState(editConfig, {}, false);
  dispatch(action.assign(payload, 'edit'));
};

const editAction = (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index !== -1) {
    const payload = buildEditState(editConfig, tableItems[index], true, index);
    dispatch(action.assign(payload, 'edit'));
  }
};

const doubleClickActionCreator = (rowIndex) => (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const payload = buildEditState(editConfig, tableItems[rowIndex], true, rowIndex);
  dispatch(action.assign(payload, 'edit'));
};

const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  let checkId = [];
  tableItems.filter(item => {
    if (item.checked) {
      checkId.push(item.id);
    }
  });
  if(checkId.length !=0) {
    const confirm = {
      title: '请确认操作',
      ok: '确认',
      cancel: '取消',
      content: '是否确认删除'
    };
    dispatch(action.assign({...confirm, checkId}, 'confirm'));
  }else{
    showError('请先选择');
  }
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchClickActionCreator,
  add: addAction,
  edit: editAction,
  del: delAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const formSearchActionCreator = () => {

};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const actionCreators = {
  onClick: clickActionCreator,
  onSearch: formSearchActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onSwapCol: swapActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onDoubleClick: doubleClickActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable};
