import { connect } from 'react-redux';
import { Action } from '../../../action-reducer/action';
import OrderPage from './OrderPage';
import {getObject, showError, findOnlyCheckedIndex, fetchJson, showSuccessMsg} from '../../../common/common';
import {getPathValue} from '../../../action-reducer/helper';
import {search2} from '../../../common/search';
import {toFormValue} from "../../../common/check";
import { searchAction, pageNumberAction} from './helper';

const STATE_PATH = ['basic', 'excelConfigLib'];
const URL_LIST = '/api/basic/excelConfigLib/list';
const URL_DELETE = '/api/basic/excelConfigLib/excelModelConfig';
const URL_EDIT_EXCEL = '/api/basic/excelConfigLib/selectExcelModel';
const URL_EXCEL = '/api/basic/excelConfigLib/uploadExcelModel';
const action = new Action(STATE_PATH);
const URL_GENERATE = '/api/basic/excelConfigLib/generateExcelModel';
const URL_UPLOAD_EXCEL = '/api/proxy/integration_service/excelModelConfig/uploadExcelModel';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak));
};

// 页码过滤
const pageNumberActionCreator = (currentPage) => async (dispatch, getState) => {
  const { pageSize } = getSelfState(getState(), STATE_PATH);
  return pageNumberAction(dispatch, action, getSelfState(getState(), STATE_PATH), currentPage, pageSize, URL_LIST);
};

// 页条数过滤
const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
 return pageNumberAction(dispatch, action, getSelfState(getState(), STATE_PATH), currentPage, pageSize, URL_LIST);
};

//判断是否选择项卡是否已存在
const isTabExist = (tabs, key) => {
  return tabs.some(tab => tab.key === key)
};

// 改为只读
const readOnlyConfig = (editConfig = {},buttons1) => {
  let config = JSON.parse(JSON.stringify(editConfig));
  config.controls[0].type = 'readonly';
  config.buttons1 = buttons1;
  return config
};

//搜索
const onSearchActionCreator = async (dispatch, getState) => {
  return searchAction(dispatch, action, getSelfState(getState(), STATE_PATH), URL_LIST);
};

//重置
const resetActionCreator = (dispatch, getState) => {
  dispatch(action.assign({ searchData: {}}));
};

//新增
const addAction  = (dispatch, getState) => {
  const {editConfig,tabs} = getSelfState(getState());
  if (isTabExist(tabs, 'edit')) {
    dispatch(action.assign({ activeKey: 'edit'}));
    return
  }
  const  state = {
    [editConfig.CURRNT_TABLE_CODE]: {
      mapperList: []
    }
  };
  const add = { ...editConfig,value:{},edit:false, state};
  const tab = { key:'edit', title: '新增' };
  dispatch(action.assign({[tab.key]: add,activeKey:tab.key, tabs: tabs.concat(tab) }));
};

//编辑
const editAction = async (dispatch, getState) => {
  const {editConfig, tabs, tableItems} = getSelfState(getState());
  const index = findOnlyCheckedIndex(tableItems);
  if(index === -1){
    showError('请勾选一条记录');
    return;
  }
  const key = tableItems[index].id;
  if(isTabExist(tabs, key)){
    dispatch(action.assign({activeKey: key}));
    return;
  }
  const {result, returnCode, returnMsg} = await fetchJson(`${URL_EDIT_EXCEL}/${key}`);
  if(returnCode !== 0){
    showError(returnMsg);
    return;
  }
  const buttons1 = [
    { key: "cancel", title: '关闭'},
    { key: 'upload', title: '上传模板'},
    { key: 'save', title: '保存', bsStyle: 'primary'},
  ];
  const newConfig = key ? readOnlyConfig({...editConfig}, buttons1) : editConfig;
  const state = result.sheetList.reduce((result, item) => {
    const key = Object.keys(item)[0];
    result[key] = item[key];
    return result;
  },{});
  const content = result.content;
  const tableCode = content.table[0].tableCode.split(','); //以逗号为分割，生成数组，元素为字符串
  const CURRNT_TABLE_CODE = tableCode[0];
  const tableTitle = content.table[0].tableTitle.split(',');
  const tabKey = tableCode.map((key, index) => ({key, title: tableTitle[index]}));
  const add = { ...newConfig,value:result,edit:true, content, CURRNT_TABLE_CODE, tabs: tabKey, state};
  const tab = { key:key, title: result.modelName };
  dispatch(action.assign({[tab.key]: add,activeKey:tab.key, tabs: tabs.concat(tab)}));
};

