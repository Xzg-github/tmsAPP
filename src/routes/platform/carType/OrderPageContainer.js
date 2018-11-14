import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {fetchJson, getObject, swapItems, showError, showSuccessMsg} from '../../../common/common';
import {fetchDictionary2, setDictionary} from '../../../common/dictionary';
import {dealActions, hasSign} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildOrderPageState} from '../../../common/orderAdapter';
import {buildEditState} from './EditDialogContainer';
import {search, search2} from '../../../common/search';

const STATE_PATH = ['basic', 'carType'];
const URL_CONFIG = '/api/basic/car_type/config';
const URL_LIST = '/api/basic/car_type/list';
const URL_DEL = '/api/basic/car_type';
const URL_ACTIVE = '/api/basic/car_type/active';

const action = new Action(STATE_PATH);

export const buildCarTypeState = async () => {
  let data, config;
  data = await fetchJson(URL_CONFIG);
  if (data.returnCode !== 0) {
    showError('get config failed');
    return;
  }
  config = data.result;
  config.index.buttons = dealActions(config.index.buttons, 'car_type');
  const {tableCols, filters} = config.index;
  const {controls} = config.edit;
  data = await fetchDictionary2(tableCols);
  if(data.returnCode !=0){
    showError(data.returnMsg);
    return;
  }
  setDictionary(tableCols, data.result);
  setDictionary(filters, data.result);
  setDictionary(controls, data.result);

  data = await search(URL_LIST, 0, config.index.pageSize, {});
  if(data.returnCode !=0){
    showError(data.returnMsg);
    return;
  }
  return buildOrderPageState(data.result, config.index, {editConfig: config.edit});
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

const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState);
};

//编辑、新增、激活、失效后刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak);
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
  if (!hasSign('car_type', 'car_type_edit')) return;
  const {tableItems, editConfig} = getSelfState(getState());
  const payload = buildEditState(editConfig, tableItems[rowIndex], true, rowIndex);
  dispatch(action.assign(payload, 'edit'));
};

const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index === -1) {
    showError('请勾选一条记录进行删除');
    return;
  }
  const item = tableItems[index];
  const {returnCode, returnMsg, result} = await fetchJson(`${URL_DEL}/${item.guid}`, 'delete');
  if (returnCode === 0) {
    if (result.active) {
      dispatch(action.update(result, 'tableItems', index));
    } else {
      dispatch(action.del('tableItems', index));
    }
    showSuccessMsg('删除成功');
  }else {
    showError(returnMsg);
  }
};

const activeAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index === -1) {
    showError('请勾选一条记录进行激活');
    return;
  }
  const item = tableItems[index];
  const {returnCode, returnMsg, result} = await fetchJson(`${URL_ACTIVE}/${item.guid}`, 'put');
  if (returnCode === 0) {
    dispatch(action.update(result, 'tableItems', index));
    showSuccessMsg('激活成功');
  }else {
    showError(returnMsg);
  }
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchClickActionCreator,
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

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const actionCreators = {
  onClick: clickActionCreator,
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
