import {connect} from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import helper, {getObject, fetchJson, postOption, showError, showSuccessMsg, getJsonResult} from '../../../common/common';
import {search2} from '../../../common/search';
import {showImportDialog} from '../../../common/modeImport';
import {exportExcelFunc, commonExport} from '../../../common/exportExcelSetting';
import {showColsSetting} from '../../../common/tableColsSetting';
import {toFormValue} from "../../../common/check";

const STATE_PATH = ['customerPrice'];
const URL_LIST = '/api/config/customerPrice/list';
const URL_CUSTOMER = '/api/config/customerPrice/customer';
const URL_USER = '/api/config/customerPrice/user';

const URL_ABLE = '/api/config/customerPrice/able';
const URL_SALEMEN = '/api/config/customerPrice/salemen';
const URL_DETAIL = '/api/config/customerPrice/detail';
const URL_DELETE = '/api/config/customerPrice/delete';

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

// const buildEditPageState = (config={}, data, edit) => {
//   const EDIT_DIALOG = ['config', 'size', 'controls'];
//   return {
//     edit,
//     ...getObject(config, EDIT_DIALOG),
//     title: edit ? config.edit : config.add,
//     value: helper.getObjectExclude(data, ['checked']),
//     options: {}
//   };
// };

// const updateTable = async (dispatch, getState) => {
//   const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
//   return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak))
// };

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
  let result;
  switch (key) {
    case 'customerId':
    case 'balanceCompany': {
       result = getJsonResult(await fetchJson(URL_CUSTOMER, postOption({maxNumber: 20, filter: value})));
       break;
    }
    case 'insertUser': {
      result = getJsonResult(await fetchJson(URL_USER, postOption({maxNumber: 20, filter: value})));
      break;
   }
  }
  const options = result.data ? result.data : result;
  const index = filters.findIndex(item => item.key === key);
  dispatch(action.update({options}, 'filters', index));
};

const addActionCreator = (dispatch, getState) => {
  // const {editConfig} = getSelfState(getState());
  // const payload = buildEditDialogState(editConfig, {}, false);
  // dispatch(action.assign(payload, 'edit'));
};

const editAction = async (isDbClick, dispatch, getState, rowIndex=0) => {
  // const {tableItems, editConfig, customConfig} = getSelfState(getState());
  // const index = isDbClick ? rowIndex : helper.findOnlyCheckedIndex(tableItems);
  // if (index === -1) return showError('请勾选一条数据！');
  // // if(tableItems[index]['enabledType'] !== 'enabled_type_unenabled'){
  // //   return showError('只能编辑未启用状态记录');
  // // }
  // const id = tableItems[index].id;
  // const {returnCode, returnMsg, result} = await fetchJson(`${URL_DETAIL}/${id}`);
  // if (returnCode !== 0) return showError(returnMsg);
  // if (customConfig.controls && customConfig.controls.length > 0) {
  //   editConfig.controls.push({
  //     key: 'otherInfo', title: '其他信息', data: customConfig.controls
  //   });
  // }
  // const payload = buildEditDialogState(editConfig, result, true);
  // dispatch(action.assign(payload, 'edit'));
};

// 编辑
const editActionCreator = async (dispatch, getState) => {
  // editAction(false, dispatch, getState);
};
const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
  // editAction(true, dispatch, getState, rowIndex);
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

const toolbarActions = {
  reset: resetActionCreator,
  search: searchActionCreator,
  add: addActionCreator,
  edit: editActionCreator,
  // enable: enableActionCreator,
  // disable: disableActionCreator,
  delete: deleteActionCreator,
  import: importActionCreator,
};

const clickActionCreator = (key) => {
  // const k = key.split('_')[1] || key;
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
// const afterEditActionCreator = (isOk=false ,dispatch, getState) => {
//   dispatch(action.assign({edit: undefined}));
//   isOk && searchActionCreator(dispatch, getState);
// };

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
// export {afterEditActionCreator, updateTable};
