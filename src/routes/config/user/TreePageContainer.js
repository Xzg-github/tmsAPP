import { connect } from 'react-redux';
import TreePage from '../../../components/TreePage';
import helper, {getObject, fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import Tree from '../../../common/tree';
import {initActionCreator} from './UserContainer';
import showSetDialog from './SetDialog';

const STATE_PATH = ['basic', 'user'];
const action = new Action(STATE_PATH);
const URL_ACTIVE = '/api/basic/user/active';
const URL_DEL = '/api/basic/user';
const URL_LIST = '/api/basic/user/list';
const URL_SEARCH_USER = '/api/basic/user/search';

const buildEditState = (config, data, edit) => {
  return {
    edit,
    config: config.config,
    controls:edit?config.controls2:config.controls,
    title: edit ? config.edit : config.add,
    value: data
  };
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const getInstitutionGuidAndTitle = (tree, node) => {
  let current = node;
  while (current.type !== 'institution') {
    current = tree[current.parent];
  }
  return {value: current.value.guid, title: current.title};
};

// 获取上级机构或上级部门
const getUpper = (tree, key) => {
  const upper = tree[key];
  if (!upper) {
    return {};
  } else if (upper.type === 'institution') {
    return {institutionGuid: Tree.getGuidAndTitle(tree, key)};
  } else {
    const institutionGuid = getInstitutionGuidAndTitle(tree, upper);
    const departmentGuid = Tree.getGuidAndTitle(tree, key);
    return {departmentGuid, institutionGuid};
  }
};

const inputChangeActionCreator = (value) => {
  return action.assign({inputValue: value});
};

// 在部门树中搜索用户
const searchAction = async (dispatch, getState) => {
  const {inputValue, tree, allItems} = getSelfState(getState());
  if (inputValue) {
    const json = await helper.fetchJson(URL_SEARCH_USER, helper.postOption({filter: inputValue}));
    if (json.returnCode !== 0) {
      helper.showError(json.returnMsg);
      dispatch(action.assign({searchValue: '', indexTableItems: allItems}));
    } else {
      let payload = Tree.search2(tree, json.result);
      if (payload) {
        payload.indexTableItems = allItems.filter(item => json.result.includes(item.id.value));
        dispatch(action.assign(payload));
      } else {
        helper.showError('未搜索到指定用户');
        dispatch(action.assign({searchValue: '', indexTableItems: []}));
      }
    }
  } else {
    dispatch(action.assign({searchValue: '', indexTableItems: allItems}));
  }
};

// 弹出新增用户对话框
const addAction = (dispatch, getState) => {
  const {editConfig, tree, select} = getSelfState(getState());
  if(!getUpper(tree, select).departmentGuid){
    return showError("请在部门下新增用户！")
  }
  const payload = buildEditState(editConfig, getUpper(tree, select), false);
  dispatch(action.assign(payload, 'edit'));
};

// 弹出编辑用户对话框
const editAction = (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const payload = buildEditState(editConfig, tableItems[index], true);
    dispatch(action.assign(payload, 'edit'));
  }
};

const doubleClickActionCreator = (index) => (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const payload = buildEditState(editConfig, tableItems[index], true);
  dispatch(action.update({checked: true}, 'tableItems', index));
  dispatch(action.assign(payload, 'edit'));
};

// 编辑完成后的动作
const afterEditActionCreator = (user, edit) => (dispatch, getState) => {
  const state = getSelfState(getState());
  if (user) {
    if (!edit) {
      dispatch(action.add(user, 'tableItems', 0));
    } else {
      const index = {key: 'guid', value: user.guid};
      dispatch(action.update(user, 'tableItems', index));
    }
  }
  dispatch(action.assign({edit: undefined}));
};

const activeAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const item = tableItems[index];
    const {returnCode, returnMsg, result} = await fetchJson(`${URL_ACTIVE}/${item.guid}`, {method: 'put'});
    if (returnCode === 0) {
      dispatch(action.update(result, 'tableItems', index));
    } else {
      showError(returnMsg);
    }
  }
};

const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const item = tableItems[index];
    const {returnCode, returnMsg, result} = await fetchJson(`${URL_DEL}/${item.guid}`, 'delete');
    if (returnCode === 0) {
      if (result.active) {
        dispatch(action.update(result, 'tableItems', index));
      } else {
        dispatch(action.del('tableItems', index));
      }
    } else {
      showError(returnMsg);
    }
  }
};

const resetAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ids = tableItems.filter(item => item.checked === true).map(item => item.guid);
  if (ids.length === 1) {
    const {returnCode, returnMsg} = await fetchJson(`/api/basic/user/reset_password/${ids[0]}`, 'put');
    if (returnCode === 0) {
      helper.showSuccessMsg('密码重置成功，新密码请查看邮件');
    } else {
      showError(returnMsg);
    }
  }else {
    helper.showError('请先勾选一条记录');
  }
};

const setAction = async (dispatch, getState) => {
  const {tableItems, select} = getSelfState(getState());
  const ids = tableItems.filter(item => item.checked === true).map(item => item.guid);
  if (ids.length < 1) {
    return helper.showError(`请先勾选记录`);
  }
  if (true === await showSetDialog(ids)) {
    helper.showSuccessMsg(`设置签署角色成功`);
    return selectActionCreator(select)(dispatch, getState);
  }
};

const toolbarActions = {
  search: searchAction,
  add: addAction,
  edit: editAction,
  active: activeAction,
  del: delAction,
  reset: resetAction,
  set: setAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  const index = isAll ? -1 : rowIndex;
  return action.update({checked}, 'tableItems', index);
};

const expandActionCreator = (key, expand) => {
  return action.assign({[key]: expand}, 'expand');
};

// 获取指定机构或部门下的用户
const selectActionCreator = (key) => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const item = getPathValue(state, ['tree', key]);
  const data = await fetchJson(`${URL_LIST}/${item.value.guid}/${item.type}`);
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
  } else {
    dispatch(action.assign({select: key, tableItems: data.result}));
  }
};

const tabChangeActionCreator = (activeKey) => {
  return action.assign({activeKey});
};

const linkActionCreator = (key, rowIndex, item) => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const select = Tree.findKeyByGuid(state.tree, item.id.value);
  return selectActionCreator(select)(dispatch, getState);
};

const reloadActionCreator = () => async (dispatch, getState) => {
  return initActionCreator()(dispatch, getState);
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInputChange: inputChangeActionCreator,
  onClick: clickActionCreator,
  onCheck: checkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onExpand: expandActionCreator,
  onSelect: selectActionCreator,
  onTabChange: tabChangeActionCreator,
  onLink: linkActionCreator,
  onReload: reloadActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(TreePage);
export default Container;
export {afterEditActionCreator};
