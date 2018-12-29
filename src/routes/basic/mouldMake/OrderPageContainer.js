import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {getObject, swapItems, fetchJson, showError,  getActions, showSuccessMsg} from '../../../common/common';
import {fetchDictionary2, setDictionary} from '../../../common/dictionary';
import {toFormValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildOrderPageState} from '../../../common/orderAdapter';
import {search, search2} from '../../../common/search';
import {buildEmailState} from './EmailDialogContainer';
import {buildSignatureState} from './SignatureDialogContainer';
import {showConfirmDialog} from '../../../common/showCofirmDialog';

const STATE_PATH = ['platform', 'mouldMake'];
const URL_CONFIG = '/api/platform/mouldMake/config';
const URL_LIST = '/api/platform/mouldMake/list';
const URL_DEL = '/api/platform/mouldMake/del';
const URL_ACTIVE = '/api/platform/mouldMake';

const action = new Action(STATE_PATH);

const helper1 = {
  checkedList: (tableItems = [], multiple = false) => {
    const checkedList = tableItems.reduce((list, item) => {
      if (item.checked) {
        //delete item.checked;
        list.push(item);
      }
      return list;
    }, []);
    if (multiple) return checkedList;
    return checkedList.length !== 1 ? [] : checkedList;
  },

  createKeys: (currencyTypeRateList, tdArr) => {
    return currencyTypeRateList.reduce((options, item) => {
      for (let arr of tdArr) {
        item[arr[1]] && (item[arr[0]] = item[arr[1]]);
      }
      options.push(item);
      return options;
    }, []);
  }
};

export const buildState = async () => {
  let res, data, config;
  res = await fetchJson(URL_CONFIG);
  if (!res) {
    showError('get config failed');
    return;
  }
  config = res.result;

  const buttons = config.index.buttons;
  const actions = getActions('mouldMake');
  config.index.buttons = buttons.filter(button => actions.findIndex(item => item === button.sign)!==-1);

  const {tableCols, filters} = config.index;
  const {emailControls} = config.edit.emailConfig;
  const {signatureControls} = config.edit.signatureConfig;
  data = await fetchDictionary2(tableCols);
  if(data.returnCode !==0){
    showError(data.returnMsg);
    return;
  }
  setDictionary(tableCols, data.result);
  setDictionary(filters, data.result);
  setDictionary(emailControls, data.result);
  setDictionary(signatureControls, data.result);

/*  buttons.map(item => {
    if (item.key === 'add') {
      item.menu = helper1.createKeys(data.result.model_type, [['key', 'value'], ['title', 'title']]);
    }
  });*/

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

const addAction = (dispatch, getState, key) => {
  const {editConfig} = getSelfState(getState());
  if(key === 'model_type_email'){
    const emailDialog = buildEmailState(editConfig.emailConfig, {}, key, false);
    dispatch(action.assign({emailDialog}));
  }else if(key === 'model_type_signature'){
    const signatureDialog = buildSignatureState(editConfig.signatureConfig, {}, key, false);
    dispatch(action.assign({signatureDialog}));
  }
};

const copyActionCreator = (dispatch, getState, key, checkItem) => {
  const {editConfig} = getSelfState(getState());
  if(checkItem[0].modelType === 'model_type_email'){
    const emailDialog = buildEmailState(editConfig.emailConfig, checkItem[0], key, false);
    dispatch(action.assign({emailDialog}));
  }else if(checkItem[0].modelType === 'model_type_signature'){
    const signatureDialog = buildSignatureState(editConfig.signatureConfig, checkItem[0], key, false);
    dispatch(action.assign({signatureDialog}));
  }
};

const editAction = (dispatch, getState, key, checkItem) => {
  const {editConfig} = getSelfState(getState());
  if(checkItem[0].modelType === 'model_type_email'){
    const emailDialog = buildEmailState(editConfig.emailConfig, checkItem[0], key, true);
    dispatch(action.assign({emailDialog}));
  }else if(checkItem[0].modelType === 'model_type_signature'){
    const signatureDialog = buildSignatureState(editConfig.signatureConfig, checkItem[0], key, true);
    dispatch(action.assign({signatureDialog}));
  }
};

const doubleClickActionCreator = (rowIndex, key) => (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  if(tableItems[rowIndex].modelType === 'model_type_email'){
    const emailDialog = buildEmailState(editConfig.emailConfig, tableItems[rowIndex], key, true);
    dispatch(action.assign({emailDialog}));
  }else if(tableItems[rowIndex].modelType === 'model_type_signature'){
    const signatureDialog = buildSignatureState(editConfig.signatureConfig, tableItems[rowIndex], key, true);
    dispatch(action.assign({signatureDialog}));
  }
};

const delAction = async (dispatch, getState, key, checkItem) => {
  const {tableItems} = getSelfState(getState());
  const index = checkedOne(tableItems);
  const item = tableItems[index];
  if(item.active === 'active_invalid'){
    const delFunc = async () => {
      const {returnCode, returnMsg} = await fetchJson(`${URL_DEL}/${item.id}`, 'delete');
      if(returnCode === 0){
        showSuccessMsg('删除成功！')
        updateTable(dispatch, getState);
      }else{
        return showError(returnMsg);
      }
    }
    return showConfirmDialog(`是否确定删除？`,delFunc)
  }else{
    showError('只能删除失效的！');
  }
};

// 激活
const activelAction = async (dispatch, getState, key, checkItem) => {
  const {tableItems} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index !== -1) {
    const item = tableItems[index];
    const isActive = 'active_activated';
    const {returnCode, returnMsg, result} = await fetchJson(`${URL_ACTIVE}/${item.id}/${isActive}`, 'put');
    if (returnCode === 0) {
      dispatch(action.update(result, 'tableItems', index));
    } else {
      showError(returnMsg);
    }
  }
};

// 失效
const inactiveAction = async (dispatch, getState, key, checkItem) => {
  const {tableItems} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index !== -1) {
    const item = tableItems[index];
    const isActive = 'active_invalid';
    const {returnCode, returnMsg, result} = await fetchJson(`${URL_ACTIVE}/${item.id}/${isActive}`, 'put');
    if (returnCode === 0) {
      dispatch(action.update(result, 'tableItems', index));
    } else {
      showError(returnMsg);
    }
  }
};

const clickEvents = {
  reset: resetActionCreator,
  search: searchClickActionCreator,
  add: addAction,
  copy: copyActionCreator,
  edit: editAction,
  del: delAction,
  active: activelAction,
  inactive: inactiveAction,
};

const actions = ['copy', 'edit', 'del', 'active', 'inactive'];
const clickActionCreator = (key) => (dispatch, getState) => {
  let checkItem = [];
  if (actions.indexOf(key) !== -1) {
    const { tableItems } = getSelfState(getState());
    checkItem = helper1.checkedList(tableItems);
    if (checkItem.length === 0) {
      showError('请勾选一个选项进行操作');
      return;
    }
  }
  if (clickEvents[key]) {
    clickEvents[key](dispatch, getState, key, checkItem);
  } else {
    clickEvents.add(dispatch, getState, key);
  }
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
  const {filters} = getSelfState(getState());
  let res;
  switch (key) {
    case 'serviceId': {
      res = await search(URL_SERVICE_LIST, 0, 10, {['serviceName'] : title});
      break;
    }
    default:
      return;
  }
  if (res.returnCode!==0) return;
  let items = res.result.data;
  let options = [];
  items.map((item) => {
    options.push({
      value: item.id,
      title: item.serviceName
    })
  });
  const index = filters.findIndex(item => item.key == key);
  dispatch(action.update({options}, 'filters', index));
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
