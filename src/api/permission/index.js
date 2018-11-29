import express from 'express';
import {NAV_ITEMS, SIDEBARS} from './config';
import {fetchJsonByNode, postOption} from '../../common/common';
import {host, privilege} from '../globalConfig';
const service = `${host}/auth-center`;
const api = express.Router();

const TYPE_PAGE = 2;
const TYPE_ACTION = 3;
const NAV_ITEMS_NEW = buildItems(NAV_ITEMS);
const SIDEBARS_NEW = buildSidebars(SIDEBARS);

function buildItems(items) {
  return items.map(item => {
    item.unique = item.prefix ? `${item.prefix}_${item.key}` : item.key;
    item.children && (item.children = buildItems(item.children));
    return item;
  });
}

function buildSidebars(sidebars) {
  return Object.keys(sidebars).reduce((result, key) => {
    result[key] = buildItems(sidebars[key]);
    return result;
  }, {});
}

function findValidKey(items) {
  for (const item of items) {
    if (!item.children) {
      return item.key;
    } else if (item.children.length > 0) {
      return item.children[0].key;
    }
  }
}

const getNavItems = (navigation, sidebars, privilege) => {
  return navigation.filter(({unique}) => !!privilege[unique]).map(({key, unique, icon}) => {
    const last = findValidKey(sidebars[unique]);
    const href = last ? `/${key}/${last}` : '/';
    const title = privilege[unique];
    return {key, title, href, icon};
  });
};

const getSidebarItem = (prefix, privilege) => ({key, unique, children}) => {
  const item = {key, title: privilege[unique], href: `/${prefix}/${key}`};
  if (children) {
    item.isFolder = true;
    item.children = getSidebar(children, prefix, privilege);
  }
  return item;
};

const getSidebar = (items, prefix, privilege) => {
  return items.filter(item => privilege[item.unique]).map(getSidebarItem(prefix, privilege));
};

const getSidebars = (navigation, sidebars, privilege) => {
  return Object.keys(sidebars).reduce((result, key) => {
    if (privilege[key]) {
      const index = navigation.findIndex(nav => nav.unique === key);
      if (index >= 0) {
        const prefix = navigation[index].key;
        result[key] = getSidebar(sidebars[key], prefix, privilege);
      }
    }
    return result;
  }, {});
};

const getOpenKeys = (sidebars) => {
  return Object.keys(sidebars).reduce((result, key) => {
    const sidebar = sidebars[key];
    if (sidebar.length > 0 && sidebar[0].children) {
      result[key] = [sidebar[0].key];
    }
    return result;
  }, {});
};

const toBool = (obj) => {
  return Object.keys(obj).reduce((result, key) => {
    result[key] = !!obj[key];
    return result;
  }, {});
};

const calculate = (privilege, actions={}) => {
  const sidebars = getSidebars(NAV_ITEMS_NEW, SIDEBARS_NEW, privilege);
  const navigation = getNavItems(NAV_ITEMS_NEW, sidebars, privilege);
  const openKeys = getOpenKeys(sidebars);
  return {actions, sidebars, navigation, openKeys, privilege: toBool(privilege)};
};

function flattenTree(privilege, result={}) {
  return privilege.reduce((result, {data, title, children}) => {
    result[data.resourceKey] = title;
    if (children && data.resourceType !== TYPE_PAGE) {
      flattenTree(children, result);
    }
    return result;
  }, result);
}

const setActions = (key, children, result) => {
  const actions = children.reduce((result, {data}) => {
    if (data.resourceType === TYPE_ACTION) {
      result.push(data.resourceKey);
    }
    return result;
  }, []);
  (actions.length !== 0) && (result[key] = actions);
};

function getActions(privilege, result={}) {
  return privilege.reduce((result, {data, children}) => {
    if (children) {
      if (data.resourceType === TYPE_PAGE) {
        setActions(data.resourceKey, children, result);
      } else {
        getActions(children, result);
      }
    }
    return result;
  }, result);
}

const convert = (json) => {
  if (json.returnCode === 0) {
    if (Array.isArray(json.result)) {
      json.result = calculate(flattenTree(json.result), getActions(json.result));
    } else {
      json.result = calculate(json.result);
    }
  }
  return json;
};

// 用户权限
api.get( '/privilege', async (req, res) => {
  try {
    if (privilege) {  //privilege
      const url = `${service}/authc/account_resource`;
      res.send(convert(await fetchJsonByNode(req, url)));
    } else {
      const module = await require('./data');
      res.send(convert({...module.default}));
    }
  } catch (e) {
    console.log(e);
    res.send({returnCode: -1, returnMsg: '数据有误'});
  }
});

//获取用户表格列显示设置
api.get( '/table_cols_setting', async (req, res) => {
  const url = `${host}/report_service/config/get_columns_config`;
  res.send(await fetchJsonByNode(req, url));
});

//更新用户列表列显示
api.post( '/table_cols_setting', async (req, res) => {
  const url = `${host}/report_service/config/set_columns_config`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//获取自定义导出表格id (已知数据源)
api.post( '/custom_export_table', async (req, res) => {
  const url = `${host}/integration_service/load/excel_datasource`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 导出数据到excel (查询数据源)
api.post('/common_export', async (req, res) => {
  const url = `${host}/integration_service/load/excel`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
