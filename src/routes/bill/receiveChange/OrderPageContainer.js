import {connect} from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {Action} from "../../../action-reducer/action";
import {getPathValue} from "../../../action-reducer/helper";
import helper, {deepCopy, fetchJson, getObject, postOption, showError} from "../../../common/common";
import {search2} from '../../../common/search';
import {commonExport, exportExcelFunc} from "../../../common/exportExcelSetting";
import {showColsSetting} from "../../../common/tableColsSetting";
import {toFormValue} from "../../../common/check";
import showFilterSortDialog from "../../../common/filtersSort";


const STATE_PATH = ['receiveChange'];
const action = new Action(STATE_PATH);

const URL_CUSTOMER = '/api/bill/receive_change/customerId';
const URL_USER = '/api/bill/receive_change/customerServiceId';
const URL_LIST = '/api/bill/receive_change/list';
const URL_REVOKE = '/api/bill/receive_change/revoke';
const URL_DELETE = '/api/bill/receive_change/delete';
const URL_DETAIL = '/api/bill/receive_change/detail';
const URL_CHECK = '/api/bill/receive_change/check';

const getSelfState = (rootstate) => {
  return getPathValue(rootstate, STATE_PATH);
};

const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak))
};

const closeTab = (tabs, activeKey, dispatch) => {
  let index = tabs.findIndex(tab => tab.key === activeKey);
  const newTabs = tabs.filter(tab => tab.key !== activeKey);
  (newTabs.length === index) && (index--);
  dispatch(action.assign({tabs: newTabs, [activeKey]: undefined, activeKey: newTabs[index].key}));
};

const afterEditAction = () => (dispatch, getState) => {
  const {tabs, activeKey} = getSelfState(getState());
  closeTab(tabs, activeKey, dispatch);
  return updateTable(dispatch, getState);
};

const resetActionCreator = (dispatch) => {
  dispatch(action.assign({searchData: {}}));
};

const searchActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState, undefined, false);
};

const sortActionCreator = async (dispatch, getState) => {
  const {filters} = getSelfState(getState());
  const newFilters = await showFilterSortDialog(filters, helper.getRouteKey());
  newFilters && dispatch(action.assign({filters: newFilters}));
};

// 查询导出
const exportSearchActionCreator = (dispatch, getState) => {
  const {tableCols, searchData} = getSelfState(getState());
  return commonExport(tableCols, '/tms-service/renewal/0/search', searchData);
};

// 页面导出
const exportPageActionCreator = async (dispatch, getState) => {
  const {tableCols, tableItems} = getSelfState(getState());
  return exportExcelFunc(tableCols, tableItems);
};

// 配置字段
const configActionCreator = async (dispatch, getState) => {
  const {tableCols} = getSelfState(getState());
  const okFunc = (newCols) => {
    dispatch(action.assign({tableCols: newCols}));
  };
  showColsSetting(tableCols, okFunc, 'receiveChange');
};

//撤销提交
const revokeActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const idList = tableItems.reduce((result, item) => {
    item.checked &&
    (item.statusType === 'status_submit_completed' || item.statusType === 'status_check_not_passed' ) &&
    result.push(item.id);
    return result;
  }, []);
  if (idList.length && idList.length === tableItems.filter(item => item.checked).length) {
    const {returnCode, returnMsg} = await fetchJson(URL_REVOKE, postOption(idList));
    return returnCode === 0 ? updateTable(dispatch, getState) : showError(returnMsg);
  }else {
    return showError('请选择已提交或审核不通过状态的记录!');
  }
};

//删除
const deleteActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const idList = tableItems.reduce((result, item) => {
    item.checked && item.statusType === 'status_submit_awaiting' && result.push(item.id);
    return result;
  }, []);
  if (idList.length === tableItems.filter(item => item.checked).length) {
    const {returnCode, returnMsg} = await fetchJson(URL_DELETE, postOption(idList));
    return returnCode === 0 ? updateTable(dispatch, getState) : showError(returnMsg);
  }else {
    return showError('请选择待提交状态的记录!');
  }
};

//新增普通改单
const addActionCreator =(renewalMode = 'renewal_mode_001') => (dispatch, getState) => {
  const {editConfig, tabs} = getSelfState(getState());
  const newTabs = tabs.find(tab => tab.key === 'add') ? tabs : tabs.concat([{key: 'add', title: '新增'}]);
  dispatch(action.assign({['add']: {...editConfig, value: {renewalMode}}, activeKey: 'add', tabs: newTabs}));
};

const addTaxActionCreator = addActionCreator('renewal_mode_002');

const addNetActionCreator = addActionCreator('renewal_mode_003');

const convertResultToValue = (result) => {
  const {details, from=0, to=0, title} = result;
  const pos = to - from ;
   const tableItems = details.map((item, index) => {
    return index < pos ? Object.assign(item, {readonly: true}) : item;
  });
  return Object.assign({}, title, {['costInfo']: tableItems});
};

