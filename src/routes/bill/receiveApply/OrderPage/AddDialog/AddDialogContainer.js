import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../../../components/Enhance';
import AddDialog from './AddDialog';
import {postOption, showError, showSuccessMsg, getJsonResult, convert, fuzzySearchEx, fetchJson}from '../../../../../common/common';
import {Action} from '../../../../../action-reducer/action';
import {getPathValue} from '../../../../../action-reducer/helper';
import showPopup from '../../../../../standard-business/showPopup';
import execWithLoading from '../../../../../standard-business/execWithLoading';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH, false);

const URL_LIST = '/api/bill/receiveApply/income_list';
const URL_ADD_APPLY = '/api/bill/receiveApply/addApply';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildAddDialogState = (list, config, other={}) => {
  return {
    ...config,
    ...other,
    visible: true,
    items: list,
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
  const {searchData={}} = getSelfState(getState());
  if (!searchData['customerId'] || !searchData['tax']) return showError('结算单位与税率必填！');
  const list = getJsonResult(await fetchJson(URL_LIST, postOption({maxNumber: 10, ...convert(searchData)})));
  dispatch(action.assign({items: list}));
};

const resetActionCreator = action.assign({searchData: {}});

// 申请
const onOkActionCreator = () => async (dispatch, getState) => {
  const {items} = getSelfState(getState());
  const checkList = items.filter(o=> o.checked);
  if(!checkList.length) return showError('请勾选一条数据！');
  execWithLoading(async () => {
    const list = checkList.map(o => convert(o));
    if (list.length === 0) return;
    const params = {
      currency: list[0]['currency'],
      customerId: list[0]['customerId'],
      tax: list[0]['tax'] || 0,
      ids: list.map(o => o.id)
    };
    const { returnCode, result, returnMsg } = await fetchJson(URL_ADD_APPLY, postOption(params));
    if(returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    dispatch(action.assign({okResult: true}));
  });
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

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onCheck: checkActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onOk: onOkActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(AddDialog));
export default async (params) => {
  // 新增进去默认不发请求
  // const list = getJsonResult(await fetchJson(URL_LIST, postOption({maxNumber: 10})));
  const payload = buildAddDialogState([], params);
  global.store.dispatch(action.create(payload));
  await showPopup(Container, {status: 'page'}, true);
  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.okResult;
}
