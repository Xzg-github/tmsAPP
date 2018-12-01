import { connect } from 'react-redux';
import Area from './Area';
import {EnhanceLoading} from '../../../components/Enhance';
import {fetchJson, showError, postOption} from '../../../common/common';
import {fetchDictionary, setDictionary, getDictionaryNames} from '../../../common/dictionary';
import {dealActions} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildDistrictState} from './DistrictContainer';

const STATE_PATH = ['basic', 'area'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/basic/area/config';
const URL_DISTRICT_LIST = '/api/basic/area/district_list';


const getSelfState = (state) => {
  return getPathValue(state, STATE_PATH);
};

const buildState = (config, districtItems=[]) => {
  const {districtConfig, districtEditConfig, treeConfig} = config;
  const tabs = [
    {key: 'district', title: districtConfig.title, type: 'district'},
  ];
  const treeData = [
    {key: 'root', title: '所有地址', children: districtItems.map(item => {
      return {key: item.guid, title: item.districtName};
      })}
  ];
  return {
    tabs,
    district:buildDistrictState(districtConfig, districtEditConfig, districtItems),
    activeKey: 'district',
    treeConfig,
    placeholder: '地址名称',
    treeData,
    select: 'root',
    expand: {root: true},
  };
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  let data, config, districtItems;

  data = await fetchJson(URL_CONFIG);
  if (data.returnCode !== 0) {
    showError('获取界面失败');
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  config = data.result;
  config.districtConfig.buttons = dealActions(config.districtConfig.buttons, 'area');
  data = await fetchDictionary(getDictionaryNames(config.districtEditConfig.tableCols));
  if(data.returnCode !==0) {
    showError(data.returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  setDictionary(config.districtEditConfig.tableCols, data.result);

  data = await fetchJson(`${URL_DISTRICT_LIST}/root`);
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  districtItems = data.result;

  const otherState = {
    status: 'page',
    indexTableItems: [],
    searchData: {nameType: 'district'}
  };
  const payload = Object.assign(buildState(config, districtItems), otherState);
  dispatch(action.create(payload));
};

const inputChangeActionCreator = (value) => {
  return action.assign({inputValue: value});
};

const tabChangeActionCreator = (key) => {
  return action.assign({activeKey: key});
};

const expandActionCreator = (expandedKeys, {expanded, node}) => {
  return action.assign({[node.props.eventKey]: expanded}, 'expand');
};

const selectActionCreator = (selectedKeys) => async (dispatch) => {
  if (selectedKeys.length < 1) return;
  const guid = selectedKeys[0];
  let data = await fetchJson(`${URL_DISTRICT_LIST}/${guid}`);
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  dispatch(action.assign({tableItems: data.result}, 'district'));
  dispatch(action.assign({select: guid}));
};

const loadDataActionCreator = (treeNode) => async (dispatch, getState) => {
  if (treeNode.props.children) return;
  const state = getSelfState(getState());
  const guid = treeNode.props.eventKey;
  let data = await fetchJson(`${URL_DISTRICT_LIST}/${guid}`);
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  treeNode.props.dataRef.children = data.result.map(item => ({key: item.guid, title: item.districtName, isLeaf: Number(item.districtType) === 6}));
  dispatch(action.assign({tableItems: data.result}, 'district'));
  dispatch(action.assign({select: guid, treeData: [...state.treeData]}));
};

// 新增、编辑行政区后更新树
const updateTree = async (dispatch, getState) => {
  let data = await fetchJson(`${URL_DISTRICT_LIST}/root`);
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  const treeData = [
    {key: 'root', title: '所有地址', children: data.result.map(item => {
        return {key: item.guid, title: item.districtName};
      })}
  ];
  dispatch(action.assign({treeData, select:'root', expand: {root: true}}));
};

const indexTabChangeActionCreator = (indexActiveKey) => {
  return action.assign({indexActiveKey});
};

const changeActionCreator = (key, value) => {
  if (key === 'nameType' && !value) return {type: 'unknown'};
  return action.assign({[key]: value}, 'searchData');
};

const searchActionCreator = async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  dispatch(action.assign({searchType: searchData.nameType}));
  const {returnCode, result, returnMsg} = await fetchJson('/api/basic/area/search', postOption(searchData));
  if (returnCode !== 0) {
    return showError(returnMsg);
  }
  dispatch(action.assign({indexTableItems: result}));
};

const resetActionCreator = (dispatch) => {
  dispatch(action.assign({searchData: {nameType: 'district'}}));
};

const buttonActions = {
  search: searchActionCreator,
  reset: resetActionCreator
};

const clickActionCreator = (key) => {
  if (buttonActions.hasOwnProperty(key)) {
    return buttonActions[key];
  } else {
    showError(`unknown key:${key}`);
    return {type: 'unknown'};
  }
};

const linkActionCreator = (key, rowIndex, item) => async (dispatch) => {
  const guid = item.districtId.value;
  let data = await fetchJson(`${URL_DISTRICT_LIST}/${guid}`);
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  dispatch(action.assign({tableItems: data.result}, 'district'));
  dispatch(action.assign({select: guid}));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onInputChange: inputChangeActionCreator,
  onTabChange: tabChangeActionCreator,
  onExpand: expandActionCreator,
  onSelect: selectActionCreator,
  onLoadData: loadDataActionCreator,
  onIndexTabChange: indexTabChangeActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onLink: linkActionCreator
};

const AreaContainer = connect(mapStateToProps, actionCreators)(EnhanceLoading(Area));

export default AreaContainer;
export {updateTree};