//复制新增
const copyAddAction = async (dispatch, getState) => {
  const {editConfig, tabs, tableItems} = getSelfState(getState());
  const index = findOnlyCheckedIndex(tableItems);
  if(index === -1){
    showError('请勾选一条记录');
    return;
  }
  const key = tableItems[index].id;
  if(isTabExist(tabs, key)){
    dispatch(action.assign({activeKey: key}));
    return;
  }
  const {result, returnCode, returnMsg} = await fetchJson(`${URL_EDIT_EXCEL}/${key}`);
  if(returnCode !== 0){
    showError(returnMsg);
    return;
  }
  const buttons1 = [
    { key: "cancel", title: '关闭'},
    { key: 'save', title: '保存', bsStyle: 'primary'},
  ];
  const newConfig = key ? readOnlyConfig({...editConfig}, buttons1) : editConfig;
  delete result.id;
  delete result.url;
  const state = result.sheetList.reduce((result, item) => {
    const key = Object.keys(item)[0];
    result[key] = item[key];
    return result;
  },{});
  const content = result.content;
  const tableCode = content.table[0].tableCode.split(','); //以逗号为分割，生成数组，元素为字符串
  const CURRNT_TABLE_CODE = tableCode[0];
  const tableTitle = content.table[0].tableTitle.split(',');
  const tabKey = tableCode.map((key, index) => ({key, title: tableTitle[index]}));
  const add = { ...newConfig,value:result,edit:false, content, CURRNT_TABLE_CODE, tabs: tabKey, state};
  const tab = { key:key, title: '复制新增' };
  dispatch(action.assign({[tab.key]: add, activeKey: tab.key, tabs: tabs.concat(tab)}))
};

//删除
const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = findOnlyCheckedIndex(tableItems);
  if(index === -1){
    showError('请勾选一条记录');
    return
  }
  const item = tableItems[index];
  const {result, returnCode, returnMsg} = await fetchJson(`${URL_DELETE}/${item.id}`, 'delete');
  if(returnCode === 0){
    dispatch(action.del('tableItems', index));
    showSuccessMsg('删除成功');
  }else{
    showError('returnMsg');
  }
};

//生成模板
const generateAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    showError('请勾选一条记录');
    return;
  }
  const id = tableItems[index].id;
  const { returnCode, returnMsg, result } = await fetchJson(`${URL_GENERATE}/${id}`);
  if (returnCode !== 0) {
    showError(returnMsg);
    return;
  }
  showSuccessMsg(returnMsg);
};

//点击超链接下载
const onLinkActionCreator = (key, rowIndex, item)  => async () => {
  const id = item.id;
  const url = '/api/config/modeinput/down';
  const {result, returnCode} = await fetchJson(`${url}?id=${id}`);
  if(returnCode !== 0) {
    showError('没有可下载的模板，请先上传');
    return;
  }
  window.open(`/api/proxy/file-center-service/${result}`);
};

//勾选复选框
const onCheckActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({ checked }, 'tableItems', rowIndex);
};

// 搜索值变化
const onChangeActionCreator = (key, value) => async (dispatch) => {
  dispatch(action.assign({ [key]: value }, 'searchData'));
};

//显示导入模板
const uploadAction = (dispatch, getState) => {
  const {tableItems } = getSelfState(getState());
  const index = findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    showError('请勾选一条记录');
    return;
  }
  dispatch(action.assign({ visible: true }));
};

//关闭导入模板
const onCancel1Action = () => (dispatch, getState) => {
  dispatch(action.assign({ visible: false }));
};

//上传
const onUploadActionCreator = (file) => async (dispatch, getState) => {
  const { value, tableItems } = getSelfState(getState());
  const index = findOnlyCheckedIndex(tableItems);
  const id = tableItems[index].id;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('id', id);
  let xhr;
  if (window.XMLHttpRequest) { // code for all new browsers
    xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // code for IE5 and IE6
    xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
  }
  if (xhr !== null) {
    xhr.onload = (event) => {
      const { returnCode, returnMsg } = JSON.parse(xhr.responseText); // 服务器返回
      if (returnCode !== 0) {
        returnMsg && showError(returnMsg);
        return;
      }
      returnMsg && showSuccessMsg(returnMsg);
      dispatch(action.update({ checked: false }, 'tableItems', -1));
    };
    xhr.onabort = (event) => {
      showError('上传失败');
    };
    xhr.open('post', URL_UPLOAD_EXCEL, true);  // true表示异步
    xhr.withCredentials = true;
    xhr.send(formData);
  } else {
    showError('Your browser does not support XMLHTTP.');
  }
};


const toolbarActions = {
  search: onSearchActionCreator,
  reset: resetActionCreator,
  add: addAction,
  edit: editAction,
  copyAdd: copyAddAction,
  delete: delAction,
  upload: uploadAction,
  generate: generateAction,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: onChangeActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onCheck: onCheckActionCreator,
  onLink: onLinkActionCreator,
  onCancel: onCancel1Action,
  onUpload: onUploadActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable};
