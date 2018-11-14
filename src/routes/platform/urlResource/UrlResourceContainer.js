import { connect } from 'react-redux';
import UrlResource from './UrlResource';
import {EnhanceLoading} from '../../../components/Enhance/index';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import { fetchJson, showError, swapItems} from '../../../common/common';
import {search, search2} from '../../../common/search';
import {toFormValue} from '../../../common/check';
import {fetchDictionary, setDictionary} from '../../../common/dictionary';

const STATE_PATH = ['platform', 'urlResource'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/platform/urlResource/config';
const URL_LIST = '/api/platform/urlResource/list';

const getSelfState = (state) => {
  return getPathValue(state, STATE_PATH);
};

const buildState = (config, list) => {
  return {
    ...config,
    maxRecords: list.returnTotalItem,
    currentPage: 1,
    tableItems: list.data,
    status: 'page'
  };
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  let res, data, config;
  res = await fetchJson(URL_CONFIG);
  if(res.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    showError(res.returnMsg);
    return;
  }

  config = res.result;
  const {tableCols} = config;
  data = await fetchDictionary(config.dicNames);
  if(data.returnCode !== 0){
    dispatch(action.assign({status: 'retry'}));
    showError(data.returnMsg);
    return;
  }
  setDictionary(tableCols, data.result);

  data = await search(URL_LIST, 0, 10, {});
  if(data.returnCode !== 0){
    dispatch(action.assign({status: 'retry'}));
    showError(data.returnMsg);
    return;
  }

  dispatch(action.create(buildState(config, data.result)));
};

const checkedOne = (tableItems) => {
  const index = tableItems.reduce((result, item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return index.length !== 1 ? -1 : index[0];
};

const checkActionCreator = (rowIndex, key, value) => {
  return action.update({[key]: value}, 'tableItems', rowIndex);
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'searchData');
};

const searchActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, toFormValue(searchData), newState);
};

const resetActionCreator = async (dispatch) => {
  dispatch( action.assign({searchData: {}}) );
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

const swapActionCreator = (key1, key2) => (dispatch, getState) => {
  const {tableCols} = getSelfState(getState());
  dispatch(action.assign({tableCols: swapItems(tableCols, key1, key2)}));
};

const buttons = {
  search: searchActionCreator,
  reset: resetActionCreator
};

const clickActionCreator = (key) => {
  if (buttons[key]) {
    return buttons[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onClick: clickActionCreator,
  onCheck: checkActionCreator,
  onInit: initActionCreator,
  onChange: changeActionCreator,
  onSwapCol: swapActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(UrlResource));
export default Container;
