import {connect} from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import helper, {fetchJson, postOption, showError, showSuccessMsg, getJsonResult} from '../../../common/common';
import {search2} from '../../../common/search';
import {showImportDialog} from '../../../common/modeImport';
import {exportExcelFunc} from '../../../common/exportExcelSetting';
import {toFormValue} from "../../../common/check";

const STATE_PATH = ['supplierPrice'];
const URL_LIST = '/api/config/supplierPrice/list';
const URL_SUPPLIER = '/api/config/supplierPrice/supplier';
const URL_USER = '/api/config/supplierPrice/user';
const URL_DELETE = '/api/config/supplierPrice/delete';
const URL_ABLE = '/api/config/supplierPrice/able';

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
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
    case 'supplierId':
    case 'balanceCompany': {
       result = getJsonResult(await fetchJson(URL_SUPPLIER, postOption(params)));
       break;
    }
    case 'insertUser': {
      result = getJsonResult(await fetchJson(URL_USER, postOption(params)));
      break;
   }
  }
  const options = result.data ? result.data : result;
  const index = filters.findIndex(item => item.key === key);
  dispatch(action.update({options}, 'filters', index));
};

const updateTable = async (dispatch, getState, isUpdate=true) => {
  const {activeKey, tabs, currentPage, pageSize, searchData={}} = getSelfState(getState());
  const newTabs = tabs.filter(o => o.key !== activeKey);
  dispatch(action.assign({activeKey: 'index', tabs: newTabs, [activeKey]: null}));
  if (!isUpdate) return;
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchData))
};

/**
 * 打开新增、复制新增、编辑页面
 * @param {number} type [0: 新增, 1: 复制新增, 2: 编辑]
 */
const showEditPage = (dispatch, getState, editType=0, key, title, item={}) => {
  const {editConfig, tabs} = getSelfState(getState());
  const KEY = editType === 2 ? key : helper.genTabKey(key, tabs);
  if ( editType === 2 && helper.isTabExist(tabs, KEY)) {
    return dispatch(action.assign({activeKey: KEY}));
  }
  const newTabs = tabs.concat({key: KEY, title});
  const payload = {
    ...helper.deepCopy(editConfig),
    item,
    editType
  };
  dispatch(action.assign({[KEY]: payload, tabs: newTabs, activeKey: KEY}));
};

const addActionCreator = async (dispatch, getState) => {
  showEditPage(dispatch, getState, 0, 'add', '新增');
};

const copyActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) return showError('请勾选一条数据！');
  const item = tableItems[index];
  showEditPage(dispatch, getState, 1, 'copyAdd', '复制新增', item);
};

const isCanEdit = (item) => {
  // if(item['enabledType'] !== 'enabled_type_unenabled'){
  //   showError('只能编辑未启用状态记录');
  //   return false;
  // }
  return true;
};

const editActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) return showError('请勾选一条数据！');
  const item = tableItems[index];
  isCanEdit(item) && showEditPage(dispatch, getState, 2, `edit_${item.id}`, item.supplierPriceCode, item);
};

const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const item = tableItems[rowIndex];
  isCanEdit(item) && showEditPage(dispatch, getState, 2, `edit_${item.id}`, item.supplierPriceCode, item);
};

const deleteActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkItems = tableItems.filter(o=>o.checked);
  if(checkItems.length < 1) return showError('请勾选一条数据！');
  if (checkItems.some(o => o.statusType !== 'enabled_type_unenabled')) return showError('请选择未启用状态的数据！');
  const {returnCode, returnMsg} = await fetchJson(URL_DELETE, postOption(checkItems.map(o => o.id)));
  if (returnCode !== 0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  await searchActionCreator(dispatch, getState);
};

const ableActionCreator = async (type='enabled_type_enabled', dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkItems = tableItems.filter(o=>o.checked);
  if(checkItems.length < 1) return showError('请勾选一条数据！');
  if(type === 'enabled_type_enabled') {
    if (checkItems.some(o=> o.enabledType === 'enabled_type_enabled')) return showError('请选择未启用或禁用状态的数据！');
  } else if(type === 'enabled_type_disabled') {
    if (checkItems.some(o=> o.enabledType !== 'enabled_type_enabled')) return showError('请选择已启用状态的数据！');
  }
  const params = {
    ids: checkItems.map(o=>o.id),
    enabledType: type
  };
  const {returnCode, returnMsg} = await fetchJson(`${URL_ABLE}`, postOption(params));
  if (returnCode !== 0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  await searchActionCreator(dispatch, getState);
};

const enableActionCreator = (dispatch, getState) => ableActionCreator('enabled_type_enabled', dispatch, getState);

const disableActionCreator = (dispatch, getState) => ableActionCreator('enabled_type_disabled', dispatch, getState);

const importActionCreator = () => showImportDialog('supplier_price_ import');

const exportActionCreator = async (dispatch, getState) => {
  const {tableCols, tableItems} = getSelfState(getState());
  exportExcelFunc(tableCols, tableItems);
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchActionCreator,
  add: addActionCreator,
  copy: copyActionCreator,
  edit: editActionCreator,
  delete: deleteActionCreator,
  enable: enableActionCreator,
  disable: disableActionCreator,
  import: importActionCreator,
  export: exportActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    return {type: 'unknown key'};
  }
};

const linkActionCreator = (key, rowIndex, item) => async (dispatch, getState) => {
  if (key === 'fileList') {
    window.open(item.fileUrl);
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

const mapStateToProps = (state) => {
  return helper.getObject(getSelfState(state), OrderPage.PROPS);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onLink: linkActionCreator,
  onCheck: checkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable};
