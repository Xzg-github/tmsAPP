import { connect } from 'react-redux';
import EditPage from './EditPage';
import helper, {postOption, showError, fetchJson, getJsonResult, deepCopy, showSuccessMsg} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {EnhanceLoading} from '../../../../components/Enhance';
import {showColsSetting} from '../../../../common/tableColsSetting';
import showMutipleDialog from './MutipleDialog/MultipleDialogContainer';
import {afterEdit} from '../OrderPage/OrderPageContainer';
import execWithLoading from '../../../../standard-business/execWithLoading'


const STATE_PATH = ['receiveMake'];
const action = new Action(STATE_PATH);
const URL_DETAIL = '/api/bill/receiveMake/detail';
const URL_TOTAL = '/api/bill/receiveMake/total';
const URL_BATCH_ADD = '/api/bill/receiveMake/batchAdd';
const URL_BATCH_EDIT = '/api/bill/receiveMake/batchEdit';
const URL_BATCH_DELETE = '/api/bill/receiveMake/batchDelete';
const URL_BATCH_AUDIT = '/api/bill/receiveMake/batchAudit';
const URL_STRIKEBALANCE = '/api/bill/receiveMake/strickeBalance';
const URL_AUTO_BILLING = '/api/bill/receiveMake/autoBilling';


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
  const {activeCurrency, id, KEY} = getSelfState(getState());
  if (activeCurrency !== value) {
    const totalValues = getJsonResult(await helper.fetchJson(`${URL_TOTAL}/${id}/${value}`));
    dispatch(action.assign({activeCurrency: value, totalValues}, KEY));
  }
};

const showDialogType = async (state, type=0, isDoubleClick=false, rowIndex=0) => {
  // type: 0: 新增, 1: 复制新增, 2: 编辑, 3: 转应收
  const {customerId, receiveColsEdit, receiveItems, payColsEdit, payItems, dialogBtnsReceive, dialogBtnsPay, ...other} = state;
  let items = type === 3 ? payItems : type === 0 ? [] : receiveItems;
  isDoubleClick && (items[rowIndex]['checked'] = true);
  const checkList = items.filter(o => o.checked).map(son => ({...son, checked: false}));
  if (type > 0 && !isDoubleClick && checkList.length === 0) return showError('请勾选一条数据！');
  const titleArr = ['批量新增', '批量新增', '批量编辑', '批量转应收'];
  const newCols = type === 3 ? payColsEdit : receiveColsEdit;
  const params = {
    dialogType: type,
    title: titleArr[type],
    items: checkList,
    customerId,
    buttons: type === 3 ? dialogBtnsPay : dialogBtnsReceive,
    // SuperTable2组件里col没有hide属性控制，这里做配置字段的显隐设置
    cols: newCols.filter(o => !o.hide)
  };
  return await showMutipleDialog(params);
};

const addActionCreator = () => async (dispatch, getState) => {
  const state = deepCopy(getSelfState(getState()));
  const {KEY, id} = state;
  const resultItems = await showDialogType(state, 0);
  if (!resultItems) return;
  execWithLoading(async () => {
    const params = {id, incomeDetails: resultItems};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_ADD, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    dispatch(action.assign({receiveItems: result}, KEY));
    await afterEdit(dispatch, getState);
  });
};

const copyActionCreator = () => async (dispatch, getState) => {
  const state = deepCopy(getSelfState(getState()));
  const {KEY, id} = state;
  const resultItems = await showDialogType(state, 1);
  if (!resultItems) return;
  execWithLoading(async () => {
    const params = {id, incomeDetails: resultItems.map(o => {
      delete o.transportOrderId;
      delete o.id;
      return o;
    })};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_ADD, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    dispatch(action.assign({receiveItems: result}, KEY));
    await afterEdit(dispatch, getState);
  });
};

const editActionCreator = (isDoubleClick, rowIndex) => async (dispatch, getState) => {
  const state = deepCopy(getSelfState(getState()));
  const {KEY, id} = state;
  const resultItems = await showDialogType(state, 2, isDoubleClick, rowIndex);
  if (!resultItems) return;
  execWithLoading(async () => {
    const params = {id, incomeDetails: resultItems};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_EDIT, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    dispatch(action.assign({receiveItems: result}, KEY));
    await afterEdit(dispatch, getState);
  });
};

const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
  await editActionCreator(true, rowIndex)(dispatch, getState);
};

const delActionCreator = () => async (dispatch, getState) =>  {
  const {KEY, receiveItems} = getSelfState(getState());
  const checkList = receiveItems.filter(item => item.checked && item.statusType !== 'status_check_completed');
  if (checkList.length === 0) return showError('请勾选待审核状态的数据！');
  execWithLoading(async () => {
    const ids = checkList.map(item => item.id);
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_DELETE, postOption(ids));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    const items = receiveItems.filter(item => !ids.includes(item.id));
    dispatch(action.assign({receiveItems: items}, KEY));
    await afterEdit(dispatch, getState);
  });
};

