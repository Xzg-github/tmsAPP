import { connect } from 'react-redux';
import EditPage from './EditPage';
import helper, {postOption, showError, fetchJson, getJsonResult, showSuccessMsg, fuzzySearchEx, convert} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {EnhanceLoading} from '../../../../components/Enhance';
import execWithLoading from '../../../../standard-business/execWithLoading';
import {updateOne} from '../../../../action-reducer/array';
import {afterEdit, setReadonly} from '../OrderPage/OrderPageContainer';

const PARENT_STATE_PATH = ['extraApply'];
const STATE_PATH = ['extraApply', 'edit'];
const action = new Action(STATE_PATH);
const URL_DETAIL = '/api/bill/extraApply/detail';
const URL_CHARGE_NAME = '/api/bill/extraApply/chargeItemId';
const URL_TRANSPORT_ORDER = '/api/bill/extraApply/transportOrderId';
const URL_SAVE = '/api/bill/extraApply/save';
const URL_COMMIT = '/api/bill/extraApply/commit';
const URL_REVIEW = '/api/bill/extraApply/review';
const URL_ENDCASE = '/api/bill/extraApply/endCase';
const URL_CURRENCY = `/api/bill/payMake/supplierCurrency`;
const URL_CARINFO = '/api/bill/payMake/carInfoId';


const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, PARENT_STATE_PATH);
  return parent[parent.activeKey];
};

const changeActionCreator = (KEY, keyName, keyValue) => async (dispatch, getState) =>  {
  let payload = {[keyName]: keyValue};
  dispatch(action.assign(payload, 'value'));
};

const formSearchActionCreator = (KEY, key, filter, control) => async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  let result, params = {maxNumber: 20, filter};
  if (control.searchType) {
    result = getJsonResult(await fuzzySearchEx(filter, control));
  } else {
    switch (key) {
      case 'transportOrderId': {
        result = getJsonResult(await helper.fetchJson(URL_TRANSPORT_ORDER, postOption(params)));
        break;
      }
    }
  }
  const options = result.data ? result.data : result;
  const controlsIndex = controls.findIndex(o => o.key === KEY);
  const index = controls[controlsIndex].cols.findIndex(item => item.key === key);
  const cols = updateOne(controls[controlsIndex].cols, index, {options});
  dispatch(action.update({cols}, ['controls'], controlsIndex));
};

const tableSearchActionCreator = (KEY, rowIndex, key, filter) => async (dispatch, getState) => {
  const {tables} = getSelfState(getState());
  const tableIndex = tables.findIndex(o => o.key === KEY);
  const cols = tables[tableIndex].cols;
  const index = cols.findIndex(o => o.key === key);
  let result, params = {maxNumber: 20, filter};
  if (cols[index].searchType) {
    result = getJsonResult(await fuzzySearchEx(filter, cols[index]));
  } else {
    switch (key) {
      case 'chargeItemId': {
        result = getJsonResult(await helper.fetchJson(URL_CHARGE_NAME, postOption(params)));
        break;
      }
      case 'carNumber': {
        result = getJsonResult(await helper.fetchJson(URL_CARINFO, postOption(params)));
        break;
      }
    }
  }
  const options = result.data ? result.data : result;
  const newCols = updateOne(tables[tableIndex].cols, index, {options});
  dispatch(action.update({cols: newCols}, 'tables', tableIndex));
};

const onContentChangeActionCreator = (KEY, rowIndex, keyName, keyValue) => async (dispatch, getState) =>  {
  const {value} = getSelfState(getState());
  let payload = {[keyName]: keyValue}
  if (keyName === 'balanceId') {
    // const res = getJsonResult(await helper.fetchJson(`${URL_CURRENCY}/${keyValue.value}`));
    // const currency = res ? res.balanceCurrency : undefined;
    // dispatch(action.update({currency}, ['value', KEY], rowIndex));
    payload['currency'] = keyValue.balanceCurrency;
    let {isRequired:requiredArr=[], _extraProps={}} = value[KEY] ? value[KEY] [rowIndex] : {};
    // 如果是车主类型，车牌号码为必填
    if (keyValue.supplierType === 'supplier_type_car_owner' && !requiredArr.includes('carNumber')) {
      requiredArr.push('carNumber');
    } else {
      requiredArr = requiredArr.filter(o => o !== 'carNumber');
    }
    // 如果有费用备注，备注为必填
    if (!!keyValue.chargeRemark && !requiredArr.includes('remark')) {
      _extraProps['placeholder'] = keyValue.chargeRemark;
      requiredArr.push('remark');
    } else {
      _extraProps['placeholder'] = '';
      requiredArr = requiredArr.filter(o => o !== 'remark');
    }
    payload.isRequired = requiredArr;
    payload._extraProps = _extraProps;
  }
  dispatch(action.update(payload, ['value', KEY], rowIndex));
};

