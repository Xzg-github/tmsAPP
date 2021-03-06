import OrderPage from '../../../components/OrderPage';
import { getPathValue } from '../../../action-reducer/helper';
import { connect } from 'react-redux';
import {dealActions} from '../../../common/check';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import helper, {fetchJson, showError} from '../../../common/common';
import {setDictionary,fetchDictionary} from '../../../common/dictionary';
import {buildOrderPageState} from '../../../common/state';
import {search, search2} from '../../../common/search';
import showAddDialog from './addDialog/AddDialogContainer';
import {showImportDialog} from '../../../common/modeImport';
import {commonExport, exportExcelFunc} from "../../../common/exportExcelSetting";
import {dealExportButtons} from "../customerContact/RootContainer";
import showTemplateManagerDialog from "../../../standard-business/template/TemplateContainer";

const URL_CONFIG = '/api/config/insideSupervisor/config';
const URL_LIST = '/api/config/insideSupervisor/list';
const URL_ACTIVE_OR_INACTIVE = '/api/config/supplierSupervisor/active_or_inactive';                //激活/失效
const URL_DEL = '/api/config/supplierSupervisor/delete';
const URL_ALL_INSTITUTION = '/api/config/insideDriver/all_institution';                 //归属机构

const STATE_PATH = ['insideSupervisor'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
    return getPathValue(rootState, STATE_PATH)
};

const initActionCreator = () => async (dispatch) => {
    try{
        dispatch(action.assign({status: 'loading'}));
        const {index, edit, names} = await helper.fetchJson(URL_CONFIG);
        const dictionary = helper.getJsonResult(await fetchDictionary(names));
        const list = helper.getJsonResult(await search(URL_LIST, 0, index.pageSize, {}));
        const payload = buildOrderPageState(list, index, {editConfig: edit, status: 'page'});
        payload.buttons = dealActions(payload.buttons, 'supervisionFile');
        setDictionary(payload.tableCols, dictionary);
        setDictionary(payload.filters, dictionary);
        setDictionary(payload.editConfig.controls, dictionary);
      //初始化列表配置
      payload.tableCols = helper.initTableCols(helper.getRouteKey(), payload.tableCols);
      payload.buttons = dealExportButtons(payload.buttons, payload.tableCols);
        dispatch(action.create(payload));
    }catch(e){
        dispatch(action.assign({status: 'retry'}));
        helper.showError(e.message);
    }
};

//勾选记录
const checkActionCreator = (isAll, checked, rowIndex) => {
    isAll && (rowIndex = -1);
    return action.update({checked}, 'tableItems', rowIndex);
  };

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState);
};

//输入值修改
const changeActionCreator = (key, value) => {
    return action.assign({[key]: value}, 'searchData');
  };

const formSearchActionCreator = (key, title, keyControls) => async (dispatch, getState) => {
  const {filters} = getSelfState(getState());
  let data, body;
  if(key === 'institutionId') {                                                     //归属机构
    body = {institutionName: title};
    data = await helper.fetchJson(URL_ALL_INSTITUTION, helper.postOption(body));
  }else{
    data = await helper.fuzzySearchEx(title, keyControls);
  }
  if (data.returnCode !== 0) {
    helper.showError(data.returnMsg);
    return;
  }
  const index = filters.findIndex(item => item.key === key);
  dispatch(action.update({options: data.result}, 'filters', index));
};

//搜索
const searchAction = async (dispatch, getState) => {
    const {pageSize, searchData} = getSelfState(getState());
    const newState = {searchDataBak: searchData, currentPage: 1};
    return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState);
  };

//清空数据框
const resetAction = () => {
    return action.assign({searchData: {}});
};

//新增
const addAction = async (dispatch, getState) => {
    const {editConfig} = getSelfState(getState());
    if (true === await showAddDialog({}, editConfig)) {
      return searchAction(dispatch, getState);
    }
};

//编辑
const editAction = async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if(index === -1){
      helper.showError('请勾选一条记录');
      return;
  }
  const item = tableItems[index];
  if (true === await showAddDialog(item, editConfig)) {
    return searchAction(dispatch, getState);
  }
};

