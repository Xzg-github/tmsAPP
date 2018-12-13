import { connect } from 'react-redux';
import EditPage from './EditPage';
import helper, {postOption, showError, fetchJson, getJsonResult, deepCopy, showSuccessMsg, fuzzySearchEx} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {EnhanceLoading} from '../../../../components/Enhance';
import {showColsSetting} from '../../../../common/tableColsSetting';
import showMutipleDialog from '../../receiveMake/EditPage/MutipleDialog/MultipleDialogContainer';
import {afterEdit} from '../OrderPage/OrderPageContainer';
import execWithLoading from '../../../../standard-business/execWithLoading';
import {updateOne} from '../../../../action-reducer/array';

const PARENT_STATE_PATH = ['receiveBill'];
const STATE_PATH = ['receiveBill', 'edit'];
const action = new Action(STATE_PATH);
const URL_DETAIL = '/api/bill/receiveBill/detail';

const URL_TOTAL = '/api/bill/receiveBill/total';
const URL_BATCH_ADD = '/api/bill/receiveBill/batchAdd';
const URL_BATCH_EDIT = '/api/bill/receiveBill/batchEdit';
const URL_BATCH_DELETE = '/api/bill/receiveBill/batchDelete';
const URL_BATCH_AUDIT = '/api/bill/receiveBill/batchAudit';
const URL_STRIKEBALANCE = '/api/bill/receiveBill/strikeBalance';
const URL_AUTO_BILLING = '/api/bill/receiveBill/autoBilling';
const URL_CURRENCY = `/api/bill/receiveMake/currency`;
const URL_CONTACTS = `/api/bill/receiveBill/cunstomer_contacts`;
const URL_HEADER_INDO = `/api/bill/receiveBill/consignee_consignor`;


const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, PARENT_STATE_PATH);
  return parent[parent.activeKey];
};

const changeActionCreator = (key, value) => async (dispatch, getState) =>  {
  dispatch(action.assign({[key]: value}, 'value'));
};

const formSearchActionCreator = (KEY, key, filter, control) => async (dispatch, getState) => {
  const {controls, value} = getSelfState(getState());
  const customerId = value['payCustomerId'].value;
  let result;
  if (control.searchType) {
    result = getJsonResult(await fuzzySearchEx(filter, control));
  } else {
    switch (key) {
      case 'currency': {
        result = getJsonResult(await fetchJson(URL_CURRENCY, postOption({currencyTypeCode: filter, maxNumber: 65536})));
        break;
      }
      case 'customerContact': {
        result = getJsonResult(await fetchJson(URL_CONTACTS, postOption({customerId})));
        break;
      }
      case 'customerHeaderInformation': {
        result = getJsonResult(await fetchJson(URL_HEADER_INDO, postOption({customerId, name: filter})));
        break;
      }
    }
  }
  const options = result.data ? result.data : result;
  const controlsIndex = controls.findIndex(o => o.key === KEY);
  const index = controls[controlsIndex].data.findIndex(item => item.key === key);
  const data = updateOne(controls[controlsIndex].data, index, {options});
  dispatch(action.update({data}, ['controls'], controlsIndex));
};

const onContentChangeActionCreator = (KEY, key, value) => async (dispatch, getState) =>  {
  dispatch(action.update({[key]: value}, ['items', KEY]));
};





const currencyChangeActionCreator = (value, isRefresh=false) => async (dispatch, getState) => {
  const {activeCurrency, id} = getSelfState(getState());
  if (activeCurrency !== value || isRefresh) {
    const totalValues = getJsonResult(await helper.fetchJson(`${URL_TOTAL}/${id}/${value}`));
    dispatch(action.assign({activeCurrency: value, totalValues}));
  }
};

const showDialogType = async (state, type=0, isDoubleClick=false, rowIndex=0) => {
  // type: 0: 新增, 1: 复制新增, 2: 编辑
  const {supplierId, payColsEdit, payItems, dialogBtnsPay, activeCurrency} = state;
  let items = type === 0 ? [] : payItems;
  isDoubleClick && (items[rowIndex]['checked'] = true);
  const checkList = items.filter(o => o.checked).map(son => ({...son, checked: false}));
  if (type > 0 && !isDoubleClick && checkList.length === 0) return showError('请勾选一条数据！');
  const titleArr = ['批量新增', '批量新增', '批量编辑'];
  const params = {
    configKey: 'receiveBill_payColsEdit',
    activeCurrency,
    dialogType: type,
    title: titleArr[type],
    items: checkList,
    supplierId,
    buttons: dialogBtnsPay,
    cols: payColsEdit
  };
  return await showMutipleDialog(params);
};

const addActionCreator = () => async (dispatch, getState) => {
  const state = deepCopy(getSelfState(getState()));
  const resultItems = await showDialogType(state, 0);
  if (!resultItems) return;
  execWithLoading(async () => {
    const params = {id: state.id, costDetails: resultItems};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_ADD, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    dispatch(action.assign({payItems: result}));
    currencyChangeActionCreator(state.activeCurrency, true)(dispatch, getState);
    await afterEdit(dispatch, getState);
  });
};

