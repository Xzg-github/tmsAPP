import fetch from '../core/fetch';
import {getPathValue} from '../action-reducer/helper';
import message from 'antd/lib/message';
import { Action } from '../action-reducer/action';
import upload from '../standard-business/upload';

/**
 * 功能：设置fetch的选项
 */
const postOption = (body, method = 'post') => {
  return {
    method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  }
};

/**
 * 功能：发送请求，并解析json
 */
const fetchJson = async (url, option, cookie=true, jump=true) => {
  if (cookie) {
    if (typeof option === 'undefined') {
      option = {credentials: 'include'};
    } else if (typeof option === 'string') {
      option = {method: option, credentials: 'include'};
    } else if (!option.credentials) {
      Object.assign(option, {credentials: 'include'});
    }
  } else {
    if (typeof option === 'string') {
      option = {method: option};
    }
  }

  try {
    const res = await fetch(url, option);
    if (!res.ok) {
      return {returnCode: res.status, returnMsg: `${res.status} - ${res.statusText}`};
    } else {
      const json = await res.json();
      if (json.returnCode !== 0 && json.errorCode) {
        json.returnCode = Number(json.errorCode) || 10001;
      }
      if (jump && (json.returnCode === 9998)) {
        window.location.href = '/login';
      }
      return json;
    }
  } catch (e) {
    return {returnCode: 10000, returnMsg: '无法请求资源'};
  }
};

// node端获取json数据
const fetchJsonByNode = (req, url, option) => {
  const {token} = req.cookies;
  const cookie = {'Cookie': `token=${token}`};
  if (typeof option === 'string') {
    option = {method: option, headers: cookie};
  } else if (typeof option === 'undefined') {
    option = {headers: cookie};
  } else if (option.headers) {
    Object.assign(option.headers, cookie);
  } else {
    Object.assign(option, {headers: cookie});
  }
  return fetchJson(url, option, false, false);
};

/**
 * 功能：(批量)获取标准的下拉列表
 * 返回值：
 *  当传了多个参数时，则每个参数必须为字符串，返回值中的result是对象，对象的key则是传递的type
 *  当只传了一个参数时，且类型为数组，返回值中的result对象，对象的key则是传递的type
 *  当只传了一个参数时，且类型是字符串，返回值中的result是数组
 */
const fetchSelect = (...types) => {
  const url = '/api/standard/select';
  if (types.length > 1) {
    return fetchJson(url, postOption(types));
  } else if (types.length === 1) {
    if (Array.isArray(types[0])) {
      return fetchJson(url, postOption(types[0]));
    } else {
      return fetchJson(`${url}/${types[0]}`);
    }
  }
};

// 模糊搜索
const fuzzySearch = (type, filter='') => {
  const url = `/api/standard/search/${type}?filter=${filter}`;
  return fetchJson(url);
};

// 根据option中的searchType或searchUrl进行模糊搜索
const fuzzySearchEx = (filter, option) => {
  if (option.hasOwnProperty('searchType')) {
    return fuzzySearch(option.searchType, filter);
  } else if (option.hasOwnProperty('searchUrl')) {
    return fetchJson(`${option.searchUrl}?filter=${filter}`);
  } else {
    return {returnCode: -1, returnMsg: '无效参数'};
  }
};

/**
 * 功能：如果returnCode不为0，则抛出异常，否则取出result
 * 参数：从服务端获取的JSON格式数据
 */
const getJsonResult = (json) => {
  if (json.returnCode !== 0) {
    const error = new Error();
    error.message = json.returnMsg;
    error.code = json.returnCode;
    throw error;
  } else {
    return json.result;
  }
};

/**
 * 功能：从obj中提取出指定属性，并构造出一个新的对象
 *  obj：[必须]，对象
 *  keys：[必须]，字符串数组，用于指定需要提取的属性
 * 返回值：返回构造出的对象
 */
const getObject = (obj, keys) => {
  return keys.reduce((newObj, key) => {
    newObj[key] = obj[key];
    return newObj;
  }, {});
};

/**
 * 功能：从obj中取出不包含keys指定的属性，并组成一个新的子对象
 */
const getObjectExclude = (obj, keys) => {
  const inKeys = key => keys.some(k => k === key);
  return  Object.keys(obj).reduce((newObj, key) => {
    !inKeys(key) && (newObj[key] = obj[key]);
    return newObj;
  }, {});
};

