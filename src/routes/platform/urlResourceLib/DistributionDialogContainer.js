import { connect } from 'react-redux';
import DistributionDialog from './DistributionDialog';
import {fetchJson, showSuccessMsg, showError, postOption} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {updateTable} from './OrderPageContainer';

const prefix = ['platform', 'urlResourceLib', 'distribution'];
const action = new Action(prefix);
const CLOSE_ACTION = action.assignParent({distribution: undefined});
const URL_SAVE_TREE = '/api/platform/urlResourceLib/save';

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

export const buildTreeState = (config, data, checkedId) => {
  const distributionTreeRoot = {   //  根节点数据
    root: 'top',
    top: {key: 'top', children: ['distributionTree']},
    distributionTree: {key: 'distributionTree', title: '已分配权限', children: []},
  };
  const distributionTreeData = data.allDistribution;
  const distributionChildrenKey = childrenKeyHandle(distributionTreeData);
  distributionTreeRoot.distributionTree.title = '已分配权限';
  distributionTreeRoot.distributionTree.children = distributionChildrenKey;
  treeDataHandle('distributionTree', distributionChildrenKey, distributionTreeData, distributionTreeRoot);
  let checkedIds = {};
  if(data.ids) {
    data.ids.map((item) =>{
      checkedIds[item] = true;
    });
  }

  let initState = {
    ...config,
    distributionTree: distributionTreeRoot,
    distributionChecked: checkedIds,
    checkedId
  };
  return initState;
};

const getSelfState = (rootState) => {     // 获取对应的state
  return getPathValue(rootState, prefix);
};

const okActionCreator = (key) => async (dispatch, getState) => {
  const {distributionChecked, distributionTree, checkedId} = getSelfState(getState());
  let all=[];
  if(distributionChecked){
    all = Object.keys(distributionChecked).filter(key => distributionChecked[key]);
  }
  let urlResourceList =[];
  all.map(item => {
    urlResourceList.push({
      parentResourceId: distributionTree[item].parent,
      publicResourceId: distributionTree[item].key
    })
  });
  const postData = {
    urlResourceLibraryId: checkedId,
    urlResourceList
  };
  const res = await fetchJson(URL_SAVE_TREE, postOption(postData));
  if(res.returnCode ==0){
    showSuccessMsg('权限分配成功');
    dispatch(CLOSE_ACTION);
    updateTable(dispatch, getState);
  }else{
    showError('权限分配失败');
  }

};

const cancelActionCreator = () => (dispatch) => {
  dispatch(CLOSE_ACTION);
};

const distributionOnExpand = (key, value) => (dispatch) => {  // 已分配权限展开事件
  dispatch(action.assign({[key]: value}, 'distributionExpand'));
};

const distributionOnChecked = (key, value) => (dispatch) => {   // 已分配权限选择事件
  dispatch(action.assign({[key]: value}, 'distributionChecked'));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
  distributionOnExpand: distributionOnExpand,
  distributionOnChecked: distributionOnChecked
};

const DistributionDialogContainer = connect(mapStateToProps, actionCreators)(DistributionDialog);
export default DistributionDialogContainer;