const checkActionCreator = (KEY, rowIndex, key, checked) => (dispatch, getState) => {
  dispatch(action.update({checked}, ['value', KEY], rowIndex));
};

const addActionCreator = (KEY) => async (dispatch, getState) => {
  const {value} = getSelfState(getState());
  const list = value[KEY] || [];
  const newItems = list.concat([{}]);
  dispatch(action.assign({[KEY]: newItems}, 'value'));
};

const copyActionCreator = (KEY) => async (dispatch, getState) => {
  const {value} = getSelfState(getState());
  const list = value[KEY] || [];
  const checkList = list.filter(o => o.checked);
  if (checkList.length === 0) return showError('请勾选一条数据！');
  const newItems = list.concat(helper.deepCopy(checkList).map(o => {
    o.checked = false;
    return o;
  }));
  dispatch(action.assign({[KEY]: newItems}, 'value'));
};

const payDelActionCreator = (KEY) => async (dispatch, getState) =>  {
  const {value} = getSelfState(getState());
  const list = value[KEY] || [];
  const checkList = list.filter(o => o.checked);
  if (checkList.length === 0) return showError('请勾选一条数据！');
  const newItems = list.filter(o => !o.checked);
  dispatch(action.assign({[KEY]: newItems}, 'value'));
};

const closeActionCreator = (isRefresh=false) => (dispatch, getState) => {
  const { tabs, activeKey } = getPathValue(getState(), PARENT_STATE_PATH);
  const newTabs = tabs.filter(tab => tab.key !== activeKey);
  let index = tabs.findIndex(tab => tab.key === activeKey);
  index--;
  dispatch(action.assignParent({ tabs: newTabs, activeKey: newTabs[index].key, [activeKey]: undefined }));
  isRefresh && afterEdit(dispatch, getState);
};

const checkValid = (dispatch, getState) => {
  const {controls, tables, value, editType, resultForm} = getSelfState(getState());
  const controlItem = controls.find(o => !helper.validValue(o.cols, value));
  if (controlItem) {
    dispatch(action.assign({valid: controlItem.key}));
    return true;
  }
  const tableItem = tables.find(o => {
    const arr = value[o.key] || [];
    const flag = arr.filter(item => item.isRequired && item.isRequired.length > 0).some( o =>(o.isRequired.some(i => !o[i])));
    return !helper.validArray(o.cols, arr) || flag;
  });
  if (tableItem) {
    dispatch(action.assign({valid: tableItem.key}));
    return true;
  }
  if (editType === 4) {
    if (!helper.validValue(resultForm.cols, value)) {
      dispatch(action.assign({valid: resultForm.key}));
      return true;
    }
  }
  return false;
};

const saveActionCreator = () => async (dispatch, getState) => {
  if (checkValid(dispatch, getState)) return;
  execWithLoading(async () => {
    const {value, statusType, chargeFrom} = getSelfState(getState());
    const {payChargeList=[], receiveChargeList=[], ...extraCharge} = value;
    // type: 0:新增、编辑（待提交） 1:编辑（应收待提交）, 2:编辑（费用来源不为空（外部系统接入））
    const type = chargeFrom ? 2 : statusType === 'status_receive_check_awaiting' ? 1: 0;
    const list = type === 1 ? receiveChargeList : payChargeList;
    const params = {
      type,
      extraCharge: convert(extraCharge),
      chargeList: list.map(o => convert(o))
    };
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_SAVE, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    closeActionCreator(true)(dispatch, getState);
  });
};

const commitActionCreator = () => async (dispatch, getState) => {
  if (checkValid(dispatch, getState)) return;
  execWithLoading(async () => {
    const {value, statusType, chargeFrom} = getSelfState(getState());
    const {payChargeList=[], receiveChargeList=[], ...extraCharge} = value;
    // type: 0:新增、编辑（待提交） 1:编辑（应收待提交）, 2:编辑（费用来源不为空（外部系统接入））
    const type = chargeFrom ? 2 : statusType === 'status_receive_check_awaiting' ? 1: 0;
    const list = type === 1 ? receiveChargeList : payChargeList;
    const params = {
      type,
      extraCharge: convert(extraCharge),
      chargeList: list.map(o => convert(o))
    };
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_COMMIT, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    closeActionCreator(true)(dispatch, getState);
  });
};