/**
 * 功能：判断一个值是否为空(null,undefined和''属于空)
 */
const isEmpty = (value) => {
  const type = typeof value;
  if (type === 'number' || type === 'boolean') {
    return false;
  } else {
    return !value;
  }
};

/**
 * 功能：判断一个值是否为空(null,undefined,''和[]属于空)
 */
const isEmpty2 = (value) => {
  const type = typeof value;
  if (type === 'number' || type === 'boolean') {
    return false;
  } else if (Array.isArray(value)) {
    return !value.length;
  } else {
    return !value;
  }
};

/**
 * 功能：依据fields来验证value中指定属性(key)是否为空
 *  fields：[必须]，对象数组，每个对象用于描述value中的相应的属性是否为必填项(不能为空)
 *   对象中必须有key属性，以及可选的required属性，required为true表明指示的key为必填项
 *  value：[必须]，对象(key-value对)
 * 返回值：通过校验返回true，未通过返回false
 */
const validValue = (fields, value) => {
  return fields.every(({key, required}) => {
    return !required || !isEmpty2(value[key]);
  });
};

const validArray = (fields, array) => {
  return !array.some(item => !validValue(fields, item));
};

// 判断是否只选中了一个，如果选中多个或未选中一个，则返回-1；否则，返回选中的索引号
const findOnlyCheckedIndex = (items) => {
  const index = items.reduce((result, item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return index.length !== 1 ? -1 : index[0];
};

const toValidValue = (value) => {
  return [undefined, null, NaN].includes(value) ? '' : value;
};

const normalValue = (value) => {
  value = toValidValue(value);
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value;
    } else if (value.hasOwnProperty('value')) {
      return toValidValue(value.value);
    } else {
      return '';
    }
  } else {
    return value;
  }
};

/**
 * 提取出包含{value,title}中的value，用于传递给后端接口
 */
const convert = (value) => {
  return Object.keys(value).reduce((result, key) => {
    result[key] = normalValue(value[key]);
    return result;
  }, {});
};

// 判断指定的tab key是否存在
const isTabExist = (tabs, key) => {
  return tabs.some(tab => tab.key === key);
};

// 生成唯一的tab key
const genTabKey = (prefix, tabs) => {
  const defKey = `${prefix}_${tabs.length}`;
  let key = defKey;
  for (let i = 1; isTabExist(tabs, key); i++) {
    key = `${defKey}_${i}`;
  }
  return key;
};

const setOptions = (key, controls, options) => {
  const item = controls.find(control => control.key === key);
  item && (item.options = options);
};

/**
 * 功能：(不修改原数组) 交换对象数组的两列
 *  arr：[必须]，对象数组，每个对象必须存在key1和key2指定的属性
 *  key1,key2：[必须]，字符串，用于指定交换arr中的哪2个元素
 * 返回值：返回交换后的新数组
 */
const swapItems = ([...arr], key1, key2) => {
  const index1 = arr.findIndex(item => item.key == key1);
  const index2 = arr.findIndex(item => item.key == key2);
  const item = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = item;
  return arr;
};

const queryParams = (params) => {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
};

const fetchGetObj = async (url, params, method = 'get', req) => {
  url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(params);
  if (req) {
    return await fetchJsonByNode(req, url, method);
  } else {
    return await fetchJson(url, method);
  }
};

const showError = (msg) => {
  message.error(msg);
};

const showSuccessMsg = (msg) => {
  message.success(msg);
};

// 从store中获取指定页面(sign标示)的按钮权限(字符串数组)
const getActions = (sign, trimPrefix=false) => {
  if (!sign || !global.store) {
    return [];
  } else {
    const state = global.store.getState();
    const path = ['layout', 'actions', sign];
    const actions = getPathValue(state, path) || [];
    if (trimPrefix) {
      const prefix = `${sign}_`;
      return actions.map(str => str.replace(prefix, ''));
    } else {
      return actions;
    }
  }
};

// 获取指定页面(key标示)能够显示的按钮组(对象数组)
const getButtons = (buttons, key) => {
  const actions = getActions(key, true);
  if (actions.length) {
    return buttons.filter(button => actions.includes(button.key));
  } else {
    return [];
  }
};

