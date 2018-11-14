import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {fetchJson, showError, initTableCols} from '../../../common/common';
import {fetchDictionary, setDictionary} from '../../../common/dictionary';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search,search2} from '../../../common/search';
import {buildOrderPageState} from "../../../common/orderAdapter";
import {buildEditState} from "./EditDialogContainer";

const STATE_PATH = ['message', 'sendMessageByEmail'];
const URL_CONFIG = '/api/message/sendMessageByEmail/config';
const URL_LIST = '/api/message/sendMessageByEmail/list';
const URL_DETAIL = '/api/message/sendMessageByEmail/detail';

const action = new Action(STATE_PATH);

export const buildSendMessageByShortMesState = async () =>{
  let res,data,config;
  data = await fetchJson(URL_CONFIG);
  if(data.returnCode !== 0) {
    showError('Get Config Failed');
    return;
  }
  config = data.result;
  config.index.tableCols = initTableCols('sendMessageByEmail', config.index.tableCols);
  const {tableCols, filters} = config.index;
  const {controls} = config.edit;
  data = await fetchDictionary(config.dicNames);
  if(data.returnCode !=0){
    showError(data.returnMsg);
    return;
  }
  setDictionary(tableCols, data.result);
  setDictionary(filters, data.result);
  setDictionary(controls, data.result);
  res = await search(URL_LIST, 0, config.index.pageSize, {});
  if(res.returnCode !=0){
    showError(res.returnMsg);
    return;
  }
  data = res.result;
  return buildOrderPageState(data, config.index, {editConfig: config.edit});
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'searchData');
};

//搜索
const searchActionCreator = async (dispatch, getState) =>{
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  console.log(URL_LIST);
  return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState);
};

// 清空搜索框
const resetActionCreator = async(dispatch) => {
  return dispatch(action.assign({searchData: {}}));
};

//双击进入编辑界面
const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  let id = tableItems[index].id;
  let res = await fetchJson(`${URL_DETAIL}/${id}`);
  if(res.returnCode !=0){
    showError(res.returnMsg);
    return;
  }
  const payload = buildEditState(editConfig, res.result, true);
  dispatch(action.assign(payload, 'edit'));
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchActionCreator
};

const clickActionCreator = (key) =>async(dispatch, getState) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key](dispatch, getState);
  } else {
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
  return getSelfState(state);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
