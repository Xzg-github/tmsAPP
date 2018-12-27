import { connect } from 'react-redux';
import AddDialog from './AddDialog';
import {postOption, showError, showSuccessMsg, getJsonResult, convert, fuzzySearchEx, fetchJson}from '../../../../../common/common';
import {Action} from '../../../../../action-reducer/action';
import {getPathValue} from '../../../../../action-reducer/helper';
import showPopup from '../../../../../standard-business/showPopup';
import { search, search2 } from '../../../../../common/search';
import execWithLoading from '../../../../../standard-business/execWithLoading';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH, false);

const URL_LIST = '/api/bill/receiveBill/income_list';
const URL_CREATE_BILL = '/api/bill/receiveBill/createBill';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildAddDialogState = (list, config, other={}) => {
  return {
    ...config,
    ...other,
    visible: true,
    items: list.data,
    maxRecords: list.returnTotalItem,
    currentPage: 1,
    searchData: {}
  }
};

const changeActionCreator = (keyName, keyValue) => action.assign({[keyName]: keyValue}, 'searchData');

const formSearchActionCreator = (key, filter, control) => async (dispatch, getState) => {
  const {filters} = getSelfState(getState());
  const result = getJsonResult(await fuzzySearchEx(filter, control));
  const options = result.data ? result.data : result;
  const index = filters.findIndex(item => item.key === key);
  dispatch(action.update({options}, 'filters', index));
};

const searchActionCreator = async (dispatch, getState) => {
  const {searchData, currentPage, pageSize} = getSelfState(getState());
  await search2(dispatch, action, URL_LIST, currentPage, pageSize, convert(searchData), {currentPage: 1}, undefined, false);
};

const resetActionCreator = action.assign({searchData: {}});

// 生成账单
const createBillActionCreator = (buildType) => async (dispatch, getState) => {
  if (buildType !== 'close') {
    const {items} = getSelfState(getState());
    const checkList = items.filter(o=> o.checked);
    if(!checkList.length) return showError('请勾选一条数据！');
    execWithLoading(async () => {
      const transportOrderIdList = checkList.map(o => o.id);
      const params = {opType: buildType, transportOrderIdList};
      const { returnCode, result, returnMsg } = await fetchJson(URL_CREATE_BILL, postOption(params));
      if(returnCode !== 0) return showError(returnMsg);
      showSuccessMsg(returnMsg);
      dispatch(action.assign({okResult: true}));
    });
  }
  dispatch(action.assign({visible: false}));
};

const buttons = {
  search: searchActionCreator,
  reset: resetActionCreator
};

const clickActionCreator = (key) => {
  if (buttons.hasOwnProperty(key)) {
    return buttons[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'items', rowIndex);
};

const pageNumberActionCreator = (currentPage) => async (dispatch, getState) => {
  const {searchData, pageSize} = getSelfState(getState());
  await search2(dispatch, action, URL_LIST, currentPage, pageSize, convert(searchData), {currentPage}, undefined, false);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  await search2(dispatch, action, URL_LIST, currentPage, pageSize, convert(searchData), {pageSize, currentPage}, undefined, false);
};

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onCheck: checkActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  footerBtnClick: createBillActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(AddDialog);
export default async (params) => {
  execWithLoading (async () => {
    const list = getJsonResult(await search(URL_LIST, 0, params.pageSize, {}, false));
    const payload = buildAddDialogState(list, params);
    global.store.dispatch(action.create(payload));
  });
  await showPopup(Container, {}, true);
  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.okResult;
}
