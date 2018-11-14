import { connect } from 'react-redux';
import Area from './Area';
import {EnhanceLoading} from '../../../components/Enhance';
import {fetchJson, showError, postOption} from '../../../common/common';
import {fetchDictionary, setDictionary} from '../../../common/dictionary';
import {dealActions} from '../../../common/check';
import Tree from '../../../common/tree';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildDistrictState} from './DistrictContainer';
import {buildSiteState} from './SiteContainer';
import {buildContactState} from './ContactContainer';

const STATE_PATH = ['basic', 'area'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/basic/area/config';
const URL_TREE_LIST = '/api/basic/area/tree_list';
const URL_DISTRICT_LIST = '/api/basic/area/district_list';
const URL_SITE_LIST = '/api/basic/area/site_list';
const URL_CONTACT_LIST = '/api/basic/area/contact_list';


const getSelfState = (state) => {
  return getPathValue(state, STATE_PATH);
};

const convertToTree = (data, pid) => {
  let result = [], temp;
  for (let i = 0; i < data.length; i++) {
    if(!data[i].pid && data[i].id.districtType !== '1') {
      continue;
    }
    if ((!pid && !data[i].pid) || (data[i].pid && data[i].pid.value === pid)) {
      let obj = {title: data[i].id.title, value: {guid: data[i].id.value, districtType: data[i].id.districtType}};
      temp = convertToTree(data, data[i].id.value);
      if (temp.length > 0) {
        obj.children = temp;
      }
      result.push(obj);
    }
  }
  return result;
};

const buildState = (config, treeData=[], districtItems=[]) => {
  const {districtConfig, siteConfig, contactConfig, districtEditConfig, siteEditConfig, contactEditConfig, treeConfig} = config;
  const tree = Tree.createWithInsertRoot(treeData, config.root, {guid: 'root', districtType:0});
  const key = Tree.getRootKey(tree);
  const tabs = [
    {key: 'district', title: districtConfig.title, type: 'district'},
    {key: 'site', title: siteConfig.title, type: 'TransportPlace'},
    {key: 'contact', title: contactConfig.title, type: 'Location'}
  ];
  return {
    tabs,
    district:buildDistrictState(districtConfig, districtEditConfig, districtItems),
    site:buildSiteState(siteConfig, siteEditConfig, []),
    contact:buildContactState(contactConfig, contactEditConfig, []),
    activeKey: 'district',
    tree,
    select: key,
    treeConfig,
    placeholder: '地址名称'
  };
};

const getDicList = ({districtEditConfig, siteEditConfig, contactEditConfig}) => {
  let dicList = [];
  const getDic = (obj) => {
    if (obj.dictionary) {
      dicList.push(obj.dictionary);
    } else if (obj.from === 'dictionary' && obj.position && !obj.options) {
      dicList.push(obj.position);
    }
  };
  districtEditConfig.tableCols.map(getDic);
  siteEditConfig.controls.map(getDic);
  contactEditConfig.controls.map(getDic);
  return dicList;
};

const setDic = ({siteConfig, contactConfig, districtEditConfig, siteEditConfig, contactEditConfig}, dic) => {
  setDictionary(siteConfig.tableCols, dic);
  setDictionary(contactConfig.tableCols, dic);
  setDictionary(districtEditConfig.tableCols, dic);
  setDictionary(siteEditConfig.tableCols, dic);
  setDictionary(siteEditConfig.controls, dic);
  setDictionary(contactEditConfig.tableCols, dic);
  setDictionary(contactEditConfig.controls, dic);
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  let data, config, treeData, districtItems;

  data = await fetchJson(URL_CONFIG);
  if (data.returnCode !== 0) {
    showError('获取界面失败');
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  config = data.result;
  config.districtConfig.buttons = dealActions(config.districtConfig.buttons, 'area');
  config.siteConfig.buttons = dealActions(config.siteConfig.buttons, 'area');
  config.contactConfig.buttons = dealActions(config.contactConfig.buttons, 'area');
  const dicList = getDicList(config);
  data = await fetchDictionary(dicList);
  if(data.returnCode !==0) {
    showError(data.returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  setDic(config, data.result);

  data = await fetchJson(URL_TREE_LIST);
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  treeData = convertToTree(data.result);

  data = await fetchJson(`${URL_DISTRICT_LIST}/root`);
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  districtItems = data.result;

  const allItems = [];
  const otherState = {
    status: 'page',
    allItems,
    indexTableItems: allItems,
    searchData: {nameType: 'district'}
  };
  const payload = Object.assign(buildState(config, treeData, districtItems), otherState);
  dispatch(action.create(payload));
};

const inputChangeActionCreator = (value) => {
  return action.assign({inputValue: value});
};

// 在树中搜索行政区地址(模糊搜索)
const treeSearchActionCreator = () => (dispatch, getState) => {
  const {tree, inputValue} = getSelfState(getState());
  if (inputValue) {
    dispatch(action.assign({searchValue: inputValue, expand: Tree.search(tree, inputValue)}));
  } else {
    dispatch(action.assign({searchValue: inputValue}));
  }
};

const tabChangeActionCreator = (key) => {
  return action.assign({activeKey: key});
};

const expandActionCreator = (key, expand) => {
  return action.assign({[key]: expand}, 'expand');
};

//处理地点类型字段，来自字典多选
const dealPlaceType = async (result=[]) => {
  const dic = await fetchDictionary(['place_type']);
  if (dic.returnCode !== 0) {
    return result.map(item => ({...item.baseInfo, placeType: item.placeType.join(',')}));
  }
  return result.map(({baseInfo, placeType=[]}) => {
    const newType = placeType.map(item => {
      const index = dic.result.place_type.findIndex(dicItem => dicItem.value === item);
      return index >= 0 ? dic.result.place_type[index].title : item;
    });
    return {...baseInfo, placeType: newType.join(',')};
  });
};

const selectActionCreator = (key) => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const guid = state.tree[key].value.guid;
  let data, tableItems;
  data = await fetchJson(`${URL_DISTRICT_LIST}/${guid}`);
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  tableItems = data.result;
  dispatch(action.assign({tableItems}, 'district'));

  data = await fetchJson(`${URL_SITE_LIST}/${guid}`);
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  tableItems = await dealPlaceType(data.result);
  dispatch(action.assign({tableItems}, 'site'));

  data = await fetchJson(`${URL_CONTACT_LIST}/${guid}`);
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  tableItems = data.result;
  dispatch(action.assign({tableItems}, 'contact'));

  dispatch(action.assign({select: key}));
};

// 新增、编辑行政区后更新树
const updateTree = (edit, district, dispatch, getState) => {
  const state = getSelfState(getState());
  if (!edit) {
    const tree = Tree.addNode(state.tree, district.districtName, district, state.select);
    dispatch(action.assign({tree}));
  } else {
    const key = Tree.findKeyByGuid(state.tree, district.guid);
    dispatch(action.assign({title: district.districtName, value:district}, ['tree', key]));
  }
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

const linkActionCreator = (key, rowIndex, item) => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const activeKey = state.tabs.filter(tab => tab.type === state.searchType).pop().key;
  dispatch(action.assign({activeKey}));
  const select = Tree.findKeyByGuid(state.tree, item.districtId.value);
  return selectActionCreator(select)(dispatch, getState);
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onInputChange: inputChangeActionCreator,
  onTreeSearch: treeSearchActionCreator,
  onTabChange: tabChangeActionCreator,
  onExpand: expandActionCreator,
  onSelect: selectActionCreator,
  onIndexTabChange: indexTabChangeActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onLink: linkActionCreator
};

const AreaContainer = connect(mapStateToProps, actionCreators)(EnhanceLoading(Area));

export default AreaContainer;
export {updateTree, initActionCreator};