const copyActionCreator = () => async (dispatch, getState) => {
  const state = deepCopy(getSelfState(getState()));
  const resultItems = await showDialogType(state, 1);
  if (!resultItems) return;
  execWithLoading(async () => {
    const params = {id: state.id, costDetails: resultItems.map(o => {
      delete o.transportOrderId;
      delete o.id;
      return o;
    })};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_ADD, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    dispatch(action.assign({payItems: result}));
    currencyChangeActionCreator(state.activeCurrency, true)(dispatch, getState);
    await afterEdit(dispatch, getState);
  });
};

const editActionCreator = (isDoubleClick, rowIndex) => async (dispatch, getState) => {
  const state = deepCopy(getSelfState(getState()));
  const resultItems = await showDialogType(state, 2, isDoubleClick, rowIndex);
  if (!resultItems) return;
  execWithLoading(async () => {
    const params = {id: state.id, costDetails: resultItems};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_EDIT, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    dispatch(action.assign({payItems: result}));
    currencyChangeActionCreator(state.activeCurrency, true)(dispatch, getState);
    await afterEdit(dispatch, getState);
  });
};

const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
  await editActionCreator(true, rowIndex)(dispatch, getState);
};

const delActionCreator = () => async (dispatch, getState) =>  {
  const {payItems, activeCurrency} = getSelfState(getState());
  const checkList = payItems.filter(item => item.checked && item.statusType !== 'status_check_completed');
  if (checkList.length === 0) return showError('请勾选待审核状态的数据！');
  execWithLoading(async () => {
    const ids = checkList.map(item => item.id);
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_DELETE, postOption(ids));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    const items = payItems.filter(item => !ids.includes(item.id));
    dispatch(action.assign({payItems: items}));
    currencyChangeActionCreator(activeCurrency, true)(dispatch, getState);
    await afterEdit(dispatch, getState);
  });
};

const auditActionCreator = () => async (dispatch, getState) => {
  const {payItems} = getSelfState(getState());
  const checkList = payItems.filter(item => item.checked && item.statusType !== 'status_check_completed');
  if (checkList.length === 0) return showError('请勾选待审核状态的数据！');
  execWithLoading(async () => {
    const ids = checkList.map(item => item.id);
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_BATCH_AUDIT, postOption(ids));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    dispatch(action.assign({payItems: result}));
    await afterEdit(dispatch, getState);
  });
};

const strikeBlanceActionCreator = () => async (dispatch, getState) => {
  const {payItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(payItems);
  const item = payItems[index];
  if(index === -1 || (item && item.statusType !== 'status_check_completed')) return showError('请勾选一条已审核状态的数据！');
  execWithLoading(async () => {
    const {returnCode, returnMsg, result} = await fetchJson(`${URL_STRIKEBALANCE}/${item.id}`, 'post');
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    dispatch(action.assign({payItems: result}));
    await afterEdit(dispatch, getState);
  });
};

const autoBillingActionCreator = () => async (dispatch, getState) => {
  return alert('待定！');
  // const {id, payItems, activeCurrency} = getSelfState(getState());
  // const {returnCode, returnMsg, result} = await fetchJson(`${URL_AUTO_BILLING}/${id}`,postOption({id: id}));
  // if (returnCode !== 0) return showError(returnMsg);
  // showSuccessMsg(returnMsg);
  // const billItems = payItems.concat(result);
  // dispatch(action.assign({payItems: billItems}));
  // currencyChangeActionCreator(activeCurrency, true)(dispatch, getState);
};

// 配置字段（应付）
const configKeyPayActionCreator = () => async (dispatch, getState) => {
  const {payCols} = getSelfState(getState());
  const okFunc = (newCols) => {
    dispatch(action.assign({payCols: newCols}));
  };
  showColsSetting(payCols, okFunc, 'receiveBill_payCols');
};

const buttons = {
  edit_add: addActionCreator,
  edit_copy: copyActionCreator,
  edit_edit: editActionCreator,
  edit_del: delActionCreator,
  edit_audit: auditActionCreator,
  edit_strikeBlance: strikeBlanceActionCreator,
  edit_autoBilling: autoBillingActionCreator,
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

const checkActionCreator = (KEY, rowIndex, key, checked) => (dispatch, getState) => {
  dispatch(action.update({checked}, ['items', KEY], rowIndex));
};

const buildEditPageState = async (config, itemData, readonly) => {
  const detailData = getJsonResult(await fetchJson(`${URL_DETAIL}/${itemData.id}`));
  const {receivableBillChargeList: costInfo, ...formValue} = detailData;
  return {
    ...config,
    ...itemData,
    readonly,
    value: {...formValue, costInfo, orderNumber: itemData.orderNumber},
    status: 'page'
  };
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    const {readonly, config, itemData} = getSelfState(getState());
    dispatch(action.assign({status: 'loading'}));
    const payload = await buildEditPageState(config, itemData, readonly);
    dispatch(action.assign(payload));
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
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onContentChange: onContentChangeActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage));
export default Container;
