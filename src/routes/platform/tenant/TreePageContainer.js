import { connect } from 'react-redux';
import TreePage from '../../../components/TreePage';
import helper, {getObject, fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import Tree from '../../../common/tree';
import showUserManagerDialog from './userManager/showUserManagerDialog';

const STATE_PATH = ['basic', 'tenant'];
const action = new Action(STATE_PATH, false);
const URL_ACTIVE = '/api/basic/tenant/active';
const URL_DEL = '/api/basic/tenant';
const URL_CHILDREN = '/api/basic/tenant/children';

const buildEditState = (config, data, edit) => {
  return {
    edit,
    config: config.config,
    controls: config.controls,
    title: edit ? config.edit : config.add,
    value: data
  };
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const inputChangeActionCreator = (value) => {
  return action.assign({inputValue: value});
};

// 在树中搜索租户(模糊搜索)
const searchAction = (dispatch, getState) => {
  const {tree, inputValue, allItems} = getSelfState(getState());
  if (inputValue) {
    const indexTableItems = allItems.filter(item => item.id.title.includes(inputValue));
    dispatch(action.assign({searchValue: inputValue, expand: Tree.search(tree, inputValue), indexTableItems}));
  } else {
    dispatch(action.assign({searchValue: inputValue, indexTableItems: allItems}));
  }
};

// 弹出新增租户对话框
const addAction = (dispatch, getState) => {
  const {editConfig, keys, select, tree} = getSelfState(getState());
  const value = getPathValue(tree, [select, 'value', 'guid']);
  const title = getPathValue(tree, [select, 'title']);
  const data = {[keys.parent]: value === 'root' ? '' : {value, title}};
  const payload = buildEditState(editConfig, data, false);
  dispatch(action.assign(payload, 'edit'));
};

// 弹出编辑租户对话框
const editAction = (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const payload = buildEditState(editConfig, tableItems[index], true);
    dispatch(action.assign(payload, 'edit'));
  }
};

// 关闭编辑或新增租户对话框
const closeActionCreator = (tenant, edit) => (dispatch, getState) => {
  const state = getSelfState(getState());
  if (tenant) {
    if (!edit) {
      const tree = Tree.addNode(state.tree, tenant.tenantName, {guid: tenant.guid}, state.select);
      dispatch(action.assign({tree}));
      dispatch(action.add(tenant, 'tableItems'));
    } else {
      const index = {key: 'guid', value: tenant.guid};
      const key = Tree.findKeyByGuid(state.tree, tenant.guid);
      dispatch(action.update(tenant, 'tableItems', index));
      dispatch(action.assign({title: tenant.tenantName}, ['tree', key]));
    }
  }
  dispatch(action.assign({edit: undefined}));
};

// 激活
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

// 失效(删除)
const delAction = async (dispatch, getState) => {
  const {tableItems, tree} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const item = tableItems[index];
    const {returnCode, returnMsg, result} = await fetchJson(`${URL_DEL}/${item.guid}`, {method: 'delete'});
    if (returnCode === 0) {
      if (result.active) {
        dispatch(action.update(result, 'tableItems', index));
      } else {
        const newTree = Tree.delNode(tree, Tree.findKeyByGuid(tree, item.guid));
        dispatch(action.assign({tree: newTree}));
        dispatch(action.del('tableItems', index));
      }
    } else {
      showError(returnMsg);
    }
  }
};

// 用户管理
const userAction = async (dispatch, getState) => {
  const {tableItems, userConfig} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    return showUserManagerDialog(userConfig, tableItems[index]);
  }else {
    helper.showError('请先勾选一条记录');
  }
};

const toolbarActions = {
  search: searchAction,
  add: addAction,
  edit: editAction,
  active: activeAction,
  del: delAction,
  user: userAction
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

const doubleClickActionCreator = (index) => (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const payload = buildEditState(editConfig, tableItems[index], true);
  dispatch(action.update({checked: true}, 'tableItems', index));
  dispatch(action.assign(payload, 'edit'));
};

const expandActionCreator = (key, expand) => {
  return action.assign({[key]: expand}, 'expand');
};

// 获取指定租户下的直接子租户
const selectActionCreator = (key) => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const guid = getPathValue(state, ['tree', key, 'value', 'guid']);
  const data = await fetchJson(`${URL_CHILDREN}/${guid}`);
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
  onLink: linkActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(TreePage);
export default Container;
export {closeActionCreator};
