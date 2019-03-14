/**
 * 应收月账单首页
 */
import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import helper, {fetchJson, getObject, postOption, showError, swapItems} from '../../../common/common';
import {toFormValue,hasSign} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search2} from '../../../common/search';
import showModeDialog from '../../../components/ModeOutput/showModeOutputDialog';

const TAB_KEY = 'index';
const STATE_PATH =  ['receiveMonthlyBill'];

const URL_LIST = '/api/bill/receive_monthly_bill/list';//查询列表
const URL_ONE = '/api/bill/receive_monthly_bill/one';//根据ID获取单条数据
const URL_DELETE = '/api/bill/receive_monthly_bill/delete';
const URL_SEND = '/api/bill/receive_monthly_bill/send';
const URL_CHECK = '/api/bill/receive_monthly_bill/check';
const URL_REVOKE = '/api/bill/receive_monthly_bill/cancel';


const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};

// 页面的初始状态
const buildPageState = (tabs, tabKey, title, look=false,value={}) => {
  return {
    activeKey: tabKey,
    tabs: tabs.concat({key: tabKey, title: title}),
    [tabKey]: {look,tabKey,value,updateTable},
  };
};


//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={},tabKey} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak),{},tabKey);
};

//新增
const addActionCreator = (dispatch,getState) => {
  const {tabs} = getPathValue(getState(), STATE_PATH);
  const tabKey = 'add';
  const title = '新增';
  if(helper.isTabExist(tabs,tabKey)){
    dispatch(action.assign({activeKey:tabKey}));
    return
  }
  dispatch(action.assign(buildPageState (tabs, tabKey,title,false,{})));
};

//编辑
const editActionCreator = async(dispatch,getState) => {
  const state = getSelfState(getState());
  const {tabs} = getPathValue(getState(), STATE_PATH);
  const items = state.tableItems.filter(item => item.checked);
  if (items.length !== 1) {
    helper.showError('请勾选一条记录');
  }else {
    const tabKey = 'edit_'+items[0].billNumber;
    const id = items[0].id;
    if(helper.isTabExist(tabs,tabKey)){
      dispatch(action.assign({activeKey:tabKey}));
      return
    }
    const json = await helper.fetchJson(`${URL_ONE}/${id}`);
    if(json.returnCode !==0 ){
      helper.showError(json.returnMsg);
      return
    }
    dispatch(action.assign(buildPageState (tabs, tabKey,items[0].billNumber,false,json.result)));
  }
};

//输出
const outputActionCreator = (dispatch,getState) => {
  showModeDialog('receivable_month_bill',['a'])
};

const resetActionCreator = (dispatch,getState) =>{
  const {tabKey} = getSelfState(getState());
  dispatch( action.assign({searchData: {}},tabKey) );
};

const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData,tabKey} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, toFormValue(searchData), newState,tabKey);
};

const deleteActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const idList = tableItems.reduce((result, item) => {
    item.checked && item.statusType === 'status_draft' && result.push(item.id);
    return result;
  }, []);
  if (idList.length === tableItems.filter(item => item.checked).length) {
    const {returnCode, returnMsg} = await fetchJson(URL_DELETE, postOption(idList));
    return returnCode === 0 ? updateTable(dispatch, getState) : showError(returnMsg);
  }else {
    return showError('请选择草稿状态的记录!');
  }
};

const sendActionCreator = async (dispatch, getState) =>{
  const {tableItems} = getSelfState(getState());
  const idList = tableItems.reduce((result, item) => {
    item.checked && (item.statusType === 'status_draft' || item.statusType === 'status_fall_back_completed') && result.push(item.id);
    return result;
  }, []);
  if (idList.length === tableItems.filter(item => item.checked).length) {
    const {returnCode, returnMsg} = await fetchJson(URL_SEND, postOption(idList));
    return returnCode === 0 ? updateTable(dispatch, getState) : showError(returnMsg);
  }else {
    return showError('请选择草稿或已回退状态的记录!');
  }
};

const reconciliationActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const idList = tableItems.reduce((result, item) => {
    item.checked && item.statusType !== 'status_completed'  && result.push(item.id);
    return result;
  }, []);
  if (idList.length === tableItems.filter(item => item.checked).length) {
    const {returnCode, returnMsg} = await fetchJson(URL_CHECK, postOption(idList));
    return returnCode === 0 ? updateTable(dispatch, getState) : showError(returnMsg);
  }else {
    return showError('包含已完成状态的记录!');
  }
};

const cancelActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const idList = tableItems.reduce((result, item) => {
    item.checked && item.statusType === 'status_completed'  && result.push(item.id);
    return result;
  }, []);
  if (idList.length === tableItems.filter(item => item.checked).length) {
    const {returnCode, returnMsg} = await fetchJson(URL_REVOKE, postOption(idList));
    return returnCode === 0 ? updateTable(dispatch, getState) : showError(returnMsg);
  }else {
    return showError('请选择已完成状态的记录!');
  }
};


const toolbarActions = {
  search: searchClickActionCreator,
  reset: resetActionCreator,
  add:addActionCreator,
  edit:editActionCreator,
  output:outputActionCreator,
  del: deleteActionCreator,
  send: sendActionCreator,
  check: reconciliationActionCreator,
  revoke: cancelActionCreator
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const onLinkActionCreator = (key, rowIndex, item)  => async (dispatch,getState) => {
  const {tabs} = getPathValue(getState(), STATE_PATH);
  const tabKey = 'edit_'+item.billNumber;
  const id = item.id;
  if(helper.isTabExist(tabs,tabKey)){
    dispatch(action.assign({activeKey:tabKey}));
    return
  }
  const json = await helper.fetchJson(`${URL_ONE}/${id}`);
  if(json.returnCode !==0 ){
    helper.showError(json.returnMsg);
    return
  }
  dispatch(action.assign(buildPageState (tabs, tabKey,item.billNumber,true,json.result)));
};

const changeActionCreator = (key, value) => (dispatch,getState) =>{
  const {tabKey} = getSelfState(getState());
  dispatch(action.assign({[key]: value}, [tabKey,'searchData']));
};

const formSearchActionCreator = (key, title,keyControl) => async (dispatch, getState) => {
  const {filters,tabKey} = getSelfState(getState());
  const json = await helper.fuzzySearchEx(title,keyControl);
  if (!json.returnCode) {
    const index = filters.findIndex(item => item.key == key);
    dispatch(action.update({options:json.result}, [tabKey,'filters'], index));
  }else {
    helper.showError(json.returnMsg)
  }

};
const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch, getState) =>{
  const {tabKey} = getSelfState(getState());
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, [tabKey,'tableItems'], rowIndex));
};

const swapActionCreator = (key1, key2) => (dispatch,getState) => {
  const {tableCols} = getSelfState(getState());
  dispatch(action.assign({tableCols: swapItems(tableCols, key1, key2)}));
};


const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={},tabKey} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState,tabKey);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={},tabKey} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState,tabKey);
};

const doubleClickActionCreator = (rowIndex) => async(dispatch, getState) => {
  const state = getSelfState(getState());
  const {tabs} = getPathValue(getState(), STATE_PATH);
  if (!hasSign('receive_monthly_bill', 'edit')) return;
  const items = state.tableItems[rowIndex];
  const tabKey = 'edit_'+items.billNumber;
  const id = items.id;
  if(helper.isTabExist(tabs,tabKey)){
    dispatch(action.assign({activeKey:tabKey}));
    return
  }
  const json = await helper.fetchJson(`${URL_ONE}/${id}`);
  if(json.returnCode !==0 ){
    helper.showError(json.returnMsg);
    return
  }
  dispatch(action.assign(buildPageState (tabs, tabKey,items.billNumber,false,json.result)));
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
  onSearch: formSearchActionCreator,
  onLink: onLinkActionCreator,
  onDoubleClick: doubleClickActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable,buildPageState};