/**
 * 功能：(不修改原数组参数) 初始化表格列显示配置
 *  cols：[必须]，对象数组，表格的tableCols配置参数
 *  code：[必须]，字符串，用于标识具体页面位置的表格配置
 * 返回值：返回初始化后的tableCols
 */
const initTableCols = (code, cols=[]) => {
  if (!code || !global.store) {
    return cols;
  } else {
    const state = global.store.getState();
    const path = ['layout', 'tableColsSetting', code];
    const config = getPathValue(state, path);
    if (!config) return cols;
    const {keysIndex=[], hideKeys=[], sortKeys=[], filterKeys=[]} = config;
    let newCols = cols.map(col => {
      let {...newCol} = col;
      newCol.hide = hideKeys.includes(col.key);
      newCol.filter = filterKeys.includes(col.key);
      const sortIndex = sortKeys.findIndex(item => col.key === item.key);
      if (sortIndex !== -1) {
        newCol.sorter = sortKeys[sortIndex].sorter;
      }
      return newCol;
    });
    const addCols = newCols.filter(col => !keysIndex.includes(col.key));
    let sortCols = [];
    keysIndex.map(key => {
      const colIndex = newCols.findIndex(col => col.key === key);
      colIndex !== -1 && sortCols.push(newCols[colIndex]);
    });
    return sortCols.concat(addCols);
  }
};

/**
 * 功能：(不修改原数组参数) 初始化查询条件配置
 *  filters：[必须]，对象数组，查询条件的filters配置参数
 *  code：[必须]，字符串，用于标识具体页面位置的查询条件配置
 * 返回值：返回初始化后的filters
 */
const initFilters = (code, filters=[]) => {
  if (!code || !global.store) {
    return filters;
  } else {
    const state = global.store.getState();
    const path = ['layout', 'tableColsSetting', code];
    const config = getPathValue(state, path) || {};
    const {filtersIndex=[]} = config;
    let [...newFilters] = filters;
    const addFilters = newFilters.filter(item => !filtersIndex.includes(item.key));
    let resFilters = [];
    filtersIndex.map(key => {
      const index = newFilters.findIndex(item => item.key === key);
      index !== -1 && resFilters.push(newFilters[index]);
    });
    return resFilters.concat(addFilters);
  }
};

const myToFixed = (value, precision=0, zero = false) => {
  value = Number(value).toFixed(precision);
  value = String(value);
  if (value.indexOf('.') >= 0) {
    value = value.replace(/(^(\s|0)*)|((\s|0)*$)/g, '');
    value = value.replace(/\.*$/g, '');
    if (value && value[0] === '.') {
      value = '0' + value;
    }
  } else {
    value = value.replace(/(^(\s|0)*)|(\s*$)/g, '');
  }
  return value || (zero ? '0' : '');
};

const formatTime = (val) => {
  if(!val) return '';
  const date = new Date(val);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const format = (value='') => {
    return value.toString().length > 1 ? value : "0" + value;
  };
  return year +'-'+ format(month) +'-'+ format(day);
};

const openWindowByPostRequest = (url, params) => {
  const temp_form = document.createElement("form");
  temp_form .action = url;
  temp_form .target = "_blank";
  temp_form .method = "post";
  temp_form .style.display = "none";
  for (let x in params) {
    let opt = document.createElement("textarea");
    opt.name = x;
    opt.value = params[x];
    temp_form .appendChild(opt);
  }
  document.body.appendChild(temp_form);
  temp_form .submit();
};

const deepCopy = (obj) => {
  let str, newObj = obj.constructor === Array ? [] : {};
  if (typeof obj !== 'object') {
    return;
  } else if (window.JSON) {
    str = JSON.stringify(obj),
      newObj = JSON.parse(str);
  } else {
    for (let i in obj) {
      newObj[i] = typeof obj[i] === 'object' ? deepCopy(obj[i]) : obj[i];
    }
  }
  return newObj;
};

// 如果text超过最大长度maxLength，剩余部分用省略号表示
const omit = (text, maxLength = 6) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// 下载文件
const download = (url, name) => {
  if (url.substr(0, 4) === 'http') {
    window.open(url);
  } else {
    const node = document.createElement('a');
    node.href = url;
    node.download = name;
    node.target = '_blank';
    if (node.getAttribute('download')) {
      document.body.appendChild(node);
      node.click();
      document.body.removeChild(node);
    } else {
      window.open(url);
    }
  }
};

