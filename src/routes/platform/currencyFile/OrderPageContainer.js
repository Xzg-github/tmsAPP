import { connect } from 'react-redux';
import OrderPage from '../../basic/fromOddDefine/components/OrderPage/OrderPage';
import {deepCopy, conversion, checkedId} from './common/common';
import helper, {postOption, getObject,fetchJson, showError} from '../../../common/common';
import {buildEditDialogState} from '../../../common/state';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';


const STATE_PATH = ['basic', 'currencyFile'];
const action = new Action(STATE_PATH);
const URL_LIST = '/api/basic/currencyFile/list';
const URL_ACTIVE = '/api/basic/currencyFile/active';
const URL_DELETE = '/api/basic/currencyFile/delete';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'searchData');
};

// 双击进入编辑
const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const newEditConfig = deepCopy(editConfig);
  const {controls} = newEditConfig;
  conversion(controls);
  const payload = await buildEditDialogState(newEditConfig, tableItems[rowIndex], true, rowIndex);
  dispatch(action.assign(payload, 'edit'));
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

// 清空搜索框
const resetAction = (dispatch, getState) => {
  dispatch(action.assign({searchData:{}}));
};

// 搜索
const searchAction = async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  const {result, returnCode, returnMsg} = await fetchJson(URL_LIST, postOption(searchData));
  if (returnCode !== 0) {
    showError(returnMsg);
    return;
  }
  dispatch(action.assign({tableItems: result}));
};

// 弹出新增对话框
const addAction = (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const payload = buildEditDialogState(editConfig, {}, false);
  dispatch(action.assign(payload, 'edit'));
};

const editAction = (dispatch, getState) => {
  const {editConfig, tableItems} = getSelfState(getState());
  const newEditConfig = deepCopy(editConfig);
  const {controls} = newEditConfig;
  conversion(controls);
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const payload = buildEditDialogState(newEditConfig, tableItems[index], true);
    dispatch(action.assign(payload, 'edit'));
  }else {
    const msg = '请勾选一个';
    showError(msg);
  }
};


// 编辑完成后的动作
const afterEditActionCreator = (item, edit) => (dispatch) => {
  if (item) {
    if (!edit) {
      dispatch(action.add(item, 'tableItems', 0));
    } else {
      const index = {key: 'currencyTypeCode', value: item.currencyTypeCode};
      dispatch(action.update(item, 'tableItems', index));
    }
  }
  dispatch(action.assign({edit: undefined}));
};


// 激活
const activeAction = async(dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const items = tableItems[index];
    const {returnCode, result, returnMsg} = await fetchJson(`${URL_ACTIVE}/${items.currencyTypeCode}`, 'put');
    if (returnCode !== 0) {
      showError(returnMsg);
      return;
    }
    dispatch(action.update(result, 'tableItems', index))
  }else {
    const msg = '请勾选一个';
    showError(msg);
  }


};

const delAction = async (dispatch, getState) => {
  let res, option;
  const {tableItems} = getSelfState(getState());
  const newTableItems = checkedId(tableItems);
  option = postOption(newTableItems);
  res = await fetchJson(URL_DELETE, option);
  if (res.returnCode !== 0) {
    showError(res.returnMsg);
    return;
  }else {
    option = postOption({});
    res = await fetchJson(URL_LIST, option);
    if (res.returnCode !== 0) {
      showError(res.returnMsg);
      return;
    }
   dispatch(action.assign({tableItems: res.result}))
  }
};

const toolbarActions = {
  reset: resetAction,
  search: searchAction,
  add: addAction,
  edit: editAction,
  active: activeAction,
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



const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  //onLink: linkActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {afterEditActionCreator};


