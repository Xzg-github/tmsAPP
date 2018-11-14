import { connect } from 'react-redux';
import ModeOutputDesign from './ModeOutputDesign';
import {postOption, fetchJson, showSuccessMsg, showError} from '../../../common/common';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';

const prefix = ['config', 'modeOutputDesign'];
const action = new Action(prefix);
const URL_CONFIG = '/api/config/mode_output_design/config';
const URL_GET_MODE_TREE = '/api/config/mode_output_design/getModeTree';
const URL_GET_DATA_SET = '/api/config/mode_output_design/getDataSet';
const URL_ADD_DATA = '/api/config/mode_output_design/addData';
const URL_SAVE_DATA = '/api/config/mode_output_design/saveData';
const URL_DEL_DATA = '/api/config/mode_output_design/delData';


const getSelfState = (rootState) => {     // 获取对应的state
  return getPathValue(rootState, prefix);
};

const treeDataHandle = (childrenKey, childrenData, tree) => {   // superTree数据处理
  childrenKey.forEach((key) => {
    childrenData.forEach((obj) => {
      if (`${obj.value}-${obj.type}` === `${key}`) {
        tree[`${key}`] = {};
        tree[`${key}`].key = `${obj.value}-${obj.type}`;
        tree[`${key}`].title = obj.title;
        tree[`${key}`].data = {id: obj.value, type: obj.type};
        let children = [];
        if (obj.children) {
          obj.children.forEach((child) => {
            children.push(`${child.value}-${child.type}`);
          });
        }
        tree[`${key}`].children = children;
        treeDataHandle(children, obj.children, tree);
      }
    })
  })
}

const initActionCreator = () => async (dispatch) => {    // 初始化state
  dispatch(action.assign({status: 'loading'}));
  const config = await fetchJson(URL_CONFIG);
  if (config.returnCode === 0) {
    let modeTree = await fetchJson(URL_GET_MODE_TREE);
    if (modeTree.returnCode === 0) {
      let modeListTree = {root: 'top', top: { key: 'top', children: [`${modeTree.result.value}-${modeTree.result.type}`]}};
      treeDataHandle([`${modeTree.result.value}-${modeTree.result.type}`], [modeTree.result], modeListTree);
      dispatch(action.assign({status: 'page', ...config.result, modeListTree: modeListTree}))
    } else {
      dispatch(action.assign({status: 'retry'}));
    }
  } else {
    dispatch(action.assign({status: 'retry'}));
  }
};

const getDataSetCreator = (obj) => async (dispatch, getState) => {    // 获取dataSet数据
  const state = getSelfState(getState());
  const dataSet = await fetchJson(URL_GET_DATA_SET, postOption(obj.data));
  if (dataSet.returnCode === 0) {
    const dataSource = dataSet.result.dataSource;
    const baseInfo = dataSet.result.baseInfo;
    const dataContent = dataSet.result.dataContent;
    let dataSourceTree = {root: 'top', top: { key: 'top', children: [`${dataSource.value}-${dataSource.type}`]}};
    treeDataHandle([`${dataSource.value}-${dataSource.type}`], [dataSource], dataSourceTree);
    dispatch(action.assign({...state, baseInfo: baseInfo, dataSourceTree: dataSourceTree,dataContent}));
  } else {
    dispatch(action.assign({...state, baseInfo: {}, dataSourceTree: {},dataContent:''}));
  }
}

const baseInfoCreator = (value, key) => (dispatch, getState) =>{
  const state = getSelfState(getState());
  const baseInfo = state.baseInfo;
  dispatch(action.assign({...state, baseInfo: { ...baseInfo, [key]: value}}));
}

const expandCreator = (key, obj) => (dispatch, getState) => {
  const state = getSelfState(getState());
  dispatch(action.assign({...state, [key]: {...state[key], ...obj}}));
}

const addDataCreator = () => async (dispatch, getState) =>{
  const state = getSelfState(getState());
  const addResult = await fetchJson(URL_ADD_DATA, postOption(state.baseInfo));
  if(addResult.returnCode === 0) {
    let modeTree = await fetchJson(URL_GET_MODE_TREE);
    if (modeTree.returnCode === 0) {
      let modeListTree = {root: 'top', top: { key: 'top', children: [`${modeTree.result.value}-${modeTree.result.type}`]}};
      treeDataHandle([`${modeTree.result.value}-${modeTree.result.type}`], [modeTree.result], modeListTree);
      dispatch(action.assign({...state, modeListTree: modeListTree}));
      showSuccessMsg('添加成功');
    }
  }
}

const saveDataCreator = () => async (dispatch, getState) =>{
  const state = getSelfState(getState());
  if (!state.baseInfo.reportName) {
    showError('模板名称不能为空');
    return;
  } else if (!state.baseInfo.outputType) {
    showError('输出格式不能为空');
    return;
  }
  const saveResult = await fetchJson(URL_SAVE_DATA, postOption(state.baseInfo));
  if(saveResult.returnCode === 0) {
    let modeTree = await fetchJson(URL_GET_MODE_TREE);
    if (modeTree.returnCode === 0) {
      let modeListTree = {root: 'top', top: { key: 'top', children: [`${modeTree.result.value}-${modeTree.result.type}`]}};
      treeDataHandle([`${modeTree.result.value}-${modeTree.result.type}`], [modeTree.result], modeListTree);
      dispatch(action.assign({...state, modeListTree: modeListTree}));
      showSuccessMsg('保存成功');
    }
  }
}

const delDataCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const delResult = await fetchJson(URL_DEL_DATA, postOption(state.baseInfo));
  if(delResult.returnCode === 0) {
    let modeTree = await fetchJson(URL_GET_MODE_TREE);
    if (modeTree.returnCode === 0) {
      let modeListTree = {root: 'top', top: { key: 'top', children: [`${modeTree.result.value}-${modeTree.result.type}`]}};
      treeDataHandle([`${modeTree.result.value}-${modeTree.result.type}`], [modeTree.result], modeListTree);
      dispatch(action.assign({...state, modeListTree: modeListTree, dataSourceTree: {}, dataSourceExpand:{}, baseInfo: {}}))
      showSuccessMsg('删除成功');
    }
  }
}

const tabChangeActionCreator = (key) => {
  return action.assign({activeKey: key});
};


const mapStateToProps = (state) => {     // 返回state
  return getSelfState(state);
};

const actionCreators = {   // 返回action
  onInit: initActionCreator,
  onGetDataSet: getDataSetCreator,
  onBaseInfo: baseInfoCreator,
  onAddData: addDataCreator,
  onSaveData: saveDataCreator,
  onDelData: delDataCreator,
  onExpand: expandCreator,
  onTabChange: tabChangeActionCreator,
};
const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(ModeOutputDesign));
export default Container;
