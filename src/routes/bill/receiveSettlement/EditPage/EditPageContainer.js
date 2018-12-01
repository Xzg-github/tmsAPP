import { connect } from 'react-redux';
import EditPage from './EditPage';
import helper, {postOption, showError, fetchJson, getJsonResult, getObject, deepCopy, showSuccessMsg} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {EnhanceLoading} from '../../../../components/Enhance';
import {showColsSetting} from '../../../../common/tableColsSetting';
import showMutipleDialog from './MutipleDialog/MultipleDialogContainer';
import {afterEdit} from '../OrderPage/OrderPageContainer';
import execWithLoading from '../../../../standard-business/execWithLoading'


const STATE_PATH = ['receiveSettlement'];
const action = new Action(STATE_PATH);
const URL_DETAIL = '/api/bill/receiveSettlement/detail';
const URL_TOTAL = '/api/bill/receiveSettlement/total';
const URL_BATCH_ADD = '/api/bill/receiveSettlement/batchAdd';
const URL_BATCH_EDIT = '/api/bill/receiveSettlement/batchEdit';
const URL_BATCH_DELETE = '/api/bill/receiveSettlement/batchDelete';
const URL_BATCH_AUDIT = '/api/bill/receiveSettlement/batchAudit';
const URL_STRIKEBALANCE = '/api/bill/receiveSettlement/strickeBalance';
const URL_AUTO_BILLING = '/api/bill/receiveSettlement/autoBilling';


const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, STATE_PATH);
  return parent[parent.activeKey];
};

// const calTotal = (items) => {
//   return items.reduce((result, item) => {
//     const {amount=0, netAmount=0, exchangeRate=1} = item;
//     result.net += netAmount * exchangeRate;
//     result.tax += amount * exchangeRate;
//     return result;
//   }, {net: 0, tax: 0});
// };

const currencyChangeActionCreator = (value) => async (dispatch, getState) => {
  const {activeCurrency, guid, KEY} = getSelfState(getState());
  if (activeCurrency !== value) {
    const totalValues = getJsonResult(await helper.fetchJson(`${URL_TOTAL}/${guid}/${value}`));
    dispatch(action.assign({activeCurrency: value, totalValues}, KEY));
  }
};

const showDialogType = async (state, type=0, isDoubleClick=false) => {
  // type: 0: 新增, 1: 复制新增, 2: 编辑, 3: 转应收
  const {customerGuid, receiveColsEdit, receiveItems, payColsEdit, payItems, dialogBtnsReceive, dialogBtnsPay, ...other} = state;
  const items = type === 0 ? [] : type === 3 ? payItems : receiveItems;
  const checkList = items.filter(o => o.checked).map(son => ({
    ...son,
    checked: false,
    serviceName: son.serviceCode.title,
    businessName: son.businessCode.title
  }));
  if (type > 0 && !isDoubleClick && checkList.length === 0) return showError('请勾选一条数据！');
  const titleArr = ['批量新增', '批量新增', '批量编辑', '批量转应收'];
  const params = {
    dialogType: type,
    title: titleArr[type],
    items: checkList,
    defaultBalanceCompany: customerGuid,
    buttons: type === 3 ? dialogBtnsPay : dialogBtnsReceive,
    cols: type === 3 ? payColsEdit : receiveColsEdit
  };
  return await showMutipleDialog(params);
};

const addActionCreator = () => async (dispatch, getState) => {
  const state = deepCopy(getSelfState(getState()));
  const {KEY, guid, activeCurrency} = state;
  const resultItems = await showDialogType(state, 0);
  if (!resultItems) return;
  execWithLoading(async () => {
    const params = {guid, incomeDetailLists: resultItems};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_ADD, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    dispatch(action.assign({receiveItems: result}, KEY));
    currencyChangeActionCreator(activeCurrency)(dispatch, getState);
    await afterEdit(dispatch, getState);
  });
};

