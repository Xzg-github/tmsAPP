import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../../../components/Enhance';
import MultipleDialog from './MultipleDialog';
import helper, {showError, getJsonResult, validArray}from '../../../../../common/common';
import {Action} from '../../../../../action-reducer/action';
import {getPathValue} from '../../../../../action-reducer/helper';
import {showColsSetting} from '../../../../../common/tableColsSetting';
import showPopup from '../../../../../standard-business/showPopup';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH, false);

// const URL_SEARCH = '/api/order/settle/search';
// const URL_SAVE = '/api/bill/receive/details';
// const URL_BLANCE = '/api/bill/receive/customer/balance/drop_list';
// const URL_CUSTOMER_BASE_INFO = `/api/bill/receive/customer/base_info`;
// const URL_PLACE_DROP_LIST = '/api/basic/area/place_drop_list';


const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (rowIndex, keyName, keyValue) => async (dispatch, getState) =>{
  const {dialogType} = getSelfState(getState());
  let payload = {[keyName]: keyValue}, index = rowIndex;
  switch (keyName) {
    case 'price':
    case 'chargeNum': {
      payload['amount'] = '';
      break;
    }
    case 'balanceCompanyGuid': {
      if (!keyValue.value) return;
      const result = getJsonResult(await helper.fetchJson(`${URL_CUSTOMER_BASE_INFO}/${keyValue.value}`));
      index = dialogType === 3 ? -1 : rowIndex;
      payload['currencyTypeCode'] = result;
      break;
    }
    default: {
      dispatch(action.update(payload, 'items', index));
    }
  }
};

const searchActionCreator = (rowIndex, keyName, keyValue) => async (dispatch, getState) => {
  let options, params = {maxNumber: 20, placeName: keyValue};
  switch (keyName) {
    case 'departure':
    case 'destination': {
      const result = getJsonResult(await helper.fetchJson(URL_PLACE_DROP_LIST, postOption(params)));
      options = result;
      break;
    }
  }
  dispatch(action.update({options}, 'cols', rowIndex));
};

const addActionCreator = () => async (dispatch, getState) => {
  const {defaultBalanceCompany, items} = getSelfState(getState());
  const currencyTypeCode = getJsonResult(await helper.fetchJson(`${URL_CUSTOMER_BASE_INFO}/${defaultBalanceCompany.value}`));
  items.push({
    checked: false,
    currencyTypeCode,
    balanceCompanyGuid: defaultBalanceCompany
  });
  dispatch(action.assign({items}));
};

const copyActionCreator = () => async (dispatch, getState) => {
  let {items} = getSelfState(getState());
  const checkList = items.filter(o => o.checked);
  if (checkList.length === 0) return showError("请选择一条数据！");
  const newItems = items.concat(checkList.map(o => {
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
  const {defaultBalanceCompany} = getSelfState(getState());
  const currencyTypeCode = getJsonResult(await helper.fetchJson(`${URL_CUSTOMER_BASE_INFO}/${defaultBalanceCompany.value}`));
  return alert('获取费用项！');

  // const chargeList = await showGetChargeDialog(defaultBalanceCompany.value, true);
  // if (Array.isArray(chargeList) && chargeList.length > 0) {
  //   const info = result.filter(item => item.taskUnitCode === activeKey).pop() || {};
  //   const [...newItems] = tasks[activeKey];
  //   chargeList.map(item => {
  //     newItems.push({
  //       currencyTypeCode,
  //       taskUnitName:info.taskUnitName,
  //       businessName:info.businessName,
  //       serviceName:info.serviceName,
  //       taskUnitCode:{title:info.taskUnitName,value:info.taskUnitCode},
  //       businessCode:{value:info.businessCode,title:info.businessName},
  //       serviceCode:{value:info.serviceCode,title:info.serviceName},
  //       balanceCompanyGuid: defaultBalanceCompany,
  //       chargeGuid: {value: item.value, title: item.title}
  //     });
  //   });
  //   dispatch(action.assign({[activeKey]: newItems}, 'tasks'));
  // }
};

//配置字段按钮
const configActionCreator = () => async (dispatch, getState) => {
  const {cols} = getSelfState(getState());
  const okFunc = (newCols) => {
    dispatch(action.assign({cols: newCols}));
  };
  showColsSetting(cols, okFunc, 'bill_receiveSettlement_mutipleDialog', ['hide']);
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

const okActionCreator = () => async (dispatch, getState) => {
  const {cols, items} = getSelfState(getState());
  if(!validArray(cols, items)) {
    dispatch(action.assign({valid: true}));
    return showError('请填写必填项！');
  }
  dispatch(action.assign({okResult: items}));
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
  onOk: okActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(MultipleDialog));
export default async (params) => {
  global.store.dispatch(action.create(params));
  await showPopup(Container, {status: 'page'}, true);
  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.okResult;
}
