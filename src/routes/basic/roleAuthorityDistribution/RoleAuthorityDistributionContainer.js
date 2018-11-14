import { connect } from 'react-redux';
import RoleAuthorityDistribution from './RoleAuthorityDistribution';
import {postOption, fetchJson, showError, showSuccessMsg} from '../../../common/common';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';

const prefix = ['config', 'roleAuthorityDistribution'];
const action = new Action(prefix);
const URL_CONFIG = '/api/config/role_authority_distribution/config';
const URL_SAVE = '/api/config/role_authority_distribution/save';
const URL_UPDATE = '/api/config/role_authority_distribution/update';
const URL_ACTIVE = '/api/config/role_authority_distribution/active';
const URL_INVALID = '/api/config/role_authority_distribution/invalid';
const URL_LIST = '/api/config/role_authority_distribution/list';
const URL_TREE = '/api/config/role_authority_distribution/tree';
const URL_MOVE = '/api/config/role_authority_distribution/move';

const refreshTenantAuthority = async (roleData, dispatch) => {   //获取租户权限
  const notDistributionTreeRoot = {   //  根节点数据
    root: 'top',
    top: {key: 'top', children: ['notDistribution']},
    notDistribution: {key: 'notDistribution', title: '可分配权限', children: [], data:{}},
  };
  const distributionTreeRoot = {   //  根节点数据
    root: 'top',
    top: {key: 'top', children: ['distribution']},
    distribution: {key: 'distribution', title: '已分配权限', children: [], data:{}},
  };
  const treeResult = await fetchJson(URL_TREE, postOption({id: roleData.id}));  // id通过查询获取
  if (treeResult.returnCode === 0) {
    const notDistributionTreeData = treeResult.result.notDistribution;
    const distributionTreeData = treeResult.result.distribution;
    const notDistributionChildrenKey = childrenKeyHandle(notDistributionTreeData);
    const distributionChildrenKey = childrenKeyHandle(distributionTreeData);
    notDistributionTreeRoot.notDistribution.children = notDistributionChildrenKey;
    distributionTreeRoot.distribution.children = distributionChildrenKey;
    notDistributionTreeRoot.notDistribution.title = `可分配权限(${roleData.roleName})`;
    distributionTreeRoot.distribution.title = `已分配权限(${roleData.roleName})`;
    treeDataHandle('notDistribution', notDistributionChildrenKey, notDistributionTreeData, notDistributionTreeRoot);
    treeDataHandle('distribution', distributionChildrenKey, distributionTreeData, distributionTreeRoot);
    dispatch(action.assign({notDistributionTree: notDistributionTreeRoot, distributionTree: distributionTreeRoot}));
  } else {
    showError(treeResult.returnMsg || '打开权限分配失败');
  }
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

const getSelfState = (rootState) => {     // 获取对应的state
  return getPathValue(rootState, prefix);
};

const initActionCreator = () => async (dispatch) => {    // 初始化state
  dispatch(action.assign({status: 'loading'}));
  const config = await fetchJson(URL_CONFIG);
  if (config.returnCode === 0) {
    const listResult = await fetchJson(URL_LIST);
    if(listResult.returnCode === 0) {
      dispatch(action.assign({status: 'page', ...config.result, tableItems: listResult.result, filterItems: listResult.result}));
    } else {
      dispatch(action.assign({status: 'retry'}));
    }
  } else {
    dispatch(action.assign({status: 'retry'}));
  }
};

const onCheck = (isAll, checked, rowIndex) => (dispatch) => {
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex)) ;
};

const onSave =(data) => async (dispatch, getState) => {
  const { tableItems } = getSelfState(getState());
  const saveResult = await fetchJson(URL_SAVE, postOption(data));
  if(saveResult.returnCode === 0) {
    dispatch(action.assign({tableItems: [saveResult.result, ...tableItems]}));
    showSuccessMsg('添加角色成功');
  } else {
    showError('添加角色失败');
  }
};

const onUpdate =(data) => async (dispatch) => {
  const updateResult = await fetchJson(URL_UPDATE, postOption(data));
  if(updateResult.returnCode === 0) {
    dispatch(action.update({roleName: data.roleName, remark: data.remark}, 'tableItems', {key: 'id', value: data.id}));
    showSuccessMsg('更新成功');
  } else {
    showError('更新失败');
  }
};

const onActive = (id) => async (dispatch) => {
  const activeResult = await fetchJson(URL_ACTIVE, postOption({id}));
  if(activeResult.returnCode === 0) {
    dispatch(action.update({status: 1}, 'tableItems', {key: 'id', value: id}));
    showSuccessMsg('激活成功');
  } else {
    showError('激活失败');
  }
};

const onInvalid = (id) => async (dispatch) => {
  const invalidResult = await fetchJson(URL_INVALID, postOption({id}));
  if(invalidResult.returnCode === 0) {
    dispatch(action.update({status: 3}, 'tableItems', {key: 'id', value: id}));
    showSuccessMsg('失效成功');
  } else {
    showError('失效失败');
  }
};

