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
import showFilterSortDialog from "../../../common/filtersSort";
import showTemplateManagerDialog from "../../../standard-business/template/TemplateContainer";
import {dealExportButtons} from "./RootContainer";

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
  const EDIT_DIALOG = ['config', 'size'];
  const backConfig = helper.deepCopy(config);
  const newData = backConfig.controls[1].data.map(item => {
    if (item.key === 'tax') item.type = 'readonly';
    return item;
  });
  backConfig.controls[1].data = newData;
  return {
    edit,
    ...getObject(config, EDIT_DIALOG),
    title: edit ? config.edit : config.add,
    value: helper.getObjectExclude(data, ['checked']),
    options: {},
    controls: data['taxType'] === 'tax_rate_way_not_calculate' ? backConfig.controls : config.controls
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

// 需求变更 放开可编辑的权限
const editAction = async (isDbClick, dispatch, getState, rowIndex=0) => {
  const {tableItems, editConfig, customConfig} = getSelfState(getState());
  const index = isDbClick ? rowIndex : helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) return showError('请勾选一条数据！');
  // if(tableItems[index]['enabledType'] !== 'enabled_type_unenabled'){
  //   return showError('只能编辑未启用状态记录');
  // }
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

// 配置字段
const configActionCreator = async (dispatch, getState) => {
  const {tableCols} = getSelfState(getState());
  const okFunc = (newCols) => {
    dispatch(action.assign({tableCols: newCols}));
  };
  showColsSetting(tableCols, okFunc, 'customersArchives');
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
  //税率保存时虽然是字典但是只保存title, 所以在前端导出时先去掉options
  const exportTableCols = helper.deepCopy(tableCols).map(_item => {
    if (_item.key === 'tax') delete _item.options;
    return _item;
  });
  return exportExcelFunc(exportTableCols, tableItems);
};

// 查询导出
const exportSearchActionCreator = (subKey) => (dispatch, getState) =>{
  const {tableCols=[]} = JSON.parse(subKey);
  const {searchData} = getSelfState(getState());
  //税率保存时虽然是字典但是只保存title, 所以要去掉字典属性
  const exportTableCols = helper.deepCopy(tableCols).map(_item => {
    if (_item.key === 'tax') delete _item.dictionary;
    return _item;
  });
  return commonExport(exportTableCols, '/archiver-service/customer/list/search', searchData);
};

//模板管理
const templateManagerActionCreator = async (dispatch, getState) => {
  const {tableCols, buttons} = getSelfState(getState());
  if(true === await showTemplateManagerDialog(tableCols, helper.getRouteKey())) {
    dispatch(action.assign({buttons: dealExportButtons(buttons, tableCols)}));
  }
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchActionCreator,
  add: addActionCreator,
  edit: editActionCreator,
  enable: enableActionCreator,
  disable: disableActionCreator,
  delete: deleteActionCreator,
  sort: sortActionCreator,
  import: importActionCreator,
  exportSearch: exportSearchActionCreator,
  exportPage :exportPageActionCreator,
  templateManager: templateManagerActionCreator,
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

const subClickActionCreator = (key, subKey) =>{
  const k = key.split('_')[1] || key;
  if (toolbarActions.hasOwnProperty((k))) {
    return toolbarActions[k](subKey);
  }else {
    return {type: 'key unknown'};
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
  onSubClick: subClickActionCreator,
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
  isOk && updateTable(dispatch, getState);
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {afterEditActionCreator, updateTable};
