import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../../../components/Enhance';
import MultipleDialog from './MultipleDialog';
import helper, {postOption, showError, getJsonResult, validArray, deepCopy, convert}from '../../../../../common/common';
import {Action} from '../../../../../action-reducer/action';
import {getPathValue} from '../../../../../action-reducer/helper';
import {showColsSetting} from '../../../../../common/tableColsSetting';
import showPopup from '../../../../../standard-business/showPopup';
import showGetChargeDialog from '../GetChargeDialog/GetChargeDialog';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH, false);

const URL_CUSTOMER = '/api/bill/receiveMake/customerId';
const URL_CHARGE_NAME = '/api/bill/receiveMake/chargeItemId';
const URL_SUPPLIER = '/api/bill/payMake/supplierId';
const URL_GET_COST = '/api/bill/receiveMake/getCost';
const URL_CURRENCY = `/api/bill/receiveMake/customerCurrency`;
const URL_CURRENCY_SUPPLIER = `/api/bill/payMake/supplierCurrency`;


const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (rowIndex, keyName, keyValue) => async (dispatch, getState) =>{
  const {customerId, supplierId} = getSelfState(getState());
  let payload = {[keyName]: keyValue}, index = rowIndex;
  switch (keyName) {
    case 'price':
    case 'chargeNum': {
      payload['amount'] = '';
      break;
    }
    case 'currency': {
      payload['exchangeRate'] = '';
      break;
    }
    case 'customerId': {
      const currency = getJsonResult(await helper.fetchJson(`${URL_CURRENCY}/${keyValue.value}`));
      payload['currency'] = currency ? currency.balanceCurrency : undefined;
      break;
    }
    case 'supplierId': {
      const currency = getJsonResult(await helper.fetchJson(`${URL_CURRENCY_SUPPLIER}/${keyValue.value}`));
      payload['currency'] = currency ? currency.balanceCurrency : undefined;
      break;
    }
  }
  dispatch(action.update(payload, 'items', index));
};

const searchActionCreator = (rowIndex, keyName, keyValue) => async (dispatch, getState) => {
  let options, params = {maxNumber: 20, filter: keyValue};
  switch (keyName) {
    case 'supplierId': {
      options = getJsonResult(await helper.fetchJson(URL_SUPPLIER, postOption(params)));
      break;
    }
    case 'customerId': {
      options = getJsonResult(await helper.fetchJson(URL_CUSTOMER, postOption(params)));
      break;
    }
    case 'chargeItemId': {
      options = getJsonResult(await helper.fetchJson(URL_CHARGE_NAME, postOption(params)));
      break;
    }
  }
  dispatch(action.update({options}, 'cols', {key: 'key', value: keyName}));
};

const addActionCreator = () => async (dispatch, getState) => {
  const {customerId, supplierId, items, balanceCurrency} = getSelfState(getState());
  items.push({
    checked: false,
    currency: balanceCurrency,
    customerId,
    supplierId
  });
  dispatch(action.assign({items: deepCopy(items)}));
};

const copyActionCreator = () => async (dispatch, getState) => {
  let {items} = getSelfState(getState());
  const checkList = items.filter(o => o.checked);
  if (checkList.length === 0) return showError("请选择一条数据！");
  const newItems = items.concat(deepCopy(checkList).map(o => {
    o.checked = false;
    delete o.id;
    return o;
  }));
  dispatch(action.assign({items: newItems}));
};

const delActionCreator = () => async (dispatch, getState) =>{
  let {items} = getSelfState(getState());
  const newItems = items.filter(o => !o.checked);
  dispatch(action.assign({items: newItems}));
};

const getActionCreator = () => async (dispatch, getState) => {
  const {customerId, supplierId, items, balanceCurrency, dialogType} = getSelfState(getState());
  const id = customerId ? customerId.value : supplierId ? supplierId.value : '';
  const {returnCode, result, returnMsg} = await helper.fetchJson(`${URL_GET_COST}/${id}`);
  if (returnCode !== 0) return showError(returnMsg);
  const okFunc = (resultList) => {
    if (resultList.length === 0) return;
    const list = resultList.map(o => {
      return {
        checked: false,
        currency: balanceCurrency,
        customerId,
        supplierId,
        chargeItemId: o
      }
    });
    dispatch(action.assign({items: deepCopy(items.concat(list))}));
  }
  await showGetChargeDialog(result, okFunc);
};

//配置字段按钮
const configActionCreator = () => async (dispatch, getState) => {
  const {cols, configKey} = getSelfState(getState());
  const okFunc = (newCols) => {
    dispatch(action.assign({cols: newCols}));
  };
  showColsSetting(cols, okFunc, configKey, ['hide']);
};

const buttons = {
  add: addActionCreator,
  copy: copyActionCreator,
  del: delActionCreator,
  get: getActionCreator,
  config: configActionCreator
};

const clickActionCreator = (key) => {
  if (buttons.hasOwnProperty(key)) {
    return buttons[key]();
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const okActionCreator = (afterClose) => async (dispatch, getState) => {
  const {cols, items} = getSelfState(getState());
  if(!validArray(cols, items)) {
    dispatch(action.assign({valid: true}));
    return showError('请填写必填项！');
  }
  dispatch(action.assign({okResult: items.map(o => convert(o))}));
  afterClose();
};

const checkActionCreator = (rowIndex, keyName, checked) => action.update({checked}, 'items', rowIndex);

const exitValidActionCreator = () => action.assign({valid: false});

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onExitValid: exitValidActionCreator,
  onCheck: checkActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onSearch: searchActionCreator,
  onOk: okActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(MultipleDialog));
export default async (params) => {
  global.store.dispatch(action.create(params));
  await showPopup(Container, {status: 'page'}, true);
  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.okResult;
}
