import { connect } from 'react-redux';
import JoinDialog from './JoinDialog';
import {showError, convert, getJsonResult} from '../../../../../common/common';
import {Action} from '../../../../../action-reducer/action';
import {getPathValue} from '../../../../../action-reducer/helper';
import {search, search2} from '../../../../../common/search';
import showPopup from '../../../../../standard-business/showPopup';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH, false);

const URL_JION_LIST = '/api/bill/receiveApply/joinList';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) => action.assign({[key]: value}, 'searchData');

const searchActionCreator = async (dispatch, getState) => {
  const {searchData, currentPage, pageSize} = getSelfState(getState());
  await search2(dispatch, action, URL_JION_LIST, currentPage, pageSize, convert(searchData), {currentPage: 1}, undefined, false);
};

const resetActionCreator = action.assign({searchData: {}});

const toolbarActions = {
  reset: resetActionCreator,
  search: searchActionCreator
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else if(key.includes('createBill')) {
    return createBillActionCreator(key);
  } else {
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => action.update({checked}, 'items', rowIndex);

const pageNumberActionCreator = (currentPage) => async (dispatch, getState) => {
  const {searchData, pageSize} = getSelfState(getState());
  await search2(dispatch, action, URL_JION_LIST, currentPage, pageSize, convert(searchData), {currentPage}, undefined, false);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  await search2(dispatch, action, URL_JION_LIST, currentPage, pageSize, convert(searchData), {pageSize, currentPage}, undefined, false);
};

const onOkActionCreator = () => (dispatch, getState) => {
  const {items} = getSelfState(getState());
  const okResult = items.filter(o => o.checked).map(o => {
    o.checked = false;
    return o;
  });
  if (okResult.length === 0) return showError('请勾选一条数据！');
  dispatch(action.assign({okResult, visible: false}));
};

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onClick: clickActionCreator,
  onOk: onOkActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(JoinDialog);

const buildState = (list, config) => {
  return {
    ...config,
    items: list.data,
    currentPage: 1,
    maxRecords: list.returnTotalItem,
    searchData: {},
    visible: true
  }
};

export default async (config) => {
  const list = getJsonResult(await search(URL_JION_LIST, 0, config.pageSize, {}, false));
  const payload = buildState(list, config);
  global.store.dispatch(action.create(payload));
  await showPopup(Container, {status: 'page'}, true);
  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.okResult;
}
