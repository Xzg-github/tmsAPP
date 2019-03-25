import {connect} from 'react-redux';
import EditPage from './EditPage';
import {Action} from "../../../action-reducer/action";
import {getPathValue} from "../../../action-reducer/helper";
import helper,{deepCopy, fetchJson, getJsonResult, getObject, getObjectExclude, postOption, showError} from "../../../common/common";
import {updateOne} from "../../../action-reducer/array";
import {fetchDictionary} from "../../../common/dictionary";
import {afterEditAction, updateTable} from './OrderPageContainer';
import {showAuditNoDialog} from "./AuditNoDialog";

const STATE_PATH = ['payChange', 'edit'];
const STATE_PARENT_PATH = ['payChange'];
const action = new Action(STATE_PATH);
let CURRENT_KEY;

const URL_TRANSPORTORDER = '/api/bill/pay_change/searchTransportOrderNum';
const URL_CUSTOMER = '/api/bill/payMake/supplierId';
const URL_CHARGE_NAME = '/api/bill/receiveMake/chargeItemId';
const URL_TRANSINFO = '/api/bill/pay_change/transportInfo';
const URL_ADDSAVE = '/api/bill/pay_change/addSave';
const URL_EDITSAVE = '/api/bill/pay_change/editSave';
const URL_COMMIT =  '/api/bill/pay_change/commit';
const URL_AUDIT = '/api/bill/pay_change/audit';
const URL_REJECT = '/api/bill/pay_change/reject';
const URL_CURRENCY = '/api/bill/pay_change/mainCurrency';
const URL_TAX = '/api/bill/pay_change/tax';
const URL_NET = '/api/bill/pay_change/net';

