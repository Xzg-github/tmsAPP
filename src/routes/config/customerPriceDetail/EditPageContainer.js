import {connect} from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import helper, {fetchJson, postOption, showError, showSuccessMsg, getJsonResult} from '../../../common/common';
import {toTableItems} from '../../../common/state';
import {EnhanceLoading} from '../../../components/Enhance';
import {dealActions} from '../../../common/check';
import {search, search2} from '../../../common/search';
import {showImportDialog} from '../../../common/modeImport';
import {exportExcelFunc} from '../../../common/exportExcelSetting';
import {toFormValue} from "../../../common/check";
import showEditDialog from './EditDialog/EditDialogContainer';
import {showColsSetting} from '../../../common/tableColsSetting';

const PARENT_PATH = ['customerPriceDetail'];
const STATE_PATH = ['customerPriceDetail', 'edit'];
const URL_LIST = '/api/config/customerPriceDetail/extraChargeList';
const URL_CUSTOMER = '/api/config/customerPriceDetail/customer';
const URL_DISTRICT = '/api/config/customerPriceDetail/district';
const URL_CONSIGNOR = '/api/config/customerPriceDetail/consignor';
const URL_CARMODE = '/api/config/customerPriceDetail/carMode';
const URL_DELETE = '/api/config/customerPriceDetail/freightDelete';
const URL_ABLE = '/api/config/customerPriceDetail/freightAble';
const URL_ADD = '/api/config/customerPriceDetail/freightAdd';
const URL_EDIT = '/api/config/customerPriceDetail/freightEdit';
const URL_BATCHEDIT = '/api/config/customerPriceDetail/freightBatchEdit';
const URL_CAOMODE = '/api/config/customerPriceDetail/carMode';
const URL_CURRENCY = '/api/config/customerPriceDetail/currency';
const URL_CHARGEITEM = '/api/config/customerPriceDetail/chargeItem';
const URL_CONTRACT = '/api/config/customerPriceDetail/contract';

const action = new Action(STATE_PATH);

const DIALOG_API = {
  search_customer: URL_CUSTOMER,
  search_carMode: URL_CAOMODE,
  search_currency: URL_CURRENCY,
  search_chargeItem: URL_CHARGEITEM,
  search_contract: URL_CONTRACT,
  search_district: URL_DISTRICT,
  newAdd: URL_ADD,
  editSave: URL_EDIT,
  batchEdit: URL_BATCHEDIT
};

const getParentState = (rootState) => {
  return getPathValue(rootState, PARENT_PATH);
};

const getSelfState = (rootState) => {
  const parent = getParentState(rootState);
  return parent[parent.activeKey] || {};
};

const resetActionCreator = (dispatch) => {
  dispatch(action.assign({searchData: {}}));
};

const searchActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, {currentPage: 1});
};

const changeActionCreator = (key, value) => action.assign({[key]: value}, 'searchData');

const formSearchActionCreator = (key, value) => async (dispatch, getState) => {
  const {filters} = getSelfState(getState());
  let result, params = {maxNumber: 20, filter: value};
  switch (key) {
    case 'customerId': {
       result = getJsonResult(await fetchJson(URL_CUSTOMER, postOption(params)));
       break;
    }
    case 'departure':
    case 'destination': {
      result = getJsonResult(await fetchJson(URL_DISTRICT, postOption(params)));
      break;
    }
    case 'consignorId':
    case 'consigneeId': {
      result = getJsonResult(await fetchJson(URL_CONSIGNOR, postOption(params)));
      break;
    }
    case 'carModeId': {
      result = getJsonResult(await fetchJson(URL_CARMODE, postOption(params)));
      break;
   }
  }
  const options = result.data ? result.data : result;
  const index = filters.findIndex(item => item.key === key);
  dispatch(action.update({options}, 'filters', index));
};

const afterEdit = async (dispatch, getState) => {
  const {currentPage, pageSize, searchData={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchData))
};

const addActionCreator = async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  const result = await showEditDialog({type: 0, controls, DIALOG_API});
  result && await afterEdit(dispatch, getState);
};

const copyActionCreator = async (dispatch, getState) => {
  const {controls, tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) return showError('请勾选一条数据！');
  const value = tableItems[index];
  const result = await showEditDialog({type: 1, controls, value, DIALOG_API});
  result && await afterEdit(dispatch, getState);
};