// 确保value的值在min和max之间
const minMax = (value, min, max) => {
  if (!value) {
    return min;
  } else if (value > max) {
    return max;
  } else {
    return value;
  }
};

//获取当前打开的路由最后的一段字符串
const getRouteKey = () => {
  const url = window.location.href;
  const index = url.lastIndexOf('/');
  if (index !== -1) {
    return url.substring(index+1);
  }
};

//获取当前页面标题，返回值：组成标题的字符串数组
const getPageTitle = () => {
  const rootState = global.store.getState();
  return rootState.layout.pageTitles[getRouteKey()];
};

//设置当前页面标题
const setPageTitle = (titleArr=[]) => {
  const layoutAction = new Action(['layout']);
  global.store.dispatch(layoutAction.assign({[getRouteKey()]: titleArr}, 'pageTitles'));
};

const checkFile = (file) => {
  let suffix = file.name.split('.');
  if (suffix.length > 1 && ['exe', 'bat', 'com'].includes(suffix.pop())) {
    showError(`不允许此文件类型的文件上传`);
    return false;
  }
  if (file.size > 5000000) {
    showError(`文件上传大小不能超过5M`);
    return false;
  }
  return true;
};

//上传前检查文件大小及类型
const uploadWithFileCheck = (url) => {
  return upload(url, checkFile);
};

/**
 * 功能：获取对应页面表格的导出模板列表
 * 参数：code:页面标识,必须与对应模板管理页面标识一致
 *       tableCols当前列表配置
 * */
const getTemplateList = (code, tableCols) => {
  const defaultList = [
    {title: '导出全部列', key: JSON.stringify({templateName: '导出全部列', tableCols})},
    {title: '导出列表显示列', key: JSON.stringify({templateName: '导出列表显示列', tableCols: tableCols.filter(col => col.hide !== true)})}
  ];
  const state = global.store.getState();
  const path = ['layout', 'tableColsSetting', code];
  const config = getPathValue(state, path) || {};
  const {templateList=[]} = config;
  return defaultList.concat(templateList.map(item => ({title: item.name, key: JSON.stringify({templateName:item.name, tableCols: item.cols})})));
};
/**
 * 功能：设置标准化导出按钮下拉和子下拉选项,主要针对费用管理部分原有的导出配置做优化
 * 参数：btns:原有的按钮组数据
 *      tableCols:当前列表配置
 *      exportKeys:导出下拉项的key值数组，默认值为['exportSearch', 'exportPage']
 * */
const setExportBtns = (btns=[], tableCols=[], exportKeys=['exportSearch', 'exportPage']) => {
  return btns.map(btn => {
    if (btn.key.includes('export') && btn.menu) {
      btn.menu = btn.menu.map(o => {
        if (exportKeys.includes(o.key)) {
          o.subMenu = getTemplateList(getRouteKey(), tableCols);
        }
        return o;
      })
    }
    return btn;
  });
};

const helper = {
  postOption,
  fetchJson,
  fetchSelect,
  fuzzySearch,
  fuzzySearchEx,
  getObject,
  getObjectExclude,
  isEmpty,
  isEmpty2,
  validValue,
  validArray,
  findOnlyCheckedIndex,
  convert,
  swapItems,
  showError,
  showSuccessMsg,
  isTabExist,
  genTabKey,
  getJsonResult,
  fetchJsonByNode,
  setOptions,
  getActions,
  initTableCols,
  initFilters,
  myToFixed,
  formatTime,
  openWindowByPostRequest,
  deepCopy,
  omit,
  download,
  minMax,
  getButtons,
  getRouteKey,
  getPageTitle,
  setPageTitle,
  uploadWithFileCheck,
  getTemplateList,
  setExportBtns
};

export {
  postOption,
  fetchJson,
  fetchSelect,
  fuzzySearch,
  fuzzySearchEx,
  getObject,
  getObjectExclude,
  isEmpty,
  isEmpty2,
  validValue,
  validArray,
  findOnlyCheckedIndex,
  convert,
  swapItems,
  showError,
  showSuccessMsg,
  isTabExist,
  genTabKey,
  fetchGetObj,
  getJsonResult,
  fetchJsonByNode,
  setOptions,
  getActions,
  initTableCols,
  initFilters,
  myToFixed,
  formatTime,
  deepCopy,
  download,
  setExportBtns
};

export default helper;