const auditActionCreator = () => async (dispatch, getState) => {
  const {KEY, receiveItems} = getSelfState(getState());
  const checkList = receiveItems.filter(item => item.checked && item.statusType !== 'status_check_completed');
  if (checkList.length === 0) return showError('请勾选待审核状态的数据！');
  execWithLoading(async () => {
    const ids = checkList.map(item => item.id);
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_AUDIT, postOption(ids));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    const items = receiveItems.filter(item => !ids.includes(item.id));
    dispatch(action.assign({receiveItems: items}, KEY));
    await afterEdit(dispatch, getState);
  });
};

const strikeBlanceActionCreator = () => async (dispatch, getState) => {
  const {receiveItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(receiveItems);
  const item = receiveItems[index];
  if(index === -1 || (item && item.statusType !== 'status_check_completed')) return showError('请勾选一条已审核状态的数据！');
  execWithLoading(async () => {
    const {returnCode, returnMsg, result} = await fetchJson(`${URL_STRIKEBALANCE}/${item.id}`);
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    const items = receiveItems.filter(item => !ids.includes(item.id));
    dispatch(action.assign({receiveItems: items}, KEY));
    await afterEdit(dispatch, getState);
  });
};

const autoBillingActionCreator = () => async (dispatch, getState) => {
  return alert('待定！');
  // const {id, receiveItems} = getSelfState(getState());
  // const {returnCode, returnMsg, result} = await fetchJson(`${URL_AUTO_BILLING}/${id}`,postOption({id: id}));
  // if (returnCode !== 0) return showError(returnMsg);
  // showSuccessMsg(returnMsg);
  // const billItems = receiveItems.concat(result);
  // dispatch(action.assign({receiveItems: billItems}));
};

// 配置字段（应收）
const configKeyReceiveActionCreator = () => async (dispatch, getState) => {
  const {KEY, receiveCols} = getSelfState(getState());
  const okFunc = (newCols) => {
    dispatch(action.assign({receiveCols: newCols}, KEY));
  };
  showColsSetting(receiveCols, okFunc, 'receiveMake_receiveCols');
};

const convertActionCreator = () => async (dispatch, getState) => {
  const state = deepCopy(getSelfState(getState()));
  const {KEY, id} = state;
  const resultItems = await showDialogType(state, 3);
  if (!resultItems) return;
  execWithLoading(async () => {
    const params = {id, costDetailIds: resultItems.map(o => {
      delete o.transportOrderId;
      delete o.id;
      return o;
    })};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_ADD, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    dispatch(action.assign({receiveItems: result}, KEY));
    await afterEdit(dispatch, getState);
  });
};

// 配置字段（应付）
const configKeyPayActionCreator = () => async (dispatch, getState) => {
  const {KEY, payCols} = getSelfState(getState());
  const okFunc = (newCols) => {
    dispatch(action.assign({payCols: newCols}, KEY));
  };
  showColsSetting(payCols, okFunc, 'receiveMake_payCols');
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

const checkActionCreator = (isPay, isAll, checked, rowIndex) => (dispatch, getState) => {
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

const tabChangeActionCreator = (activeKey) => (dispatch, getState) => {
  const {KEY} = getSelfState(getState());
  dispatch(action.assign({activeKey}, KEY));
};

// 排序和过滤
const tableChangeActionCreator = (isPay, sortInfo, filterInfo) => (dispatch, getState) => {
  const {KEY} = getSelfState(getState());
  const path = isPay ? 'payFilterInfo' : 'receiveFilterInfo';
  dispatch(action.assign({[path]: {sortInfo, filterInfo}}, KEY));
};

const buildEditPageState = async (config, itemData, isReadonly) => {
  const data = getJsonResult(await fetchJson(`${URL_DETAIL}/${itemData.id}`));
  const {incomeDetails=[], costDetails=[], mainCurrencyType='CNY'} = data;
  const totalValues = getJsonResult(await fetchJson(`${URL_TOTAL}/${itemData.id}/${mainCurrencyType}`));
  return {
    ...config,
    ...itemData,
    receiveButtons: isReadonly ? [] : config.receiveButtons,
    payButtons: isReadonly ? [] : config.payButtons,
    activeCurrency: mainCurrencyType,
    totalValues,
    receiveItems: incomeDetails,
    payItems: costDetails,
    activeKey: 'pay',
    tabs: [
      {key: 'pay', title: '应付信息'},
      {key: 'order', title: itemData.orderNumber}
    ],
    status: 'page'
  };
};

const assignPrivilege = (payload) => {
  const actions = helper.getActions('receiveMake', true);
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