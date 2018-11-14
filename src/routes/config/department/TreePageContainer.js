import { connect } from 'react-redux';
import TreePage from '../../../components/TreePage';
import helper, {fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import Tree from '../../../common/tree';
import {buildEditState} from './EditDialogContainer';
import {initActionCreator} from './DepartmentContainer';

const STATE_PATH = ['basic', 'department'];
const action = new Action(STATE_PATH);
const URL_ACTIVE = '/api/basic/department/active';
const URL_DEL = '/api/basic/department';
const URL_CHILDREN = '/api/basic/department/children';

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

// 获取上级机构和上级部门
const getUpper = (tree, key) => {
  const upper = tree[key];
  if (!upper) {
    return {};
  } else if (upper.type === 'institution') {
    return {institutionGuid: Tree.getGuidAndTitle(tree, key)};
  } else {
    const institutionGuid = getInstitutionGuidAndTitle(tree, upper);
    const parentDepartmentGuid = Tree.getGuidAndTitle(tree, key);
    return {parentDepartmentGuid, institutionGuid};
  }
};

const inputChangeActionCreator = (value) => {
  return action.assign({inputValue: value});
};

// 在树中搜索部门(模糊搜索)
const searchAction = (dispatch, getState) => {
  const {allItems, tree, inputValue} = getSelfState(getState());
  if (inputValue) {
    const indexTableItems = allItems.filter(item => item.id.title.includes(inputValue));
    dispatch(action.assign({searchValue: inputValue, expand: Tree.search(tree, inputValue), indexTableItems}));
  } else {
    dispatch(action.assign({searchValue: inputValue, indexTableItems: allItems}));
  }
};

// 弹出新增部门对话框
const addAction = (dispatch, getState) => {
  const {editConfig, select, tree} = getSelfState(getState());
  if (!tree.root) {
    showError('请先添加组织机构');
    return;
  }
  const data = getUpper(tree, select);
  const payload = buildEditState(editConfig, data, false);
  dispatch(action.assign(payload, 'edit'));
};

// 弹出编辑部门对话框
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
  dispatch(action.assign(payload, 'edit'));
};

// 编辑完成后的动作
const afterEditActionCreator = (department, edit) => (dispatch, getState) => {
  const state = getSelfState(getState());
  if (department) {
    if (!edit) {
      const tree = Tree.addNode(state.tree, department.departmentName, {guid: department.guid}, state.select);
      dispatch(action.assign({tree}));
      dispatch(action.add(department, 'tableItems', 0));
    } else {
      const index = {key: 'guid', value: department.guid};
      const key = Tree.findKeyByGuid(state.tree, department.guid);
      dispatch(action.update(department, 'tableItems', index));
      dispatch(action.assign({title: department.departmentName}, ['tree', key]));
    }
  }
  dispatch(action.assign({edit: undefined}));
};

// 激活部门
const activeAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const item = tableItems[index];
    const {returnCode, returnMsg, result} = await fetchJson(`${URL_ACTIVE}/${item.guid}`, 'put');
    if (returnCode === 0) {
      dispatch(action.update(result, 'tableItems', index));
    } else {
      showError(returnMsg);
    }
  }
};

// 删除(或失效)部门
const delAction = async (dispatch, getState) => {
  const {tableItems, tree} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const item = tableItems[index];
    const {returnCode, returnMsg, result} = await fetchJson(`${URL_DEL}/${item.guid}`, 'delete');
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

const toolbarActions = {
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

const checkActionCreator = (isAll, checked, rowIndex) => {
  const index = isAll ? -1 : rowIndex;
  return action.update({checked}, 'tableItems', index);
};

const expandActionCreator = (key, expand) => {
  return action.assign({[key]: expand}, 'expand');
};

const selectActionCreator = (key) => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const item = getPathValue(state, ['tree', key]);
  const data = await fetchJson(`${URL_CHILDREN}/${item.value.guid}/${item.type}`);
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
  onDoubleClick: doubleClickActionCreator,
  onCheck: checkActionCreator,
  onExpand: expandActionCreator,
  onSelect: selectActionCreator,
  onTabChange: tabChangeActionCreator,
  onLink: linkActionCreator,
  onReload: reloadActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(TreePage);
export default Container;
export {afterEditActionCreator};
