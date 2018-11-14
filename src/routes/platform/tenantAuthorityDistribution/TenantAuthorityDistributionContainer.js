import { connect } from 'react-redux';
import TenantAuthorityDistribution from './TenantAuthorityDistribution';
import {postOption, fetchJson, showSuccessMsg, showError} from '../../../common/common';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';

const prefix = ['config', 'tenantAuthorityDistribution'];
const action = new Action(prefix);
const URL_CONFIG = '/api/config/tenant_authority_distribution/config';
const URL_AUTHORITY_TREE = '/api/config/tenant_authority_distribution/tenant_Authority_tree';
const URL_AUTHORITY_MOVE = '/api/config/tenant_authority_distribution/authority_move';
const URL_TENANT_LIST  = '/api/config/tenant_authority_distribution/tenant_list';


const refreshTenantAuthority = async (id, dispatch) => {   //获取租户权限
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
  const authorityTreeResult = await fetchJson(URL_AUTHORITY_TREE, postOption({id}));  // id通过查询获取
  if (authorityTreeResult.returnCode === 0) {
    const notDistributionTreeData = authorityTreeResult.result.notDistributionTree;
    const distributionTreeData = authorityTreeResult.result.distributionTree;
    const notDistributionChildrenKey = childrenKeyHandle(notDistributionTreeData);
    const distributionChildrenKey = childrenKeyHandle(distributionTreeData);
    notDistributionTreeRoot.notDistribution.children = notDistributionChildrenKey;
    distributionTreeRoot.distribution.children = distributionChildrenKey;
    treeDataHandle('notDistribution', notDistributionChildrenKey, notDistributionTreeData, notDistributionTreeRoot);
    treeDataHandle('distribution', distributionChildrenKey, distributionTreeData, distributionTreeRoot);
    dispatch(action.assign({notDistributionTree: notDistributionTreeRoot, distributionTree: distributionTreeRoot}));
  } else {
    showError(authorityTreeResult.returnMsg || '打开权限分配失败');
  }
};

export const childrenKeyHandle = (arrayObj) => {  // 提取权限树根节点下的子节点生成key值数组
  let children = [];
  arrayObj.forEach((obj) => {
    children.push(obj.data.id);
  });
  return children;
};

export const treeDataHandle = (parentKey, childrenKey, childrenData, tree) => {   // superTree数据处理
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
    dispatch(action.assign({status: 'page', ...config.result}));
  } else {
    dispatch(action.assign({status: 'retry'}));
  }
};

const searchDataChange = (key, value) => async (dispatch) => {
  const postData = {
    [key]: value,
    maxNumber: 10,
  };
  const tenantListResult = await fetchJson(URL_TENANT_LIST, postOption(postData));  // id通过查询获取
  dispatch(action.assign({[key]: value}, 'searchData'));
  if (tenantListResult.returnCode === 0) {
    dispatch(action.update({options: tenantListResult.result}, 'filters', {key: 'key', value: key}));
  }
};

const onChange = (key, value) => (dispatch) => {
  if(key === 'name'){
    dispatch(action.assign({notDistributionTree: [], distributionTree: []}));
  }
  dispatch(action.assign({currentTenantId: value.value}));
  dispatch(action.assign({[key]: value.title}, 'searchData'));
};

const cleanSearchData = () => (dispatch) => {   // 重置搜索条件
  dispatch(action.assign({searchData: {}}));
};

const getTenantAuthority = () => async (dispatch, getState) => {   //获取租户权限
  const {currentTenantId, searchData} = getSelfState(getState());
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
  const authorityTreeResult = await fetchJson(URL_AUTHORITY_TREE, postOption({id: currentTenantId}));
  if (authorityTreeResult.returnCode === 0) {
    const notDistributionTreeData = authorityTreeResult.result.notDistributionTree;
    const distributionTreeData = authorityTreeResult.result.distributionTree;
    const notDistributionChildrenKey = childrenKeyHandle(notDistributionTreeData);
    const distributionChildrenKey = childrenKeyHandle(distributionTreeData);
    notDistributionTreeRoot.notDistribution.title = `可分配权限(${searchData.name})`;
    distributionTreeRoot.distribution.title = `已分配权限(${searchData.name})`;
    notDistributionTreeRoot.notDistribution.children = notDistributionChildrenKey;
    distributionTreeRoot.distribution.children = distributionChildrenKey;
    treeDataHandle('notDistribution', notDistributionChildrenKey, notDistributionTreeData, notDistributionTreeRoot);
    treeDataHandle('distribution', distributionChildrenKey, distributionTreeData, distributionTreeRoot);
    dispatch(action.assign({notDistributionTree: notDistributionTreeRoot, distributionTree: distributionTreeRoot, currentTenantId: currentTenantId}));
  } else {
    showError(authorityTreeResult.returnMsg || '打开权限分配失败');
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
  const {notDistributionChecked, distributionChecked, currentTenantId} = getSelfState(getState());
  let nodeIds = moveMode === 'moveIn' ? Object.keys(notDistributionChecked) :
    Object.keys(distributionChecked);

  if (nodeIds.length === 0) {
    showError('请选择需要移动的权限节点');
    return ;
  }
  if(nodeIds.indexOf('notDistribution') > -1 || nodeIds.indexOf('distribution') > -1) {
    nodeIds = ['root'];
  }
  const postData = {
    id: currentTenantId,
    moveMode: mode[moveMode],
    nodeIds: nodeIds,
  };
  const moveResult = await fetchJson(URL_AUTHORITY_MOVE, postOption(postData));
  if (moveResult.returnCode === 0){
    await refreshTenantAuthority(currentTenantId, dispatch);
  }
};

const mapStateToProps = (state) => {     // 返回state
  return getSelfState(state);
};

const actionCreators = {   // 返回action
  onInit: initActionCreator,
  searchDataChange: searchDataChange,
  onChange: onChange,
  cleanSearchData: cleanSearchData,
  getTenantAuthority: getTenantAuthority,
  notDistributionOnExpand: notDistributionOnExpand,
  distributionOnExpand: distributionOnExpand,
  notDistributionOnChecked: notDistributionOnChecked,
  distributionOnChecked: distributionOnChecked,
  authorityMove: authorityMove,
};
const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(TenantAuthorityDistribution));
export default Container;