//双击编辑
const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const item = tableItems[index];
  if (true === await showAddDialog(item, editConfig)) {
    return searchAction(dispatch, getState);
  }
};

const checkedItems = (rootState) => {
  const {tableItems} = getSelfState(rootState);
  const allChecked = tableItems.filter(item => item.checked);
  return allChecked;
};

//删除(批量)
const delAction = async (dispatch, getState) => {
  const rootState = getState();
  const items = checkedItems(rootState);
  if(items.length === 0){
    showError('请勾选记录进行删除');
    return;
  }
  if (items.some(item => item.enabledType !== 'enabled_type_unenabled')) return showError('请选择未启用状态的数据！');
  let ids = items.map(item1 => item1.id);
  const { returnCode, returnMsg } = await fetchJson(URL_DEL,helper.postOption(ids, 'delete'));
  if(returnCode !== 0){
    helper.showError(returnMsg);
    return;
  }
  helper.showSuccessMsg(returnMsg);
  return searchAction(dispatch, getState);
};

//启用
const enableAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  let idList = [];
  tableItems.map((val,key)=> {if(val.checked){idList.push(val.id)}});
  if(idList.length === 0){
    helper.showError('请勾选要启用的记录');
    return;
  }
  const type = 'enabled_type_enabled';
  const {returnCode, returnMsg} = await fetchJson(`${URL_ACTIVE_OR_INACTIVE}/${type}`, helper.postOption(idList, 'put'));
  if (returnCode === 0) {
    helper.showSuccessMsg('激活成功');
    return searchAction(dispatch, getState);
  }else {
    helper.showError(returnMsg);
  }
};

//失效
const disableAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  let idList=[];
  tableItems.map((val,key)=> {if(val.checked){idList.push(val.id)}});
  if (idList.length===0) {
    helper.showError('请勾选记录');
    return;
  }
  const type = 'enabled_type_disabled';
  const {returnCode, returnMsg} = await fetchJson(`${URL_ACTIVE_OR_INACTIVE}/${type}`, helper.postOption(idList, 'put'));
  if (returnCode === 0) {
    helper.showSuccessMsg('记录已失效');
    return searchAction(dispatch, getState);
  }else {
    helper.showError(returnMsg);
  }
};

//导入按钮
const importActionCreator = (dispatch, getState) => {
  return showImportDialog('supervisor_info_import');
};

//页面导出
const exportPageActionCreator = (subKey) => (dispatch, getState) => {
  const {tableCols=[]} = JSON.parse(subKey);
  const {tableItems} = getSelfState(getState());
  return exportExcelFunc(tableCols, tableItems);
};

// 查询导出
const exportSearchActionCreator = (subKey) => (dispatch, getState) =>{
  const {tableCols=[]} = JSON.parse(subKey);
  const {searchData} = getSelfState(getState());
  return commonExport(tableCols, '/archiver-service/supervisor_info/list/search', searchData);
};

//模板管理
const templateManagerActionCreator = async (dispatch, getState) => {
  const {tableCols, buttons} = getSelfState(getState());
  if(true === await showTemplateManagerDialog(tableCols, helper.getRouteKey())) {
    dispatch(action.assign({buttons: dealExportButtons(buttons, tableCols)}));
  }
};

const toolbarActions = {
  reset: resetAction(),
  search: searchAction,
  add: addAction,
  edit: editAction,
  del: delAction,
  active: enableAction,
  inactive: disableAction,
  import:importActionCreator,
  exportSearch: exportSearchActionCreator,
  exportPage :exportPageActionCreator,
  templateManager: templateManagerActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const subClickActionCreator = (key, subKey) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key](subKey);
  } else {
    return {type: 'unknown',};
  }
};

const mapStateToProps = (state) => {
    return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onClick: clickActionCreator,
  onSubClick: subClickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onSearch: formSearchActionCreator,
};


const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(OrderPage));
export default Container