const onGetDistributeTree = (roleData) => async (dispatch) => {
  if(roleData.status === 3) {
    showError('角色失效无法分配权限');
    return;
  }
  const notDistributionTreeRoot = {   //  根节点数据
    root: 'top',
    top: {key: 'top', children: ['notDistribution']},
    notDistribution: {key: 'notDistribution', title: '可分配权限', children: [], data:{}},
  };
  const distributionTreeRoot = {   //  根节点数据
    root: 'top',
    top: {key: 'top', children: ['distribution']},
    distribution: {key: 'distribution', title: '已分配权限', children: [], data:{}},
  };
  const treeResult = await fetchJson(URL_TREE, postOption({id: roleData.id}));
  if (treeResult.returnCode === 0) {
    const notDistributionTreeData = treeResult.result.notDistribution;
    const distributionTreeData = treeResult.result.distribution;
    const notDistributionChildrenKey = childrenKeyHandle(notDistributionTreeData);
    const distributionChildrenKey = childrenKeyHandle(distributionTreeData);
    notDistributionTreeRoot.notDistribution.children = notDistributionChildrenKey;
    distributionTreeRoot.distribution.children = distributionChildrenKey;
    notDistributionTreeRoot.notDistribution.title = `可分配权限(${roleData.roleName})`;
    distributionTreeRoot.distribution.title = `已分配权限(${roleData.roleName})`;
    treeDataHandle('notDistribution', notDistributionChildrenKey, notDistributionTreeData, notDistributionTreeRoot);
    treeDataHandle('distribution', distributionChildrenKey, distributionTreeData, distributionTreeRoot);
    dispatch(action.assign({notDistributionTree: notDistributionTreeRoot, distributionTree: distributionTreeRoot, currentRoleId: roleData.id}));
  } else {
    showError(treeResult.returnMsg || '打开权限分配失败');
  }
};

const notDistributionOnExpand = (key, value) => (dispatch) => {  // 可分配权限展开事件
  dispatch(action.assign({[key]: value}, 'notDistributionExpand'));
};
const distributionOnExpand = (key, value) => (dispatch) => {  // 已分配权限展开事件
  dispatch(action.assign({[key]: value}, 'distributionExpand'));
};

const notDistributionOnChecked = (key, value) => (dispatch) => {   // 可分配权限选择事件
  dispatch(action.assign({notDistributionChecked: {[key]: value}}));
};

const distributionOnChecked = (key, value) => (dispatch) => {   // 已分配权限选择事件
  dispatch(action.assign({distributionChecked: {[key]: value}}));
};

const authorityMove = (moveMode) => async (dispatch, getState) => {   // 权限移动事件
  const mode = {
    moveIn: 1,
    moveOut: 2,
  };
  const {notDistributionChecked, distributionChecked, currentRoleId, tableItems} = getSelfState(getState());
  let nodeIds = moveMode === 'moveIn' ? Object.keys(notDistributionChecked) :
    Object.keys(distributionChecked);

  if (nodeIds.length === 0) {
    showError('请选择需要移动的权限节点');
    return;
  }
  if(nodeIds.indexOf('notDistribution') > -1 || nodeIds.indexOf('distribution') > -1) {
    nodeIds = ['root'];
  }
  const postData = {
    id: currentRoleId,
    moveMode: mode[moveMode],
    nodeIds: nodeIds,
  };
  const moveResult = await fetchJson(URL_MOVE, postOption(postData));
  if (moveResult.returnCode === 0) {
    for(let roleData of tableItems) {
      if(roleData.id === currentRoleId) {
        await refreshTenantAuthority(roleData, dispatch);
        break;
      }
    }

  }
};

//Input搜索框change监听
const changeActionCreator = (event) => (dispatch, getState) =>{
  dispatch(action.assign({formValue: event.target.value}));
  const { filterItems, formValue} = getSelfState(getState());
  let newTableItems = [];
  filterItems.forEach((item) => {
    if(item.roleName.toLowerCase().indexOf(formValue.toLowerCase()) > -1) {
      newTableItems.push(item);
    }
  });
  dispatch(action.assign({tableItems: newTableItems}));
};

const mapStateToProps = (state) => {     // 返回state
  return getSelfState(state);
};

const actionCreators = {   // 返回action
  onInit: initActionCreator,
  onSave: onSave,
  onUpdate: onUpdate,
  onActive: onActive,
  onInvalid: onInvalid,
  onCheck: onCheck,
  onGetDistributeTree: onGetDistributeTree,
  notDistributionOnExpand: notDistributionOnExpand,
  distributionOnExpand: distributionOnExpand,
  notDistributionOnChecked:notDistributionOnChecked,
  distributionOnChecked: distributionOnChecked,
  authorityMove: authorityMove,
  onChange: changeActionCreator,
};
const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(RoleAuthorityDistribution));
export default Container;
