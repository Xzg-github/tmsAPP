import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {EnhanceLoading} from '../../../components/Enhance';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from '../../../action-reducer/action';
import helper from '../../../common/common';
import {buildOrderPageState} from '../../../common/state';
import {search, search2} from '../../../common/search';
import {fetchDictionary, setDictionary2} from '../../../common/dictionary';
import showDiaLog from './CarContainer';
import {showImportDialog} from '../../../common/modeImport';
import { exportExcelFunc, commonExport } from '../../../common/exportExcelSetting';
import {toFormValue,hasSign} from '../../../common/check';
import showFilterSortDialog from "../../../common/filtersSort";
import {dealExportButtons} from "../customerContact/RootContainer";
import showTemplateManagerDialog from "../../../standard-business/template/TemplateContainer";

const action = new Action(['config','supplierCar']);
const URL_CONFIG = '/api/config/supplier_car/config';
const URL_ATTR = '/api/config/supplier_car/attr';//拓展字段
const URL_LIST = '/api/config/supplier_car/list'; //查询列表
const URL_STATE = '/api/config/supplier_car/state'; //是否激活
const URL_DELETE = '/api/config/supplier_car/delete'; //删除

const getSelfState = (state) => {
  return getPathValue(state, ['config','supplierCar']);
};

//刷新页面
const refresh = (dispatch, state) => {
  return search2(dispatch, action, URL_LIST, state.currentPage, state.pageSize, state.searchDataBak);
};


const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const config = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    const dictionary = helper.getJsonResult(await fetchDictionary(config.dictionary));
    const list = helper.getJsonResult(await search(URL_LIST, 0, config.pageSize, {}));

    const {tableCols,edit} = config;
    //拓展字段
    const attr = helper.getJsonResult(await helper.fetchJson(URL_ATTR));
    if(attr.controls){
      tableCols.push(...attr.controls);
      edit.controls.push(...attr.controls)
    }

    const payload = buildOrderPageState(list, config, {isSort: true});
    payload.status = 'page';
    payload.edit = config.edit;
    payload.searchDataBak = payload.searchData;
    setDictionary2(dictionary, payload.tableCols, payload.edit.controls,payload.tableCols,payload.filters);
    payload.buttons = dealExportButtons(payload.buttons, payload.tableCols);
    dispatch(action.assign(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};


const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'searchData');
};

const resetActionCreator = () => {
  return action.assign({searchData: {}});
};

const searchActionCreator = () => async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState);
};

const addActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  if(await showDiaLog({},'新增')){
    refresh(dispatch, state);
  }
};

const editActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const items = state.tableItems.filter(item => item.checked);
  if (items.length !== 1) {
    helper.showError('请勾选一条记录');
  }else if(await showDiaLog(items[0],'编辑')){
    refresh(dispatch, state);
  }
};
//激活
const enableActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const items = state.tableItems.filter(item => item.checked);
  if (!items.length) {
    helper.showError('请至少勾选一条记录');
  }else {
    let id = items.map(item => item.id);
    const url = `${URL_STATE}/enabled_type_enabled`;
    const {returnCode,returnMsg} = await helper.fetchJson(url,helper.postOption(id,'put'));
    if(returnCode!==0){
      helper.showError(returnMsg)
    }else {
      helper.showSuccessMsg('启用成功');
      refresh(dispatch, state);
    }
  }
};

//失效
const disableActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const items = state.tableItems.filter(item => item.checked);
  if (!items.length) {
    helper.showError('请至少勾选一条记录');
  }else {
    let id = items.map(item => item.id);
    const url = `${URL_STATE}/enabled_type_disabled`;
    const {returnCode,returnMsg} = await helper.fetchJson(url,helper.postOption(id,'put'));
    if(returnCode!==0){
      helper.showError(returnMsg)
    }else {
      helper.showSuccessMsg('禁用成功');
      refresh(dispatch, state);
    }
  }
};

//删除
const deleteActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const items = state.tableItems.filter(item => item.checked);
  if (!items.length) {
    helper.showError('请至少勾选一条记录');
  }else {
    let id = items.map(item => item.id);
    const {returnCode,returnMsg} = await helper.fetchJson(URL_DELETE,helper.postOption(id,'delete'));
    if(returnCode!==0){
      helper.showError(returnMsg)
    }else {
      helper.showSuccessMsg('删除成功');
      refresh(dispatch, state);
    }
  }
};


//导入
const importActionCreator =()=> async(dispatch, getState) => {
  const oKFunc =() => {
    return updateTable(dispatch, getState);
  };
  return showImportDialog('supplier_car_info_import',oKFunc);
};

const sortActionCreator =() => async (dispatch, getState) => {
  const {filters} = getSelfState(getState());
  const newFilters = await showFilterSortDialog(filters, helper.getRouteKey());
  newFilters && dispatch(action.assign({filters: newFilters}));
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
  return commonExport(tableCols, '/archiver-service/car_info/supplier_list/search', searchData);
};

//模板管理
const templateManagerActionCreator = () => async (dispatch, getState) => {
  const {tableCols, buttons} = getSelfState(getState());
  if(true === await showTemplateManagerDialog(tableCols, helper.getRouteKey())) {
    dispatch(action.assign({buttons: dealExportButtons(buttons, tableCols)}));
  }
};


const clickActionCreators = {
  reset: resetActionCreator,
  search: searchActionCreator,
  add: addActionCreator,
  enable:enableActionCreator,
  sort: sortActionCreator,
  disable:disableActionCreator,
  delete:deleteActionCreator,
  edit:editActionCreator,
  import:importActionCreator,
  exportSearch: exportSearchActionCreator,
  exportPage :exportPageActionCreator,
  templateManager: templateManagerActionCreator,
};

const clickActionCreator = (key) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key]();
  } else {
    return {type: 'unknown'};
  }
};

const subClickActionCreator = (key, subKey) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key](subKey);
  } else {
    return {type: 'unknown',};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
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


const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const formSearchActionCreator = (key,keyValue,keyControls) => async(dispatch,getState) => {
  const {filters,value} = getSelfState(getState());
  const json = await helper.fuzzySearchEx(keyValue,keyControls);
  if (!json.returnCode) {
    const index = filters.findIndex(item => item.key == key);
    dispatch(action.update({options:json.result}, 'filters', index));
  }else {
    helper.showError(json.returnMsg)
  }

};


const doubleClickActionCreator = (rowIndex) => async(dispatch, getState) => {
  const state = getSelfState(getState());
  if (!hasSign('supplier_car', 'supplier_car_edit')) return;
  if(await showDiaLog(state.tableItems[rowIndex],'编辑')){
    refresh(dispatch, state);
  }
};



const actionCreators = {
  onInit: initActionCreator,
  onChange: changeActionCreator,
  onClick: clickActionCreator,
  onSubClick: subClickActionCreator,
  onCheck: checkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onSearch:formSearchActionCreator
};

export default connect(mapStateToProps, actionCreators)(EnhanceLoading(OrderPage));