const copyActionCreator = () => async (dispatch, getState) => {
  const state = deepCopy(getSelfState(getState()));
  const {KEY, guid, activeCurrency} = state;
  const resultItems = await showDialogType(state, 1);
  if (!resultItems) return;
  execWithLoading(async () => {
    const params = {guid, incomeDetailLists: resultItems};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_ADD, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    dispatch(action.assign({receiveItems: result}, KEY));
    currencyChangeActionCreator(activeCurrency)(dispatch, getState);
    await afterEdit(dispatch, getState);
  });
};

const editActionCreator = (isDoubleClick) => async (dispatch, getState) => {
  const state = deepCopy(getSelfState(getState()));
  const {KEY, guid, activeCurrency} = state;
  const resultItems = await showDialogType(state, 2, isDoubleClick);
  if (!resultItems) return;
  execWithLoading(async () => {
    const params = {guid, incomeDetailLists: resultItems};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_EDIT, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    dispatch(action.assign({receiveItems: result}, KEY));
    currencyChangeActionCreator(activeCurrency)(dispatch, getState);
    await afterEdit(dispatch, getState);
  });
};

const doubleClickActionCreator = () => async (dispatch, getState) => {
  await editActionCreator(true)(dispatch, getState);
};

const delActionCreator = () => async (dispatch, getState) =>  {
  const {KEY, receiveItems, guid, activeCurrency} = getSelfState(getState());
  const checkList = receiveItems.filter(item => item.checked && item.statusType !== 'status_check_completed');
  if (checkList.length === 0) return showError('请勾选待审核状态的数据！');
  execWithLoading(async () => {
    const ids = checkList.map(item => item.guid);
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_DELETE, postOption(ids));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    const items = receiveItems.filter(item => !ids.includes(item.guid));
    dispatch(action.assign({receiveItems: items}, KEY));
    currencyChangeActionCreator(activeCurrency)(dispatch, getState);
    await afterEdit(dispatch, getState);
  });
};

const auditActionCreator = () => async (dispatch, getState) => {
  const {KEY, receiveItems} = getSelfState(getState());
  const checkList = receiveItems.filter(item => item.checked && item.statusType !== 'status_check_completed');
  if (checkList.length === 0) return showError('请勾选待审核状态的数据！');
  const ids = checkList.map(item => item.guid);
  const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_AUDIT, postOption(ids));
  if (returnCode !== 0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  // dispatch(action.assign({receiveItems: []}, KEY));
};

