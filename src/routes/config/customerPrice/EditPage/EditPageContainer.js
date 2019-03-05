import {connect} from 'react-redux';
import EditPage from './EditPage';
import {Action} from '../../../../action-reducer/action';
import {EnhanceLoading} from '../../../../components/Enhance';
import {getPathValue} from '../../../../action-reducer/helper';
import helper, {getJsonResult, postOption, fetchJson, showError, showSuccessMsg} from '../../../../common/common';
import {search2} from '../../../../common/search';
import {showImportDialog} from '../../../../common/modeImport';
import {exportExcelFunc} from '../../../../common/exportExcelSetting';
import {toFormValue} from "../../../../common/check";
import {fetchDictionary, setDictionary, getStatus} from '../../../../common/dictionary';

const PARENT_PATH = ['customerPrice'];
const STATE_PATH = ['customerPrice', 'edit'];

const URL_LIST = '/api/config/customerPrice/list';
const URL_CUSTOMER = '/api/config/customerPrice/customer';

const URL_ABLE = '/api/config/customerPrice/able';
const URL_DETAIL = '/api/config/customerPrice/detail';
const URL_DELETE = '/api/config/customerPrice/delete';
const URL_REFRESH = '/api/config/customerPrice/refresh';

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, PARENT_PATH);
  return parent[parent.activeKey];
};

const changeActionCreator = (key, value) => (dispatch, getState) => {
  const {activeKey} = getSelfState(getState());
  dispatch(action.assign({[key]: value}, [activeKey, 'value']));
};

const formSearchActionCreator = (key, value) => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const {controls} = state[state.activeKey];
  let result = [], params = {maxNumber: 20, filter: value};
  switch (key) {
    case 'customerId':
    case 'balanceCompany': {
       result = getJsonResult(await fetchJson(URL_CUSTOMER, postOption(params)));
       break;
    }
  }
  const index = controls.findIndex(item => item.key === key);
  dispatch(action.update({options: result}, [state.activeKey, 'controls'], index));
};

const addActionCreator = (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const payload = buildEditDialogState(editConfig, {}, false);
  dispatch(action.assign(payload, 'edit'));
};

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

const enableActionCreator = (dispatch, getState) => ableActionCreator('enabled_type_enabled', dispatch, getState);

const disableActionCreator = (dispatch, getState) => ableActionCreator('enabled_type_disabled', dispatch, getState);

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

const importActionCreator = () => showImportDialog('customer_import');

const exportActionCreator = (dispatch,getState)=>{
  const {tableCols, tableItems} = getSelfState(getState());
  exportExcelFunc(tableCols, tableItems);
};

const refreshActionCreator = async () => {

};

const saveActionCreator = async (dispatch, getState) => {
  const state = getSelfState(getState());
  const {fileList, value} = state[state.activeKey];
  switch(state.activeKey) {
    case 'contract': {
      const params = {fileList, value};
      console.log(params)
      break;
    }
  }
};

const toolbarActions = {
  save: saveActionCreator,
  add: addActionCreator,
  edit: editActionCreator,
  enable: enableActionCreator,
  disable: disableActionCreator,
  delete: deleteActionCreator,
  import: importActionCreator,
  export: exportActionCreator,
  refresh: refreshActionCreator
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => async (dispatch, getState) => {
  const {activeKey} = getSelfState(getState());
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, [activeKey, 'items'], rowIndex));console.log(getSelfState(getState()))
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchData={}, activeKey} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchData, newState, [activeKey]);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchData={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchData, newState, [activeKey]);
};

const onTabChangeActionCreator = (key) => action.assign({activeKey: key});

const handleImgChange = (data) => async (dispatch, getState) => {
  const {activeKey} = getSelfState(getState());
  dispatch(action.assign({fileList: data.fileList}, [activeKey]));
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const {id, activeKey} = getSelfState(getState());
    const data = getJsonResult(await fetchJson(`${URL_DETAIL}/${id}`));
    dispatch(action.assign({...data}, [activeKey]));
    dispatch(action.assign({status: 'page'}));
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
  onTabChange: onTabChangeActionCreator,
  handleImgChange
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage));
export default Container;
