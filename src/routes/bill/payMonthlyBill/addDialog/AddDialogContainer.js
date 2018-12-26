/**
 * 加入结算单位页面
 * 前端分页显示
 */
import { connect } from 'react-redux';
import AddDialog from './AddDialog';
import helper,{getObject, swapItems} from '../../../../common/common';
import {toFormValue,hasSign} from '../../../../common/check';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showPopup from '../../../../standard-business/showPopup';
import {buildOrderPageState} from '../../../../common/state';

const STATE_PATH =  ['temp'];
const URL_RECEIVE = '/api/bill/pay_monthly_bill/settlement';//获取结算单位
const URL_JOIN = '/api/bill/pay_monthly_bill/addSettlement';//加入结算单位

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};


const resetActionCreator = (dispatch,getState) =>{
  const {search={}} = getSelfState(getState());
  dispatch( action.assign({searchData:search }) );
};

const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const {result,returnCode,returnMsg} = await helper.fetchJson(URL_RECEIVE,helper.postOption(helper.convert(searchData)));
  if(returnCode !== 0){
    helper.showError(returnMsg);
    return
  }
  const newState = {
    allItems: result,
    currentPage: 1,
    tableItems: result.length > pageSize ? result.slice(0, pageSize) : result,
    maxRecords: result.length
  };
  dispatch(action.assign(newState));
};




const toolbarActions = {
  search: searchClickActionCreator,
  reset: resetActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const onOkActionCreator = () => async(dispatch,getState) =>{
  const {tableItems,payableMonthBillId,searchData} = getSelfState(getState());
  const items = tableItems.filter(item => item.checked);
  const body = {
    currency:searchData.currency,
    supplierId:searchData.supplierId,
    payableMonthBillId,
    transportOrderIdList:items.map(item => item.transportOrderId)
  };
  const {result,returnCode,returnMsg} = await helper.fetchJson(URL_JOIN,helper.postOption(helper.convert(body)));
  if(returnCode !==0){
    helper.showError(returnMsg);
    return
  }
  dispatch(action.assign({visible: false, result}));
};


const changeActionCreator = (key, value) => (dispatch,getState) =>{
  const {tabKey} = getSelfState(getState());
  dispatch(action.assign({[key]: value}, ['searchData']));
};

const formSearchActionCreator = (key, title,keyControl) => async (dispatch, getState) => {
  const {filters,tabKey} = getSelfState(getState());
  const json = await helper.fuzzySearchEx(title,keyControl);
  if (!json.returnCode) {
    const index = filters.findIndex(item => item.key == key);
    dispatch(action.update({options:json.result}, [tabKey,'filters']));
  }else {
    helper.showError(json.returnMsg)
  }

};

const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch) =>{
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex));
};

const swapActionCreator = (key1, key2) => (dispatch,getState) => {
  const {tableCols} = getSelfState(getState());
  dispatch(action.assign({tableCols: swapItems(tableCols, key1, key2)}));
};


const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {allItems=[], pageSize, maxRecords} = getSelfState(getState());
  const p = Number(currentPage);
  const size = Number(pageSize);
  const tableItems = Number(maxRecords) > p*size ? allItems.slice((p-1)*size, p*size) : allItems.slice((p-1)*size);
  dispatch(action.assign({currentPage, tableItems}));
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {allItems=[], maxRecords} = getSelfState(getState());
  const p = Number(currentPage);
  const size = Number(pageSize);
  const tableItems = Number(maxRecords) > p*size ? allItems.slice((p-1)*size, p*size) : allItems.slice((p-1)*size);
  dispatch(action.assign({currentPage, tableItems, pageSize}));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};


const cancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false}));
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onSwapCol: swapActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onSearch: formSearchActionCreator,
  onCancel:cancelActionCreator,
  onOk:onOkActionCreator
};

export default async(search = {},config,payableMonthBillId) => {
  const Container = connect(mapStateToProps, actionCreators)(AddDialog);
  const list = {data:[]};
  let othrer = {search,payableMonthBillId};
  const payload = buildOrderPageState(list, config,othrer);
  payload.searchData = search;
  global.store.dispatch(action.create(payload));
  await showPopup(Container,{}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.result;
}