const strikeBlanceActionCreator = () => async (dispatch, getState) => {
  const {receiveItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(receiveItems);
  if(index === -1 || item.statusType !== 'status_check_completed') return showError('请勾选一条已审核状态的数据！');
  const item = receiveItems[0];
  const {returnCode, returnMsg, result} = await fetchJson(`${URL_STRIKEBALANCE}/${item.guid}`);
  if (returnCode !== 0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  // dispatch(action.assign({receiveItems: result}));
};

const autoBillingActionCreator = () => async (dispatch, getState) => {
  return alert('待定！');
  const {guid, receiveItems} = getSelfState(getState());
  const {returnCode, returnMsg, result} = await helper.fetchJson(`${URL_AUTO_BILLING}/${guid}`,helper.postOption({id: guid}));
  if (returnCode !== 0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  const billItems = receiveItems.concat(result);
  dispatch(action.assign({receiveItems: billItems}));
};

// 配置字段（应收）
const configKeyReceiveActionCreator = () => async (dispatch, getState) => {
  const {receiveCols} = getSelfState(getState());
  const okFunc = (newCols) => {
    dispatch(action.assign({receiveCols: newCols}));
  };
  showColsSetting(receiveCols, okFunc, 'bill_receiveSettlement_receiveCols');
};

const convertActionCreator = () => async (dispatch, getState) => {
  const state = deepCopy(getSelfState(getState()));
  const {KEY, guid, activeCurrency} = state;
  const resultItems = await showDialogType(state, 3);
  if (!resultItems) return;
  execWithLoading(async () => {
    const params = {guid, costDetailIds: resultItems};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_ADD, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    dispatch(action.assign({receiveItems: result}, KEY));
    currencyChangeActionCreator(activeCurrency)(dispatch, getState);
    await afterEdit(dispatch, getState);
  });
};

// 配置字段（应付）
const configKeyPayActionCreator = () => async (dispatch, getState) => {
  const {payCols} = getSelfState(getState());
  const okFunc = (newCols) => {
    dispatch(action.assign({payCols: newCols}));
  };
  showColsSetting(payCols, okFunc, 'bill_receiveSettlement_payCols');
};

const buttons = {
  edit_add: addActionCreator,
  edit_copy: copyActionCreator,
  edit_edit: editActionCreator,
  edit_del: delActionCreator,
  edit_audit: auditActionCreator,
  edit_strikeBlance: strikeBlanceActionCreator,
  edit_autoBilling: autoBillingActionCreator,
  edit_configKeys_receive: configKeyReceiveActionCreator,
  convert: convertActionCreator,
  edit_configKeys_pay: configKeyPayActionCreator,
};

const clickActionCreator = (key) => {
  if (buttons.hasOwnProperty(key)) {
    return buttons[key]();
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isPay, isAll, checked, rowIndex) =>(dispatch,getState)=> {
  const path = isPay ? 'payItems' : 'receiveItems';
  let {payItems, KEY} = getSelfState(getState());
  isAll && (rowIndex = -1);
  if (isPay) {
    if ((isAll && payItems.find(o => o.isTransferReceivables == "true_false_type_true")) ||
      (!isAll && payItems[rowIndex].isTransferReceivables == "true_false_type_true")) {
      return showError("所选数据中有已转应付的数据！");
    }
  }
  dispatch(action.update({checked}, [KEY, path], rowIndex));
};

const tabChangeActionCreator = (activeKey) => action.assign({activeKey});

// 排序和过滤
const tableChangeActionCreator = (isPay, sortInfo, filterInfo) => (dispatch) => {
  const {KEY} = getSelfState(getState());
  const path = isPay ? 'payFilterInfo' : 'receiveFilterInfo';
  dispatch(action.assign({[path]: {sortInfo, filterInfo}}, KEY));
};

const buildEditPageState = async (config, itemData, isReadonly) => {
  const data = getJsonResult(await fetchJson(`${URL_DETAIL}/${itemData.guid}`));
  const {incomeDetailList=[], costDetailList=[], mainCurrencyType='CNY'} = data;
  const totalValues = getJsonResult(await fetchJson(`${URL_TOTAL}/${itemData.guid}/${mainCurrencyType}`));
  if (isReadonly) {
    config.payCols = deepCopy(config.payCols).map(o => {
      o.type = 'readonly';
    });
  }
  return {
    ...config,
    ...itemData,
    activeCurrency: mainCurrencyType,
    totalValues,
    receiveItems: incomeDetailList,
    payItems: costDetailList,
    activeKey: 'pay',
    tabs: [
      {key: 'pay', title: '应付信息'},
      // order.tabs[0],
    ],
    status: 'page'
  };
};

const assignPrivilege = (payload) => {
  const actions = helper.getActions('receiveSettlement', true);
  if (actions.length > 0) {
    payload.receiveButtons = payload.receiveButtons.filter(({key}) => actions.includes(key));
  }
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    const {isReadonly, editConfig, itemData, KEY} = getSelfState(getState());
    dispatch(action.assign({status: 'loading'}, KEY));
    const payload = await buildEditPageState(editConfig, itemData, isReadonly);
    assignPrivilege(payload);
    dispatch(action.assign(payload, KEY));
  } catch (e) {
    showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onInit: initActionCreator,
  onCheck: checkActionCreator,
  onClick: clickActionCreator,
  onCurrencyChange: currencyChangeActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onTabChange: tabChangeActionCreator,
  onTableChange: tableChangeActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage));
export default Container;
