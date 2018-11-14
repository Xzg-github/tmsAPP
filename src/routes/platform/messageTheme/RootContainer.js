import React from 'react';
import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import helper from '../../../common/common';
import createTabPage from '../../../standard-business/createTabPage';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import MessageThemeContainer from './MessageThemeContainer'

const STATE_PATH = ['platform', 'messageTheme'];
const action = new Action(STATE_PATH);

const URL_CONFIG = '/api/platform/messageTheme/config';
const URL_LIST = '/api/platform/messageTheme/list';

const getSelfState = ( rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

// 为OrderPage组件构建状态
const buildOrderPageState = (result =[], config, other={}) => {
  return {
    ...other,
    ...config,
    tableItems: result,
    searchData: {}
  };
};

const initActionCreator = () => async(dispatch,getState) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const config =  helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    const list = helper.getJsonResult(await helper.fetchJson(URL_LIST,'post'));

    const {index, edit} = config;

    dispatch(action.assign({
      status: 'page',
      index: buildOrderPageState(list, index, {tabKey: 'index'}),
      activeKey: 'index',
      tabs: [{key: 'index', title: '消息类型', close: false}],
      editConfig:edit
    }));

  }catch (e){
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const tabChangeActionCreator = (key) => {
  return action.assign({activeKey: key});
};

const tabCloseActionCreator = (key) => (dispatch, getState) => {
  const {activeKey, tabs} = getSelfState(getState());
  const newTabs = tabs.filter(tab => tab.key !== key);
  if (activeKey === key) {
    let index = tabs.findIndex(tab => tab.key === key);
    (newTabs.length === index) && (index--);
    dispatch(action.assign({tabs: newTabs, [activeKey]: undefined, activeKey: newTabs[index].key}));
  } else {
    dispatch(action.assign({tabs: newTabs, [key]: undefined}));
  }
};



const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator,
  onTabClose: tabCloseActionCreator
};


const mapStateToProps = (state) => {
  return getSelfState(state);
};

const getComponent = (activeKey) => {
  if (activeKey === 'index') {
    return MessageThemeContainer;
  }
};

const RootContainer = connect(mapStateToProps, actionCreators)(EnhanceLoading(createTabPage(getComponent)));
export default RootContainer;
export {buildOrderPageState}

