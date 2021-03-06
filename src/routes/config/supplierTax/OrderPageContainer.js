import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import helper, {getObject, fetchJson, showError, postOption, showSuccessMsg} from '../../../common/common';
import {search2} from '../../../common/search';
import {showImportDialog} from '../../../common/modeImport';
import {commonExport, exportExcelFunc} from '../../../common/exportExcelSetting';
import showEditDialog from './EditDialogContainer'
import showFilterSortDialog from "../../../common/filtersSort";
import {toFormValue} from "../../../common/check";
import showOwnerDialog from  './OwnerTaxDialog';
import showTemplateManagerDialog from "../../../standard-business/template/TemplateContainer";
import {dealExportButtons} from "../customerContact/RootContainer";

const STATE_PATH = ['supplierTax'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/config/supplier_tax/list';
const URL_ENABLE = '/api/config/supplier_tax/enable';
const URL_DELETE = '/api/config/supplier_tax/delete';
const URL_ALLCUSTOMER = '/api/config/supplier_contact/customer';
const URL_ALLITEM = '/api/config/supplier_tax/allItems';
const URL_OWNER = '/api/config/supplier_tax/owner';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak))
};

// 搜索
const searchAction = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState);
};

// 清空搜索框
const resetActionCreator = () => {
  return action.assign({searchData: {}});
};

// 弹出新增对话框
const addAction = async (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  await showEditDialog(editConfig,{},false);
};

// 弹出编辑对话框
const editAction = async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    return showError('请勾选一条记录');
  }
  tableItems[index].supplierId ?
    await showEditDialog(editConfig,tableItems[index],true) :
    await ownerAction(dispatch, getState);
};

// 车主税率
const ownerAction = async (dispatch, getState) => {
  const {ownerControls} = getSelfState(getState());
  const readOnlyOwnerControls = helper.deepCopy(ownerControls).map(item => {
    if (item.key === 'taxRate' ) item.type = 'readonly';
    return item;
  });
  const {result, returnCode, returnMsg} = await fetchJson(URL_OWNER, postOption(['-1']));
  if (returnCode !== 0) return showError(returnMsg);
  if(result.length === 0) {
    const addOwnerConfig = {
      controls: ownerControls,
      title: '新增车主税率',
      config: {ok: '确定', cancel: '取消'},
      size: 'small',
      value: {supplierId: '-1'},
      readOnlyOwnerControls, ownerControls
    };
    await showOwnerDialog(addOwnerConfig) && updateTable(dispatch, getState);
  } else {
    //车主税率默认supplierId为-1
    const ownerConfig = {
      controls: result[0].taxRateWay === 'tax_rate_way_not_calculate' ?  readOnlyOwnerControls : ownerControls,
      title: '车主税率',
      config: {ok: '确定', cancel: '取消'},
      size: 'small',
      value: {taxRate: result[0].taxRate, taxRateWay: result[0].taxRateWay, id: result[0].id, supplierId: '-1'},
      readOnlyOwnerControls, ownerControls
    };
    await showOwnerDialog(ownerConfig) && updateTable(dispatch, getState);
  }
};

// 批量删除
const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems.filter(item => item.checked);
  if (checkedItems.length === 0) return showError('请选择记录') ;
  if(checkedItems.some(item => item.enabledType !== 'enabled_type_unenabled')){
    return showError('只能删除未启用状态的记录!');
  }
  const ids = checkedItems.map(item => item.id);
  const {returnCode, returnMsg} = await fetchJson(URL_DELETE, postOption(ids, 'delete'));
  if (returnCode === 0) {
    showSuccessMsg('记录已删除');
    return updateTable(dispatch, getState);
  }else{
    return showError(returnMsg);
  }
};

//启用记录
const enableAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems.filter(item => item.checked);
  if (checkedItems.length === 0) return showError('请选择记录') ;
  // if(checkedItems.some(item => item.enabledType !== 'enabled_type_unenabled')){
  //   return showError('只能启用未启用状态的记录!');
  // }
  const ids = checkedItems.map(item => item.id);
  const {returnCode, returnMsg} = await fetchJson(`${URL_ENABLE}/enabled_type_enabled`, postOption(ids, 'put'));
  if (returnCode === 0) {
    showSuccessMsg('记录已启用');
    return updateTable(dispatch, getState);
  }else{
    return showError(returnMsg);
  }
};

//禁用记录
const disableAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems.filter(item => item.checked);
  if (checkedItems.length === 0) return showError('请选择记录') ;
  if(checkedItems.some(item => item.enabledType !== 'enabled_type_enabled')){
    return showError('只能禁用已启用状态的记录!');
  }
  const ids = checkedItems.map(item => item.id);
  const {returnCode, returnMsg} = await fetchJson(`${URL_ENABLE}/enabled_type_disabled`, postOption(ids, 'put'));
  if (returnCode === 0) {
    showSuccessMsg('记录已禁用');
    return updateTable(dispatch, getState);
  }else{
    return showError(returnMsg);
  }
};

//导入按钮
const importActionCreator = () => {
  return showImportDialog('supplier_tax_import');
};

const sortActionCreator = async (dispatch, getState) => {
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
  return commonExport(tableCols, '/archiver-service/supplier_tax/list/search', searchData);
};

//模板管理
const templateManagerActionCreator = async (dispatch, getState) => {
  const {tableCols, buttons} = getSelfState(getState());
  if(true === await showTemplateManagerDialog(tableCols, helper.getRouteKey())) {
    dispatch(action.assign({buttons: dealExportButtons(buttons, tableCols)}));
  }
};

const toolbarActions = {
  reset: resetActionCreator(),
  search: searchAction,
  add: addAction,
  edit: editAction,
  enable: enableAction,
  disable: disableAction,
  owner: ownerAction,
  sort: sortActionCreator,
  delete: delAction,
  import: importActionCreator,
  exportSearch: exportSearchActionCreator,
  exportPage :exportPageActionCreator,
  templateManager: templateManagerActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    return {type: 'unknown',};
  }
};

const subClickActionCreator = (key, subKey) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key](subKey);
  } else {
    return {type: 'unknown',};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const changeActionCreator = (key, value) => {
  if (key === 'taxRate') {
    if (value >= 100) {
      value = null;
      showError('税率必须小于100');
    }
  }
  return action.assign({[key]: value}, 'searchData');
};

const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  tableItems[index].supplierId ?
    await showEditDialog(editConfig,tableItems[index],true) :
    await ownerAction(dispatch, getState);
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

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const filterSearchActionCreator = (key, value) =>async(dispatch)=> {
  if(key === 'supplierId'){
    const option = helper.postOption({maxNumber: 65536, customerId: value});
    let data = await fetchJson(URL_ALLCUSTOMER, option);
    if (data.returnCode === 0) {
      dispatch(action.update({options:data.result},"filters",{key:"key",value:key}));
    }
  }else if(key === 'chargeItemId'){
    const option = helper.postOption({maxNumber: 65536, customerId: value});
    let data = await fetchJson(URL_ALLITEM, option);
    if (data.returnCode === 0) {
      dispatch(action.update({options:data.result},"filters",{key:"key",value:key}));
    }
  }
};

const actionCreators = {
  onSearch:filterSearchActionCreator,
  onClick: clickActionCreator,
  onSubClick: subClickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator
};


const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable};
