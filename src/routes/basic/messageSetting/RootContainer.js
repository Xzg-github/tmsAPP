import React from 'react';
import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import helper from '../../../common/common';
import createTabPage from '../../../standard-business/createTabPage';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search} from '../../../common/search';
import {buildOrderPageState} from '../../../common/state';

import MessageSettingContainer from './MessageSettingContainer'


const STATE_PATH = ['basic', 'messageSetting'];
const action = new Action(STATE_PATH);

const URL_CONFIG = '/api/basic/messageSetting/config';
const URL_LIST = '/api/basic/messageSetting/list';//列表
const URL_THEME = '/api/platform/messageTheme/list';//消息标题下拉

const getSelfState = ( rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async(dispatch,getState) => {
  try {
    const options = [];
    dispatch(action.assign({status: 'loading'}));
    const config =  helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    const {index, edit} = config;

    const list = helper.getJsonResult(await search(URL_LIST, 0, index.pageSize, {}));
    list.data.length > 0 && list.data.forEach(item => {
      let userId = []
      item.userList.forEach(user => {
        if(user.userId && user.userId.title){
          userId.push(user.userId.title)
        }
      })
      item.userId = userId

    });

    const data = helper.getJsonResult(await helper.fetchJson(URL_THEME,'post'));

    data.length > 0 && data.forEach(item => {
      options.push({
        title:item.id,
        value:item.id,
      })
    });

    edit.controls.map(item => item.key == 'messageTitleConfigId' ? item.options = options : null);
    index.filters.map(item => item.key == 'messageTitleConfigId' ? item.options = options : null);
    edit.theMe = data;
    dispatch(action.assign({
      status: 'page',
      index: buildOrderPageState(list, index, {tabKey: 'index'}),
      activeKey: 'index',
      tabs: [{key: 'index', title: '消息设置', close: false}],
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
    return MessageSettingContainer;
  }
};

const RootContainer = connect(mapStateToProps, actionCreators)(EnhanceLoading(createTabPage(getComponent)));
export default RootContainer;
export {buildOrderPageState}

