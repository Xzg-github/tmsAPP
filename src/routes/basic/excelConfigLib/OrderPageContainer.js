import { connect } from 'react-redux';
import { Action } from '../../../action-reducer/action';
import OrderPage from '../../../components/OrderPage';
import {getObject, showError, findOnlyCheckedIndex, fetchJson, showSuccessMsg} from '../../../common/common';
import {getPathValue} from '../../../action-reducer/helper';
import {search2} from '../../../common/search';
import {toFormValue} from "../../../common/check";
import {showImportDialog} from '../../../common/modeImport';
import { searchAction, pageNumberAction} from './helper';

const STATE_PATH = ['basic', 'excelConfigLib'];
const URL_LIST = '/api/basic/excelConfigLib/list';
const URL_DELETE = '/api/basic/excelConfigLib/excelModelConfig';
const URL_EDIT_EXCEL = '/api/basic/excelConfigLib/selectExcelModel';
const URL_EXCEL = '/api/basic/excelConfigLib/uploadExcelModel';
const action = new Action(STATE_PATH);
const URL_GENERATE = '/api/basic/excelConfigLib/generateExcelModel';

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
  pageNumberAction(dispatch, action, getSelfState(getState(), STATE_PATH), currentPage, pageSize, URL_LIST);
};

// 页条数过滤
const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  pageNumberAction(dispatch, action, getSelfState(getState(), STATE_PATH), currentPage, pageSize, URL_LIST);
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
  searchAction(dispatch, action, getSelfState(getState(), STATE_PATH), URL_LIST);
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
    { key: 'upload', title: '导入模板'},
    { key: 'save', title: '保存', bsStyle: 'primary'},
  ];
  const newConfig = key ? readOnlyConfig({...editConfig}, buttons1) : editConfig;
  const CURRNT_TABLE_CODE = result.content.table[0].tableCode;
  const state = result.sheetList.reduce((result, item) => {
    const key = Object.keys(item)[0];
    result[key] = item[key];
    return result;
  },{});
  const tabKey = Object.keys(result.content.field).map((key, index) => ({key: key, title: `Sheet ${index + 1}`}))
  const add = { ...newConfig,value:result,edit:true, content, CURRNT_TABLE_CODE, tabs: tabKey, state};
  const tab = { key:key, title: '编辑' };
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
  const CURRNT_TABLE_CODE = result.content.table[0].tableCode;
  const state = result.sheetList.reduce((result, item) => {
    const key = Object.keys(item)[0];
    result[key] = item[key];
    return result;
  },{});
  const tabKey = Object.keys(result.content.field).map((key, index) => ({key: key, title: `Sheet ${index + 1}`}))
  const add = { ...newConfig,value:result,edit:false, content, CURRNT_TABLE_CODE, tabs: tabKey, state};
  const tab = { key:key, title: '复新增辑' };
  dispatch(action.assign({[tab.key]: add,activeKey:tab.key, tabs: tabs.concat(tab)}));
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
    helper.showSuccessMsg('删除成功');
  }else{
    showError('returnMsg');
  }
};

//导入
const importActionCreator = (dispatch, getState) => {
  return showImportDialog('excelConfigLib');
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

//勾选复选框
const onCheckActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({ checked }, 'tableItems', rowIndex);
};

// 搜索值变化
const onChangeActionCreator = (key, value) => async (dispatch) => {
  dispatch(action.assign({ [key]: value }, 'searchData'));
};


const toolbarActions = {
  search: onSearchActionCreator,
  reset: resetActionCreator,
  add: addAction,
  edit: editAction,
  copyAdd: copyAddAction,
  delete: delAction,
  import: importActionCreator,
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
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: onChangeActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onCheck: onCheckActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable};