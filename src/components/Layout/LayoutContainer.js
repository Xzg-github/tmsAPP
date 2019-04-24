import React from 'react';
import { connect } from 'react-redux';
import {Action} from '../../action-reducer/action';
import {getPathValue} from '../../action-reducer/helper';
import helper from '../../common/common';
import Layout from './Layout';
import {EnhanceLoading} from '../Enhance';
import Link, {jump} from '../Link';
import getWsClient from '../../standard-business/wsClient';
import {notification} from 'antd';
import showPerson from './Person';
import showMode from './Mode';
import showPassword from '../../routes/password/modify/ModifyContainer';

const action = new Action(['layout']);
const PRIVILEGE_URL = '/api/permission/privilege';
const REVOKE_URL = '/api/login/revoke';
const TABLE_SETTING_URL = '/api/permission/table_cols_setting';
const URL_UNREAD = '/api/message/business/msg_unread';

//获取用户表格列设置信息
const getTableColsConfig = async () => {
  let setting = {};
  const {returnCode, result} = await helper.fetchJson(TABLE_SETTING_URL);
  if (returnCode === 0) {
    setting = result;
  }
  return setting;
};

const msgConfig = [
  {title: '系统消息', url: '/message/msg_system'},
  {title: '订单消息', url: '/message/msg_order'},
  {title: '派单消息', url: '/message/msg_dispatch'},
  {title: '跟踪消息', url: '/message/msg_track'},
  {title: '异常消息', url: '/message/msg_abnormal'},
];

const showGlobalMessage = (type=0, message) => {
  const config = msgConfig[type];
  const key = new Date().getTime();
  notification.open({
    key,
    message: config.title,
    description: <Link to={config.url} onClick={() => notification.close(key)}>{message}</Link>,
    duration: 10,
    placement: 'bottomRight',
    style: {
    whiteSpace: 'pre'
  }
});
};

// 建立WS连接
const connectWsServer = () => {
  const wsClient = getWsClient();
  wsClient.onMessage('global', ({body}) => {
    showGlobalMessage(body.type, body.content);
  });
};

// 查询未读消息数量
const getUreadCount = async () => {
  const unreadList = helper.getJsonResult(await helper.fetchJson(URL_UNREAD));
  return unreadList.reduce((count,item)=>(count += Number(item.unRead)),0);
};

const getShortcutSidebars = ({sidebars, tableColsSetting={}, privilege={}}) => {
  let [...shortcut] = sidebars.shortcut;
  if (tableColsSetting.shortcut && tableColsSetting.shortcut.shortcuts) {
    const shortcuts = tableColsSetting.shortcut.shortcuts.filter(item => privilege[item.key] === true);
    shortcut = shortcuts.concat(shortcut);
  }
  return shortcut;
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const {returnCode, returnMsg, result} = await helper.fetchJson(PRIVILEGE_URL);
  if (returnCode === 0) {
    const tableColsSetting = await getTableColsConfig();
    const payload = Object.assign(result, {tableColsSetting, status: 'page'});
    payload.messageCount = await getUreadCount();
    payload.sidebars && payload.sidebars.shortcut && (payload.sidebars.shortcut = getShortcutSidebars(payload)); //初始化快捷菜单的侧边栏数据
    const index = payload.navigation.findIndex(item => item.key === 'shortcut');
    if (index !== -1 && payload.sidebars.shortcut) {
      payload.navigation[index].href = payload.sidebars.shortcut[0].href;
    }
    dispatch(action.create(payload));
    // 获取到权限后，再次引发路由，以保证没有该页面的权限时显示404的页面
    if (window.location.pathname === '/') {
      jump(payload.navigation[0].href);
    } else {
      jump(window.location.pathname + window.location.search);
    }
    connectWsServer();
  } else {
    if (returnCode !== 9998) {
      dispatch(action.assign({status: 'retry'}));
      helper.showError(returnMsg);
    } else {
      window.location.href = '/login';
    }
  }
};

function hasHref(items, href) {
  return items.some(item => {
    if (item.children) {
      return hasHref(item.children, href);
    } else {
      return item.href === href;
    }
  });
}

const canOpen = (nav1, nav2) => {
  if (global.isServer || !global.store) {
    return true;
  } else {
    const state = global.store.getState();
    if (state.layout.status !== 'page') {
      return true;
    } else {
      const path = ['layout', 'sidebars', nav1];
      const sidebar = getPathValue(state, path) || [];
      const href = `/${nav1}/${nav2}`;
      return hasHref(sidebar, href);
    }
  }
};

const openChangeActionCreator = (key, openKeys) => {
  return action.assign({[key]: openKeys}, 'openKeys');
};

const menuClickActionCreator = (key) => async () => {
  if (key === 'revoke') {
    await helper.fetchJson(`${REVOKE_URL}/${helper.getUsername()}`, 'put');
    window.location.href = '/login';
  } else if (key === 'modify') {
    showPassword()
  } else if (key === 'person') {
    showPerson();
  } else if (key === 'mode') {
    showMode();
  }
};

const mapStateToProps = (state) => {
  return state.layout;
};

const actionCreators = {
  onInit: initActionCreator,
  onOpenChange: openChangeActionCreator,
  onMenuClick: menuClickActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(Layout));
export default Container;
export {canOpen};