const showEditPage = async (dispatch, getState, checkedItem, isReadOnly = false) => {
  const {editConfig, tabs} = getSelfState(getState());
  const {returnCode, returnMsg, result} = await fetchJson(`${URL_DETAIL}/${checkedItem.id}`);
  if (returnCode !== 0) return showError(returnMsg);
  const value = Object.assign(convertResultToValue(result), {balanceId: checkedItem.customerId});
  const editTabKey = `edit_${checkedItem['renewalNumber']}`;
  const newTabs = tabs.find(tab => tab.key === editTabKey) ? tabs : tabs.concat([{key: editTabKey, title: checkedItem.renewalNumber}]);
  const readOnlyConfig = deepCopy(editConfig);
  const edit = deepCopy(editConfig);
  edit.controls[0].data.forEach(item => {
    if (item.key === 'transportOrderId') {
      item.type = 'readonly';
    }
  });
  if (isReadOnly) {
    readOnlyConfig.controls.forEach( control => {
      control.data.forEach(item => item.type = 'readonly');
    });
    readOnlyConfig.tables.forEach(table => {
      table.cols.forEach(col => {
        if(!['checked', 'index'].includes(col.key)){
          col.type = 'readonly';
        }
      });
    });
  }
  const config = isReadOnly ? readOnlyConfig : edit;
  dispatch(action.assign({[editTabKey]:{...config, value, isReadOnly}, activeKey: editTabKey, tabs: newTabs}));
};

const editActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItem = tableItems.reduce((result, item) => {
    item.checked && item.statusType === 'status_submit_awaiting' && result.push(item);
    return result;
  }, []);
  return checkedItem.length === 1 ? showEditPage(dispatch, getState, checkedItem[0]) : showError('请选择一条待提交的记录!');
};

const showAuditPage = async (dispatch, getState, checkedItem) => {
  const {editConfig, tabs} = getSelfState(getState());
  const {returnCode, returnMsg, result} = await fetchJson(`${URL_CHECK}/${checkedItem.id}`);
  if (returnCode !== 0) return showError(returnMsg);
  const value = Object.assign(convertResultToValue(result), {balanceId: checkedItem.customerId});
  const editTabKey = `edit_${checkedItem['renewalNumber']}`;
  const newTabs = tabs.find(tab => tab.key === editTabKey) ? tabs : tabs.concat([{key: editTabKey, title: checkedItem.renewalNumber}]);
  const readOnlyConfig = deepCopy(editConfig);
  readOnlyConfig.controls.forEach( control => {
    control.data.forEach(item => item.type = 'readonly');
  });
  readOnlyConfig.tables.forEach(table => {
    table.cols.forEach(col => {
      if(!['checked', 'index'].includes(col.key)){
        col.type = 'readonly';
      }
    });
  });
  dispatch(action.assign({[editTabKey]:{...readOnlyConfig, value, isAudit: true, isReadOnly: true}, activeKey: editTabKey, tabs: newTabs}));
};

const auditingActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItem = tableItems.reduce((result, item) => {
    item.checked && item.statusType === 'status_submit_completed' && result.push(item);
    return result;
  }, []);
  return checkedItem.length === 1 ? showAuditPage(dispatch, getState, checkedItem[0]) : showError('请选择一条已提交的记录!');
};

const toolbarActions = {
  sort: sortActionCreator,
  reset: resetActionCreator,
  search: searchActionCreator,
  exportSearch: exportSearchActionCreator,
  exportPage: exportPageActionCreator,
  config: configActionCreator,
  revoke: revokeActionCreator,
  delete: deleteActionCreator,
  add: addActionCreator(),
  addTax: addTaxActionCreator,
  addNet: addNetActionCreator,
  edit: editActionCreator,
  auditing: auditingActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)){
    return toolbarActions[key];
  } else {
    console.log('unknow key:', key);
    return {type: 'unknown'};
  }
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
  const {filters} = getSelfState(getState());
  let result, options, params = {maxNumber: 20, filter: title} ;
  switch (key) {
    case 'customerId': {
      result = await fetchJson(URL_CUSTOMER, postOption(params));
      break;
    }
    case 'customerServiceId' : {
      result = await fetchJson(URL_USER, postOption(params));
      break;
    }
    default:
      return;
  }
  if (result.returnCode !== 0) return showError(result.returnMsg);
  options = result.result.data ? result.result.data : result.result;
  const index = filters.findIndex(item => item.key === key);
  dispatch(action.update({options}, 'filters', index));
};

const changeActionCreator = (key, value) => action.assign({[key]: value}, 'searchData');

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState, undefined, false);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState, undefined, false);
};

const linkActionCreator = (key, rowIndex, item) => async (dispatch, getState) => {
  return showEditPage(dispatch, getState, item, true);
};

const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  return tableItems[index].statusType === 'status_submit_awaiting'
    ? showEditPage(dispatch, getState, tableItems[index])
    : showEditPage(dispatch, getState, tableItems[index], true);
};

// 排序和过滤
const tableChangeActionCreator = (sortInfo, filterInfo) => (dispatch) => {
  dispatch(action.assign({sortInfo, filterInfo}));
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const actionCreators = {
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onCheck: checkActionCreator,
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onClick: clickActionCreator,
  onLink: linkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onTableChange: tableChangeActionCreator
};

export default connect(mapStateToProps, actionCreators)(OrderPage);
export {afterEditAction, updateTable};
