import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import { Action } from '../../../action-reducer/action';
import { getPathValue } from '../../../action-reducer/helper';
import helper, { getObject, fetchJson, showError, showSuccessMsg} from '../../../common/common';
import {search2} from '../../../common/search';
import {showImportDialog} from '../../../common/modeImport';
import { exportExcelFunc, commonExport } from '../../../common/exportExcelSetting';
import { showColsSetting } from '../../../common/tableColsSetting';
import showFinanceDialog from './financeDialog';
import {toFormValue} from "../../../common/check";

const STATE_PATH = ['config', 'customersArchives'];
const URL_LIST = '/api/config/customersArchives/list';
const URL_ABLE = '/api/config/customersArchives/able';
const URL_SALEMEN = '/api/config/customersArchives/salemen';
const URL_DETAIL = '/api/config/customersArchives/detail';
const URL_DELETE = '/api/config/customersArchives/delete';
const URL_FINANANCIAL = '/api/basic/user/name';

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

// 为EditDialog组件构建状态
const buildEditDialogState = (config={}, data, edit) => {
  const EDIT_DIALOG = ['config', 'size', 'controls'];
  return {
    edit,
    ...getObject(config, EDIT_DIALOG),
    title: edit ? config.edit : config.add,
    value: helper.getObjectExclude(data, ['checked']),
    options: {}
  };
};

const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak))
};

const resetActionCreator = (dispatch) => {
  dispatch(action.assign({searchData: {}}));
};

const searchActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState);
};

const changeActionCreator = (key, value) => action.assign({[key]: value}, 'searchData');

const formSearchActionCreator = (key, value) => async (dispatch, getState) => {
  const {filters} = getSelfState(getState());
  let data, options;
  switch (key) {
    case 'salesPersonId': {
      const option = helper.postOption({maxNumber: 20, filter: value});
       data = await fetchJson(URL_SALEMEN, option);
       options = data.result.data;
       break;
    }
    case 'settlementPersonnel': {
      const option = helper.postOption({filter: value});
      data = await fetchJson(URL_FINANANCIAL, option);
      options = data.result.data;
      break;
    }
    default: return;
  }
  if(data.returnCode !== 0) return showError(data.returnMsg);
  const index = filters.findIndex(item => item.key === key);
  dispatch(action.update({options}, 'filters', index));
};

// 新增
const addActionCreator = (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const payload = buildEditDialogState(editConfig, {}, false);
  dispatch(action.assign(payload, 'edit'));
};

const editAction = async (isDbClick, dispatch, getState, rowIndex=0) => {
  const {tableItems, editConfig, customConfig} = getSelfState(getState());
  const index = isDbClick ? rowIndex : helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) return showError('请勾选一条数据！');
  if(tableItems[index]['enabledType'] !== 'enabled_type_unenabled'){
    return showError('只能编辑未启用状态记录');
  }
  const id = tableItems[index].id;
  const {returnCode, returnMsg, result} = await fetchJson(`${URL_DETAIL}/${id}`);
  if (returnCode !== 0) return showError(returnMsg);
  if (customConfig.controls && customConfig.controls.length > 0) {
    editConfig.controls.push({
      key: 'otherInfo', title: '其他信息', data: customConfig.controls
    });
  }
  const payload = buildEditDialogState(editConfig, result, true);
  dispatch(action.assign(payload, 'edit'));
};

//设置财务人员
const financeActionCreator = async (dispatch, getState) => {
  const {finance, tableItems} = getSelfState(getState());
  const idList = tableItems.reduce((result, item) => {
    item.checked && result.push(item.id);
    return result
  }, []);
  return !idList.length ? showError('请勾选一条数据') :
    await showFinanceDialog(finance, idList);
};

// 编辑
const editActionCreator = async (dispatch, getState) => {
  editAction(false, dispatch, getState);
};
const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
  editAction(true, dispatch, getState, rowIndex);
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
    type
  };
  const {returnCode, returnMsg} = await fetchJson(`${URL_ABLE}`, helper.postOption(params));
  if (returnCode !== 0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  searchActionCreator(dispatch, getState);
};

// 启用
const enableActionCreator = (dispatch, getState) => ableActionCreator('enabled_type_enabled', dispatch, getState);

// 禁用
const disableActionCreator = (dispatch, getState) => ableActionCreator('enabled_type_disabled', dispatch, getState);

// 删除
const deleteActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkItems = tableItems.filter(o=>o.checked);
  if(checkItems.length < 1) return showError('请勾选一条数据！');
  if (checkItems.some(o => o.enabledType !== 'enabled_type_unenabled')) return showError('请选择未启用状态的数据！');
  const {returnCode, returnMsg} = await fetchJson(URL_DELETE, helper.postOption(checkItems.map(o=>o.id)));
  if (returnCode !== 0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  searchActionCreator(dispatch, getState);
};

// 导入
const importActionCreator = () => showImportDialog('customer_import');

// 查询导出
const exportSearchActionCreator =(dispatch,getState)=>{
  const {tableCols, searchData} = getSelfState(getState());
  commonExport(tableCols, '/archiver-service/customer/list/search', searchData);
};

// 页面导出
const exportPageActionCreator =(dispatch,getState)=>{
  const {tableCols, tableItems} = getSelfState(getState());
  exportExcelFunc(tableCols, tableItems);
};

// 配置字段
const configActionCreator = async (dispatch, getState) => {
  const {tableCols} = getSelfState(getState());
  const okFunc = (newCols) => {
    dispatch(action.assign({tableCols: newCols}));
  };
  showColsSetting(tableCols, okFunc, 'customersArchives');
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchActionCreator,
  add: addActionCreator,
  edit: editActionCreator,
  enable: enableActionCreator,
  disable: disableActionCreator,
  delete: deleteActionCreator,
  import: importActionCreator,
  exportSearch: exportSearchActionCreator,
  exportPage :exportPageActionCreator,
  finance: financeActionCreator,
  config: configActionCreator
};

const clickActionCreator = (key) => {
  const k = key.split('_')[1] || key;
  if (toolbarActions.hasOwnProperty(k)) {
    return toolbarActions[k];
  } else {
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchData={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchData, newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchData={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchData, newState);
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onCheck: checkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
};

// 编辑完成后的动作
const afterEditActionCreator = (isOk=false ,dispatch, getState) => {
  dispatch(action.assign({edit: undefined}));
  isOk && searchActionCreator(dispatch, getState);
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {afterEditActionCreator, updateTable};