const fallbackActionCreator = () => async (dispatch, getState) => {
  if (checkValid(dispatch, getState)) return;
  execWithLoading(async () => {
    const {value} = getSelfState(getState());
    const params = {agreeOrFallback: 'fallback', ...convert(value)};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_REVIEW, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    closeActionCreator(true)(dispatch, getState);
  });
};

const reviewActionCreator = () => async (dispatch, getState) => {
  if (checkValid(dispatch, getState)) return;
  execWithLoading(async () => {
    const {value, statusType} = getSelfState(getState());
    if (statusType !== 'status_checked_awaiting') {
      return commitActionCreator()(dispatch, getState);
    }
    const params = {agreeOrFallback: 'agree', ...convert(value)};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_REVIEW, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    closeActionCreator(true)(dispatch, getState);
  });
};

const endACaseActionCreator = () => async (dispatch, getState) => {
  if (checkValid(dispatch, getState)) return;
  execWithLoading(async () => {
    const {value} = getSelfState(getState());
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_ENDCASE, postOption({...convert(value)}));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    closeActionCreator(true)(dispatch, getState);
  });
};

const receiveDelActionCreator = (KEY) => async (dispatch, getState) =>  {
  const {value} = getSelfState(getState());
  const list = value[KEY] || [];
  const checkList = list.filter(o => o.checked);
  if (checkList.length === 0) return showError('请勾选一条数据！');
  const newItems = list.filter(o => !o.checked);
  dispatch(action.assign({[KEY]: newItems}, 'value'));
};

const convertActionCreator = (KEY) => async (dispatch, getState) =>  {
  const {value, customerId} = getSelfState(getState());
  const payList = value[KEY] || [];
  const checkList = payList.filter(o => o.checked).map(o => ({...o, checked: false, balanceId: customerId}));
  if (checkList.length === 0) return showError('请勾选一条数据！');
  const receiveList = value['receiveChargeList'] || [];
  const newItems = receiveList.concat(checkList.filter(it => !receiveList.find(o => o.id === it.id)));
  dispatch(action.assign({receiveChargeList: newItems}, 'value'));
};

const buttons = {
  edit_add: addActionCreator,
  edit_copy: copyActionCreator,
  edit_del_pay: payDelActionCreator,
  close: closeActionCreator,
  save: saveActionCreator,
  commit: commitActionCreator,
  fallback: fallbackActionCreator,
  review: reviewActionCreator,
  endACase: endACaseActionCreator,
  edit_del_receive: receiveDelActionCreator,
  convert: convertActionCreator
};

const clickActionCreator = (KEY, key) => {
  if (buttons.hasOwnProperty(key)) {
    return buttons[key](KEY);
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const exitValidActionCreator = () => action.assign({valid: false});

const buildEditPageState = async (config, itemData, editType) => {
  let value = {};
  if (editType !== 0) {
    const {extraCharge, payChargeList=[], ...other} = getJsonResult(await fetchJson(`${URL_DETAIL}/${itemData.id}`));
    const {payAmount=0, receiveAmount=0} = extraCharge;
    const payChargeItems = payChargeList.map((item) => {
      const isRequired = [], _extraProps = {};
      const {supplierDto={}} = item;
      if (supplierDto.supplierType === 'supplier_type_car_owner') {
        isRequired.push('carNumber');
      }
      if (!!supplierDto.chargeRemark) {
        isRequired.push('remark');
        _extraProps['placeholder'] = supplierDto.chargeRemark;
      }
      item.carNumber = item.carNumber ? {value: item.carNumber, title: item.carNumber}: {value: itemData.carNumber, title: itemData.carNumber};
      return {...item, isRequired, _extraProps};
    });
    value = {...extraCharge, payChargeList: payChargeItems, ...other, profit: receiveAmount - payAmount};
    // 如果是非待提交编辑页面且费用来源为空，才去判断后端给的是否只读的变量
    if (itemData['statusType'] !== 'status_submit_awaiting' && !itemData['chargeFrom'] && !extraCharge.directorIsTrueOrFalse) {
      config.tables = setReadonly(config.tables);
      config.footerButtons = config.footerButtons.filter(o => o.key === 'close');
    }
  }
  return {
    ...config,
    ...itemData,
    value,
    status: 'page'
  }
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const {editType, config, itemData} = getSelfState(getState());
    const payload = await buildEditPageState(config, itemData, editType);
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
  onTableSearch: tableSearchActionCreator,
  onExitValid: exitValidActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage));
export default Container;
