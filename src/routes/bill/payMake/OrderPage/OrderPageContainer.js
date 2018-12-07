import { connect } from 'react-redux';
import OrderPage from './OrderPage';
import helper,{postOption, fetchJson, showError, showSuccessMsg, convert, getJsonResult} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {showImportDialog} from '../../../../common/modeImport';
import { exportExcelFunc, commonExport } from '../../../../common/exportExcelSetting';
import {showColsSetting} from '../../../../common/tableColsSetting';
import {showConfirmDialog} from '../../../../common/showCofirmDialog';
import {getNewTableData} from '../RootContainer';

const STATE_PATH = ['payMake'];
const action = new Action(STATE_PATH);
const URL_CUSTOMER = '/api/bill/payMake/customerId';
const URL_CUSTOMER_SERVICE = '/api/bill/payMake/customerServiceId';
const URL_CARMODE = '/api/bill/payMake/carModeId';
const URL_DEPARTURE_DESTINATION = '/api/bill/payMake/departureDestination';
const URL_AUDIT_BATCH = '/api/bill/payMake/auditBatch';
const URL_PREPARING = '/api/bill/payMake/audit/preparing';
const URL_CREATE_BILL = '/api/bill/payMake/createBill';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const formSearchActionCreator = (key, filter) => async (dispatch,getState) => {
  const {filters} = getSelfState(getState());
  let result, options, params = {maxNumber: 20, filter} ;
  switch (key) {
    case 'customerId': {
      result = await fetchJson(URL_CUSTOMER, postOption(params));
      break;
    }
    case 'customerServiceId': {
      result = await fetchJson(URL_CUSTOMER_SERVICE, postOption(params));
      break;
    }
    case 'carModeId': {
      result = await fetchJson(URL_CARMODE, postOption(params));
      break;
    }
    case 'departure':
    case 'destination': {
      result = await fetchJson(URL_DEPARTURE_DESTINATION, postOption(params));
      break;
    }
    default: return;
  }
  if (result.returnCode != 0) return showError(result.returnMsg);
  options = result.result.data ? result.result.data : result.result;
  const index = filters.findIndex(item => item.key === key);
  dispatch(action.update({options}, 'filters', index));
};

const changeActionCreator = (key, value) => async (dispatch, getState) =>  {
   dispatch(action.assign({[key]: value}, 'searchData'));
};

const afterEdit = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}, tabKey, tabs2} = getSelfState(getState());
  const params = {filter: convert(searchDataBak), currentPage, pageSize, tabKey, tabs2};
  const payload = await getNewTableData(params, {isRefresh: true});
  dispatch(action.assign({...payload}));
};

const searchActionCreator = async (dispatch, getState) => {
  const {currentPage, pageSize, searchData, tabKey, tabs2} = getSelfState(getState());
  const params = {filter: convert(searchData), currentPage, pageSize, tabKey, tabs2};
  const payload = await getNewTableData(params, {
    isRefresh: true,
    searchDataBak: searchData,
    currentPage: 1
  });
  dispatch(action.assign({...payload}));
};

const resetActionCreator = action.assign({searchData: {}});

// 弹出编辑页面
const showEditPage = (dispatch, getState, item, isReadonly=false) => {
  const {tabs, editConfig} = getSelfState(getState());
  const key = item['orderNumber'];
  if (helper.isTabExist(tabs, key)) return dispatch(action.assign({activeKey: key}));
  dispatch(action.add({key, title: key}, 'tabs'));
  dispatch(action.assign({[key]: {isReadonly, editConfig, itemData: item, KEY: key}, activeKey: key}));
};

const editActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if(index === -1) return showError('请勾选一条数据！');
  showEditPage(dispatch, getState, tableItems[index]);
};

// 双击编辑
const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  showEditPage(dispatch, getState, tableItems[index]);
};

// 查看
const linkActionCreator = (key, rowIndex, item) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  showEditPage(dispatch, getState, tableItems[rowIndex], true);
};

// 整审
const auditActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkList = tableItems.filter(o=> o.checked);
  if(!checkList.length) return showError('请勾选一条数据！');
  if(checkList.find(o => o.statusType === "status_check_all_completed")) return showError('请取消已审核的记录！');
  const guids = checkList.map(o => o.guid);
  const {returnCode, returnMsg, result} = await fetchJson(URL_PREPARING, postOption(guids));
  if(returnCode !==0) return showError(returnMsg);
  const auditsFunc = async () => {
    const data = await fetchJson(URL_AUDIT_BATCH, postOption(guids));
    if (data.returnCode !== 0) return showError(data.returnMsg);
    showSuccessMsg('审核成功');
    afterEdit(dispatch, getState);
  };
  return showConfirmDialog(`${result}`, auditsFunc);
};

