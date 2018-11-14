import { connect } from 'react-redux';
import PublicAuthority from './PublicAuthority';
import {postOption, fetchJson, showSuccessMsg, showError, validValue} from '../../../common/common';
import Tree from '../../../common/tree';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';

const prefix = ['config', 'publicAuthority'];
const action = new Action(prefix);
const URL_CONFIG = '/api/config/public_authority/config';
const URL_SAVE = '/api/config/public_authority/save';
const URL_UPDATE = '/api/config/public_authority/update';
const URL_REMOVE = '/api/config/public_authority/remove';
const URL_TREE ='/api/config/public_authority/tree';
const URL_DROP_LIST = '/api/config/public_authority/drop_list';

const treeRoot = {   //  根节点数据
  root: 'top',
  top: {key: 'top', children: ['publicAuthority']},
  publicAuthority: {key: 'publicAuthority', title: '公共权限字典', children: [], data:{}},
};

const childrenKeyHandle = (arrayObj) => {  // 提取权限树根节点下的子节点生成key值数组
  let children = [];
  arrayObj.forEach((obj) => {
    children.push(obj.data.id);
  });
  return children;
};

const treeDataHandle = (parentKey, childrenKey, childrenData, tree) => {   // superTree数据处理
  childrenKey.forEach((key) => {
    childrenData.forEach((obj) => {
      if (obj.data.id === key) {
        tree[`${key}`] = {};
        tree[`${key}`].key = obj.data.id;
        tree[`${key}`].title = obj.title;
        tree[`${key}`].data = obj.data;
        tree[`${key}`].parent = parentKey;
        let children = [];
        if (obj.children) {
          obj.children.forEach((child) => {
            children.push(child.data.id);
          });
        }
        tree[`${key}`].children = children;
        treeDataHandle(obj.data.id, children, obj.children, tree);
      }
    })
  })
};

const getChildrenItems = (keyArray, treeData) => {   //根据key值获取对应的数据生成tableItems
  let childrenItems = [];
  keyArray.forEach((key) => {
    childrenItems.push(treeData[key].data);
  });
  return childrenItems;
};

//树转表格数据
const convertToList = (tree=[], list = [], pid) => {
  tree.map(item => {
    const id = {
      title: item.title,
      value: item.data.id
    };
    list.push({pid, id});
    if (item.children) {
      convertToList(item.children, list, id);
    }
  });
};

const getSelfState = (rootState) => {     // 获取对应的state
  // console.log(getPathValue(rootState, prefix));
  return getPathValue(rootState, prefix);
};

const initActionCreator = () => async (dispatch) => {    // 初始化state
  dispatch(action.assign({status: 'loading'}));
  let config = await fetchJson(URL_CONFIG);
  if (config.returnCode === 0) {
    const {returnCode, returnMsg, result} = await fetchJson(URL_DROP_LIST);
    if (returnCode !== 0) {
      showError(returnMsg);
      dispatch(action.assign({status: 'retry'}));
      return;
    }
    const treeResult = await fetchJson(URL_TREE);
    if (treeResult.returnCode === 0) {
      const treeData = treeResult.result;
      const childrenKey = childrenKeyHandle(treeData);
      treeRoot.publicAuthority.children = childrenKey;
      treeDataHandle('publicAuthority', childrenKey, treeData, treeRoot);
      let allItems = [];
      convertToList(treeData, allItems);
      dispatch(action.create({status: 'page', isNeedUpdatePage : false, ...config.result, treeData: treeRoot, expand: {publicAuthority: true}, allItems, indexTableItems: allItems}));
      dispatch(action.update({options: result}, 'formCols', {key: 'key', value: 'pid'}));
    } else {
      dispatch(action.assign({status: 'retry'}));
    }
  }
};

const saveActionCreator = () => async (dispatch, getState) => {    // 新增权限
  const state = getSelfState(getState());
  if (!validValue(state.formCols, state.formData)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  const {pid, resourceEnName, resourceKey, resourceName, resourceType} = state.formData;
  const postData = {pid, resourceEnName, resourceKey, resourceName, resourceType};
  const saveResult = await fetchJson(URL_SAVE, postOption(postData));
  if (saveResult.returnCode === 0) {
    const tableItems = [...state.tableItems, saveResult.result];    //新增权限追加都列表
    const treeNode = {[saveResult.result.id]: {       //新增权限追加到tree
      key: saveResult.result.id,
      data: saveResult.result,
      children: [],
      parent: saveResult.result.pid === 'root' ? 'publicAuthority' : saveResult.result.pid,
      title: saveResult.result.resourceName,
    }};
    showSuccessMsg('新增成功');
    dispatch(action.assign({
      tableItems: tableItems,
      treeData: {
        ...state.treeData,
        ...treeNode,
        [saveResult.result.pid === 'root' ? 'publicAuthority' : saveResult.result.pid]: {   // 修改新增权限上级权限的children列表
          ...state.treeData[saveResult.result.pid === 'root' ? 'publicAuthority' : saveResult.result.pid],
          children: [...state.treeData[saveResult.result.pid === 'root' ? 'publicAuthority' : saveResult.result.pid].children, saveResult.result.id],
        }}}));
  } else {
    showError(saveResult.returnMsg || '新增失败');
  }
};

const updateActionCreator = () => async (dispatch, getState) => {     // 更新权限
  const state = getSelfState(getState());
  const {id, pid, resourceEnName, resourceKey, resourceName, resourceType} = state.formData;
  if (!id || id === '') {
    showError('请选择需要修改的权限');
    return;
  }
  if (!validValue(state.formCols, state.formData)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  const postData = {id, pid, resourceEnName, resourceKey, resourceName, resourceType};
  const updateResult = await fetchJson(URL_UPDATE, postOption(postData));
  if (updateResult.returnCode === 0) {
    showSuccessMsg('更新成功');
    if (state.isNeedUpdatePage) {
      return initActionCreator()(dispatch);
    }else {
      dispatch(action.update(updateResult.result, 'tableItems', {key: 'id', value: updateResult.result.id}));
      dispatch(action.assign({
          [updateResult.result.id]:
          {...state.treeData[updateResult.result.id],
            title: updateResult.result.resourceName,
            data: updateResult.result,
          }},
        'treeData'));
    }
  } else {
    showError(updateResult.returnMsg || '更新失败');
  }
};

const removeActionCreator = () => async (dispatch, getState) => {    // 删除权限
  const state = getSelfState(getState());
  const saveResult = await fetchJson(URL_REMOVE, postOption({id: state.formData.id}));
  if (saveResult.returnCode === 0) {
    showSuccessMsg('删除成功');
    return initActionCreator()(dispatch);
  } else {
    showError('删除失败');
  }
};

const onExpand = (key, value) => (dispatch) => { // 展开
  dispatch(action.assign({[key]: value}, 'expand'));
};

const onSelect = (key) => (dispatch, getState) => {
  const state = getSelfState(getState());
  const childrenKeyArray = state.treeData[key].children;
  const formData = state.treeData[key].data.resourceType === 3 ? {} : {pid: state.treeData[key].data.id || 'root'};
  const tableItems = getChildrenItems(childrenKeyArray, state.treeData);
  dispatch(action.assign({...state, tableItems: tableItems, formData: formData, select: key}));
};

// 依据id查找相应的key
const findKeyById = (tree, id) => {
  return Object.keys(tree).find(key => {
    const item = tree[key] || {};
    if (typeof item === 'object' && item.data) {
      return item.data.id === id;
    } else {
      return false;
    }
  })
};

const onLink = (key, index, item) => (dispatch, getState) => {
  if (key === 'id') {
    const state = getSelfState(getState());
    const select = findKeyById(state.treeData, item.id.value);
    return onSelect(select)(dispatch, getState);
  }else {
    dispatch(action.assign({isNeedUpdatePage : false}));
    dispatch(action.assign(item, 'formData'));
  }
};

const formDataChange = (key, value) => (dispatch, getState) => {   //formData更新
  const state = getSelfState(getState());
  if (key === 'pid' && state.formData[key] !== value) {
    dispatch(action.assign({isNeedUpdatePage : true}));
  }
  dispatch(action.assign({[key]: value}, 'formData'));
};

const searchActionCreator = (dispatch, getState) => {
  const {allItems, treeData, inputValue} = getSelfState(getState());
  if (inputValue) {
    const indexTableItems = allItems.filter(item => item.id.title.includes(inputValue));
    dispatch(action.assign({searchValue: inputValue, expand: Tree.search(treeData, inputValue), indexTableItems}));
  } else {
    dispatch(action.assign({searchValue: inputValue, indexTableItems: allItems}));
  }
};

const buttonActions = {
  search: searchActionCreator
};

const clickActionCreator = (key) => {
  if (buttonActions.hasOwnProperty(key)) {
    return buttonActions[key];
  } else {
    showError(`unknown key:${key}`);
    return {type: 'unknown'};
  }
};

const inputChangeActionCreator = (value) => {
  return action.assign({inputValue: value});
};

const tabChangeActionCreator = (key) => {
  return action.assign({activeKey: key});
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const mapStateToProps = (state) => {     // 返回state
  return getSelfState(state);
};

const actionCreators = {   // 返回action
  onInit: initActionCreator,
  onSave: saveActionCreator,
  onUpdate: updateActionCreator,
  onRemove: removeActionCreator,
  formDataChange: formDataChange,
  onExpand: onExpand,
  onSelect: onSelect,
  onLink: onLink,
  onInputChange: inputChangeActionCreator,
  onClick: clickActionCreator,
  onTabChange: tabChangeActionCreator,
  onExitValid: exitValidActionCreator
};
const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(PublicAuthority));
export default Container;