const getSelfState = (rootstate) => {
  const parentState = getPathValue(rootstate, STATE_PARENT_PATH);
  CURRENT_KEY = parentState.activeKey;
  return parentState[CURRENT_KEY];
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

//表单onSearch事件 运单号
const formSearchActionCreator = (formKey, key, filter) => async(dispatch, getState) => {
  const {controls} = getSelfState(getState());
  const params = { maxNumber: 65536, filter };
  const {result, returnCode, returnMsg} = await fetchJson(URL_TRANSPORTORDER, postOption(params));
  if (returnCode !== 0) {
    return showError(returnMsg);
  } else {
    const controlsIndex = controls.findIndex(col => col.key === formKey);
    const index = controls[controlsIndex].data.findIndex(item => item.key === key);
    const data = updateOne(deepCopy(controls[controlsIndex].data), index, {options: result});
    dispatch(action.update({data}, ['controls'], controlsIndex));
  }
};

//SuperTable2 onSearch事件 参考应收费用明细
const searchActionCreator = (tableKey, rowIndex, key, tablevalue) => async (dispatch, getState) => {
  const {tables, value} = getSelfState(getState());
  const chargeItemURLObject = {
    renewal_mode_001: URL_CHARGE_NAME,
    renewal_mode_002: URL_TAX,
    renewal_mode_003: URL_NET
  };
  const changeType = value['renewalMode'];
  let options, params = {maxNumber: 65536, filter: tablevalue};
  switch (key){
    case 'balanceId': {
      options = getJsonResult(await fetchJson(URL_CUSTOMER, postOption(params)));
      break;
    }
    case 'chargeItemId': {
      options = getJsonResult(await fetchJson(chargeItemURLObject[changeType], postOption(params)));
      break;
    }
    default: return;
  }
  const tablesIndex = tables.findIndex(table => table.key === tableKey);
  const cellIndex = tables[tablesIndex].cols.findIndex(item => item.key === key);
  const cols = updateOne(deepCopy(tables[tablesIndex].cols), cellIndex, {options});
  dispatch(action.update({cols}, ['tables'], tablesIndex));
};

const changeActionCreator = (formKey, key, value) => async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  dispatch(action.assign({[key]: value}, 'value'));
  if (key === 'transportOrderId') {
    if ( value === '') return dispatch(action.assign({['costInfo']: []}, 'value'));
    const {returnCode, result} = await fetchJson(`${URL_TRANSINFO}/${value.value}`);
    if (returnCode === 0){
      const {details, balanceId, currency} = result;
      const tableItems = details.map(item => Object.assign(item, {readonly: true}));
      dispatch(action.assign({['costInfo']: tableItems, balanceId, currency}, 'value'));
    }
  }else if (key === 'responsibleParty'){
    const index = controls.findIndex(o => o.key === formKey);
    let data;
    if (value) {
      const renewalReasonOptions = getJsonResult(await fetchDictionary([value]));
      data = updateOne(deepCopy(controls[index].data), {key: 'key', value: 'renewalReason'}, {options: renewalReasonOptions[value]});
      dispatch(action.update({data}, 'controls', index));
    }else {
      dispatch(action.assign({[key]: value, renewalReason: ''}, 'value'));
      data = updateOne(deepCopy(controls[index].data), {key: 'key', value: 'renewalReason'}, {options: []});
      dispatch(action.update({data}, 'controls', index));
    }
  }
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const round = (value) => {
  typeof value !== 'number' && (value = Number(value));
  return String(value.toFixed(2));
};

const isPriceCompletion = ({price, number}) => {
  return price && number;
};

const priceOrNumChange = (tableKey, rowIndex, keyName, keyValue) => (dispatch, getState) => {
  const {value} = getSelfState(getState());
  const targetItem = Object.assign({}, value[tableKey][rowIndex], {[keyName]: keyValue});
  const payload = {taxAmount: '', netAmount: '', [keyName]: keyValue};
  payload.amount = isPriceCompletion(targetItem) ? round(Number(targetItem['price']) * Number(targetItem['number'])) : '';
  dispatch(action.update(payload, ['value', tableKey], rowIndex));
};


const contentChangeActionCreator = (tableKey, rowIndex, keyName, keyValue) =>{
  if (keyName === 'price' || keyName === 'number') {
    return priceOrNumChange(tableKey, rowIndex, keyName, keyValue);
  } else if (keyName === 'balanceId') {
    return action.update({[keyName]: keyValue, currency: keyValue.balanceCurrency}, ['value', tableKey], rowIndex);
  }else {
    return action.update({[keyName]: keyValue}, ['value', tableKey], rowIndex);
  }
};

const addAction = () => async (dispatch, getState) => {
  const { value } = getSelfState(getState());
  if (!value['transportOrderId'] || value['transportOrderId'] === '') return showError('请先选择运单号');
  if (value.balanceId.value) {
    const {result} = await fetchJson(`${URL_CURRENCY}/${value.balanceId.value}`);
    dispatch(action.add({currency: result, balanceId: value['balanceId']}, ['value', 'costInfo']));
  } else{
    dispatch(action.add({currency: '', balanceId: value['balanceId']}, ['value', 'costInfo']));
  }
};

const getCopyKeys = (targetArray) => {
  return targetArray.reduce((result, item) => {
    item.copy && result.push(item.key);
    return result;
  }, []);
};

const copyAction = (Key) => (dispatch, getState) => {
  const {value, tables} = getSelfState(getState());
  const table = tables.filter(item => item.key === Key)[0];
  const copyKeys = getCopyKeys(table.cols);
  const items = value[Key].filter(item => item.checked).map(item => getObject(item, copyKeys));
  const newItems = value[Key].concat(items).map(item => {
    if (item.checked) {
      item.checked = false;
    }
    return item;
  });
  return items.length === 0 ? showError('请选择一条费用明细') : dispatch(action.assign({[Key]: newItems}, 'value'));
};

const deleteAction = (Key) => (dispatch, getState) => {
  const {value} = getSelfState(getState());
  const items = value[Key].filter(item => item.readonly || !item.checked);
  return items.length !== value[Key].length ? dispatch(action.assign({[Key]: items}, 'value')) : showError('选择一条非只读数据!');
};

const strikeBalanceAction = (Key) => (dispatch, getState) => {
  const {value} = getSelfState(getState());
  if (!value[Key]) return showError('请选择一条记录');
  const checkAndValidItem = value[Key].reduce((result, item) => {
    item.checked && item.id && result.push(item);
    item.checked = false;
    return result;
  }, []);
  if (checkAndValidItem.length !== 1) return showError('请选择一条可冲账的记录');
  const targetItem  = deepCopy(checkAndValidItem[0]);
  ['price', 'amount', 'taxAmount', 'netAmount'].forEach( item => {
    targetItem[item] = -targetItem[item];
  });
  targetItem.copyId = targetItem.id;
  delete targetItem.id;
  dispatch(action.add({...targetItem}, ['value', Key]));
};

const cancelAction = () =>(dispatch, getState) =>  {
  afterEditAction()(dispatch, getState);
};

const convert = (items) => {
  return items.filter(item => !item.readonly || item.copyId).map(item => helper.convert(item));
};

const saveAction = () => async (dispatch, getState) => {
  const {controls, value, tables} = getSelfState(getState());
  const invalidFormItem = controls.find(control => {
    return !helper.validValue(control.data, value || {});
  });
  if (invalidFormItem) {
    dispatch(action.assign({valid: invalidFormItem.key}));
    return showError('请填写必填项');
  }
  if (!value['costInfo'] || value['costInfo'].length === 0) return showError('费用明细必填');
  const invalidTableItem = tables.find(item => {
    return !helper.validArray(item.cols, value[item.key].filter(i => !i.readonly));
  });
  if (invalidTableItem) {
    dispatch(action.assign({valid: invalidTableItem.key}));
    return showError('请填写必填项');
  }
  if (CURRENT_KEY === 'add') {
    const saveData = {
      title: helper.convert(getObjectExclude(value, ['costInfo'])),
      detail: convert(value['costInfo'])
    };
    const {returnCode, returnMsg, result} = await fetchJson(URL_ADDSAVE, postOption(saveData));
    if (returnCode === 0) {
      helper.showSuccessMsg('保存成功');
      controls[0].data.forEach(item => {
        if (item.key === 'transportOrderId') {
          item.type = 'readonly';
        }
      });
      const {from=0, to=0} = result;
      const pos = to - from;
      const tableItems = result.details.map((item, index) => {
        return index < pos ? Object.assign(item, {readonly: true}) : item;
      });
      dispatch(action.assign({controls}));
      dispatch(action.assign({['costInfo']: tableItems, ...result.title}, 'value'));
      return updateTable(dispatch, getState);
    }else {
      return showError(returnMsg);
    }
  }else {
    const saveData = {
      title: helper.convert(getObjectExclude(value, ['costInfo'])),
      detail: convert(value['costInfo'])
    };
    const {returnCode, returnMsg, result} = await fetchJson(URL_EDITSAVE, postOption(saveData, 'put'));
    if (returnCode === 0) {
      helper.showSuccessMsg('保存成功');
      const {from=0, to=0} = result;
      const pos = to - from;
      const tableItems = result.details.map((item, index) => {
        return index < pos ? Object.assign(item, {readonly: true}) : item;
      });
      dispatch(action.assign({['costInfo']: tableItems, ...result.title}, 'value'));
      return updateTable(dispatch, getState);
    } else {
      return showError(returnMsg);
    }
  }
};

const commitAction = () => async (dispatch, getState) => {
  const {controls, value, tables} = getSelfState(getState());
  const invalidFormItem = controls.find(control => {
    return !helper.validValue(control.data, value || {});
  });
  if (invalidFormItem) {
    dispatch(action.assign({valid: invalidFormItem.key}));
    return showError('请填写必填项');
  }
  if (!value['costInfo'] || value['costInfo'].length === 0) return showError('费用明细必填');
  const invalidTableItem = tables.find(item => {
    return !helper.validArray(item.cols, value[item.key].filter(i => !i.readonly));
  });
  if (invalidTableItem) {
    dispatch(action.assign({valid: invalidTableItem.key}));
    return showError('请填写必填项');
  }
  const saveData = {
    title: helper.convert(getObjectExclude(value, ['costInfo'])),
    detail: convert(value['costInfo'])
  };
  const {returnCode, returnMsg} = await fetchJson(URL_COMMIT, postOption(saveData));
  if (returnCode === 0) {
    helper.showSuccessMsg('已提交');
    afterEditAction()(dispatch, getState);
  } else {
    return showError(returnMsg);
  }
};

const confirmAction = () => async (dispatch, getState) => {
  const {value} = getSelfState(getState());
  const {returnCode, returnMsg} = await fetchJson(`${URL_AUDIT}/${value.id}`, 'put');
  if (returnCode === 0) {
    helper.showSuccessMsg('已审核');
    afterEditAction()(dispatch, getState);
  } else {
    return showError(returnMsg);
  }
};

const rejectAction = () => async (dispatch, getState) => {
  const {value} = getSelfState(getState());
  const onOK = async (reason) => {
    const params = {
      reason,
      id: value.id
    };
    const {returnCode, returnMsg} = await fetchJson(URL_REJECT, postOption(params, 'put'));
    if (returnCode !== 0) return showError(returnMsg);
    helper.showSuccessMsg('操作成功');
    afterEditAction()(dispatch, getState);
  };
  showAuditNoDialog(onOK);
};

const actionCreator = {
  add: addAction,
  copy: copyAction,
  delete: deleteAction,
  strikeBalance: strikeBalanceAction,
  cancel: cancelAction,
  save: saveAction,
  commit: commitAction,
  confirm: confirmAction,
  reject: rejectAction
};

const clickActionCreator = (Key, key) => {
  if (actionCreator.hasOwnProperty(key)){
    return actionCreator[key](Key);
  } else {
    console.log('unknow key:', key);
    return {type: 'unknown'};
  }
};

const actionCreators = {
  onFormSearch: formSearchActionCreator,
  onSearch: searchActionCreator,
  onChange: changeActionCreator,
  onExitValid: exitValidActionCreator,
  onContentChange: contentChangeActionCreator,
  onClick: clickActionCreator
};

export default connect(mapStateToProps, actionCreators)(EditPage);