// 生成账单
const createBillActionCreator = (buildType) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkList = tableItems.filter(o=> o.checked);
  if(!checkList.length) return showError('请勾选一条数据！');
  const incomeList = checkList.map(o=>{
    return convert({
      amount: o.amount,
      customerDelegateCode: o.customerDelegateNumber,
      customerId: o.customerGuid,
      id: o.guid,
      incomeCode: o.balanceNumber,
      incomeType :0,
      insertTime: o.insertDate,
      logisticsOrderNumber: o.logisticsOrderGuid,
      statusType: o.statusType,
      tenantInstitutionId: o.tenantInstitutionId
    })
  });
  const { returnCode, result, returnMsg } = await fetchJson(URL_CREATE_BILL, postOption({buildType, incomeList}));
  if(returnCode !== 0) return showError(returnMsg);
  showSuccessMsg('生成账单成功！');
};

// 改单
const changeOrderActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  const item = tableItems[index];
  if (index === -1 || item.statusType !== "status_check_all_completed")  return helper.showError("请选择单条已整审信息改单！");
  alert(`跳转到改单界面！\n参数：${{value: item.guid, title: item.balanceNumber}}`);
};

const importActionCreator = async (dispatch, getState) => showImportDialog('cost_import');

// 查询导出
const exportSearchActionCreator = (dispatch, getState) => {
  const {tableCols, searchData} = getSelfState(getState());
  commonExport(tableCols, '/archiver-service/transport_order/income/search', searchData);
};

// 页面导出
const exportPageActionCreator = async (dispatch, getState) => {
  const {tableCols, tableItems} = getSelfState(getState());
  exportExcelFunc(tableCols, tableItems);
};

// 配置字段
const configActionCreator = async (dispatch, getState) => {
  const {tableCols} = getSelfState(getState());
  const okFunc = (newCols) => {
    dispatch(action.assign({tableCols: newCols}));
  };
  showColsSetting(tableCols, okFunc, 'payMake');
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchActionCreator,
  edit: editActionCreator,
  audit: auditActionCreator,
  createBill: createBillActionCreator,
  changeOrder: changeOrderActionCreator,
  import: importActionCreator,
  exportSearch: exportSearchActionCreator,
  exportPage: exportPageActionCreator,
  config: configActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else if(key.includes('createBill')) {
    return createBillActionCreator(key);
  } else {
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const pageNumberActionCreator = (currentPage) => async (dispatch, getState) => {
  const {pageSize, searchDataBak={}, tabKey, tabs2} = getSelfState(getState());
  const params = {filter: convert(searchDataBak), currentPage, pageSize, tabKey, tabs2};
  const payload = await getNewTableData(params, {currentPage});
  dispatch(action.assign({...payload}));
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}, tabKey, tabs2} = getSelfState(getState());
  const params = {filter: convert(searchDataBak), currentPage, pageSize, tabKey, tabs2};
  const payload = await getNewTableData(params, {pageSize, currentPage});
  dispatch(action.assign({...payload}));
};

// 排序和过滤
const tableChangeActionCreator = (sortInfo, filterInfo) => (dispatch) => {
  dispatch(action.assign({sortInfo, filterInfo}));
};

const tabChangeActionCreator = (key) =>  async (dispatch, getState) => {
  const {tableItems, maxRecords, currentPage, pageSize, isRefresh, tabs2Data={}, tabKey, tabs2, btns} = getSelfState(getState());
  tabs2Data[tabKey] = { tableItems, maxRecords, currentPage, pageSize };
  const buttons = btns.filter(o => o.showInTab.includes(key));
  dispatch(action.assign({tabKey: key, tabs2Data, buttons}));
  const {tabs2Data: newTabs2Data={}, tabKey: newTabKey, searchDataBak} = getSelfState(getState());
  if (isRefresh || !newTabs2Data[newTabKey]) {
    const params = {filter: convert(searchDataBak), currentPage, pageSize, tabKey: newTabKey, tabs2};
    const payload = await getNewTableData(params, {isRefresh: false, currentPage: 1});
    dispatch(action.assign({...payload}));
  } else {
    dispatch(action.assign({...newTabs2Data[newTabKey]}));
  }
};

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onSearch: formSearchActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onLink: linkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onTableChange: tableChangeActionCreator,
  onTabChange: tabChangeActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {afterEdit};