const editActionCreator = async (dispatch, getState) => {
  const {controls, tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) return showError('请勾选一条数据！');
  const value = tableItems[index];
  if (value['enabledType'] !== 'enabled_type_unenabled') {
    return showError('只能编辑未启用状态记录！');
  }
  const result = await showEditDialog({type: 2, controls, value, DIALOG_API});
  result && await afterEdit(dispatch, getState);
};

const batchActionCreator = async (dispatch, getState) => {
  const {batchEditControls, tableItems} = getSelfState(getState());
  const checckList = tableItems.filter(o => o.checked);
  if (checckList.length < 1) return showError('请勾选一条数据！');
  const customerPriceIds = Array.from(new Set(checckList.map(o => o.customerPriceId)));
  if (customerPriceIds.length > 1) return showError('请勾选同一个报价合同下的数据！');
  const {customerPriceId, customerPriceCode, customerId} = customerPriceIds[0];
  const defaultValue = {
    customerPriceId,
    customerPriceCode,
    customerId,
    contractNumber: {
      title: customerPriceCode,
      value: customerPriceId
    }
  };
  const value = {...defaultValue, idList: checckList.map(o => o.id)};
  const result = await showEditDialog({type: 3, controls: batchEditControls, value, DIALOG_API});
  result && await afterEdit(dispatch, getState);
};

const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
  const {controls, tableItems} = getSelfState(getState());
  const value = tableItems[rowIndex];
  if (value['enabledType'] !== 'enabled_type_unenabled') {
    return showError('只能编辑未启用状态记录！');
  }
  const result = await showEditDialog({type: 2, controls, value, DIALOG_API});
  result && await afterEdit(dispatch, getState);
};

const deleteActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkItems = tableItems.filter(o => o.checked);
  if(checkItems.length < 1) return showError('请勾选一条数据！');
  if (checkItems.some(o => o.enabledType !== 'enabled_type_unenabled')) return showError('请选择未启用状态的数据！');
  const {returnCode, returnMsg} = await fetchJson(URL_DELETE, postOption(checkItems.map(o=>o.id)));
  if (returnCode !== 0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  await afterEdit(dispatch, getState);
};

const ableActionCreator = (type='enabled_type_enabled') => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkItems = tableItems.filter(o=>o.checked);
  if(checkItems.length < 1) return showError('请勾选一条数据！');
  if(type === 'enabled_type_enabled') {
    if (checkItems.some(o=> o.enabledType === 'enabled_type_enabled')) return showError('请选择未启用或禁用状态的数据！');
  } else if(type === 'enabled_type_disabled') {
    if (checkItems.some(o=> o.enabledType !== 'enabled_type_enabled')) return showError('请选择已启用状态的数据！');
  }
  const params = {
    ids: checkItems.map(o => o.id),
    type
  };
  const {returnCode, returnMsg} = await fetchJson(URL_ABLE, postOption(params));
  if (returnCode !== 0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  await afterEdit(dispatch, getState);
};

const enableActionCreator = ableActionCreator('enabled_type_enabled');

const disableActionCreator = ableActionCreator('enabled_type_disabled');

const importActionCreator = () => showImportDialog('customer_price_master_import_detail_code');

const exportActionCreator = async (dispatch, getState) =>{
  const {cols, tableItems} = getSelfState(getState());
  exportExcelFunc(cols, tableItems);
};

const configActionCreator = async (dispatch, getState) => {
  const {tableCols} = getSelfState(getState());
  const okFunc = (newCols) => {
    dispatch(action.assign({tableCols: newCols}));
  };
  showColsSetting(tableCols, okFunc, 'customerPriceDetail_excharge_tablecols');
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchActionCreator,
  add: addActionCreator,
  copy: copyActionCreator,
  edit: editActionCreator,
  batchEdit: batchActionCreator,
  delete: deleteActionCreator,
  enable: enableActionCreator,
  disable: disableActionCreator,
  import: importActionCreator,
  export: exportActionCreator,
  config: configActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    return {type: 'unknown key'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchData, {currentPage});
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchData, {pageSize, currentPage});
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const {pageSize, ...config} = getSelfState(getState());
    const list = getJsonResult(await search(URL_LIST, 0, pageSize, {}));
    const payload = {
      ...config,
      maxRecords: list.returnTotalItem,
      currentPage: 1,
      tableItems: toTableItems(list),
      searchData: {},
      status: 'page'
    };
    payload.buttons = dealActions(payload.buttons, 'customer_price_detail');
    dispatch(action.create(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onCheck: checkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(OrderPage));
export default Container;
