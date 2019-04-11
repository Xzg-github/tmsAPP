import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../../../../components/Enhance';
import EditDialog from './EditDialog';
import helper, {fetchJson, postOption, showError, getJsonResult, deepCopy, convert}from '../../../../../../common/common';
import {Action} from '../../../../../../action-reducer/action';
import {getPathValue} from '../../../../../../action-reducer/helper';
import showPopup from '../../../../../../standard-business/showPopup';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH, false);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (keyName, keyValue) => async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  let payload = {[keyName]: keyValue};
  switch (keyName) {
    case 'departureType': {
      payload['departure'] = '';
      const index = controls.findIndex(item => item.key === 'departure');
      dispatch(action.update({options: []}, ['controls'], index));
      break;
    }
    case 'destinationType': {
      payload['destination'] = '';
      const index = controls.findIndex(item => item.key === 'destination');
      dispatch(action.update({options: []}, ['controls'], index));
      break;
    }
  }
  dispatch(action.assign(payload, 'value'));
};

const getDistrict = async (type, DIALOG_API, filter) => {
  if (type === '1') {
    // 行政区域
    return getJsonResult(await fetchJson(DIALOG_API.search_district, postOption({districtName: filter, maxNumber: 20})));
  } else if (type === '2') {
    // 行政区域
    return getJsonResult(await fetchJson(DIALOG_API.search_consignor, postOption({name: filter})));
  } else {
    showError('请选择地点类别！');
    return [];
  }
};

const formSearchActionCreator = (keyName, keyValue) => async (dispatch, getState) => {
  const {controls, DIALOG_API, value} = getSelfState(getState());
  let result = [], params = {maxNumber: 20, filter: keyValue};
  switch (keyName) {
    case 'supplierId': {
      result = getJsonResult(await fetchJson(DIALOG_API.search_supplier, postOption(params)));
      break;
   }
    case 'carModeId': {
      result = getJsonResult(await fetchJson(DIALOG_API.search_carMode, postOption(params)));
      break;
    }
    case 'chargeItemId': {
      result = getJsonResult(await fetchJson(DIALOG_API.search_chargeItem, postOption(params)));
      break;
    }
    case 'currency': {
      result = getJsonResult(await fetchJson(DIALOG_API.search_currency, postOption(params)));
      break;
    }
    case 'departure': {
      result = await getDistrict(value['departureType'], DIALOG_API, keyValue);
      break;
    }
    case 'destination': {
      result = await getDistrict(value['destinationType'], DIALOG_API, keyValue);
      break;
    }
  }
  const index = controls.findIndex(item => item.key === keyName);
  dispatch(action.update({options: result}, ['controls'], index));
};

const okActionCreator = (afterClose) => async (dispatch, getState) => {
  const {type, controls, value, DIALOG_API} = getSelfState(getState());
  if(!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return showError('请填写必填项！');
  }
  if (type === 3) {
    const checkList = controls.filter(o => o.checked).map(o => o.key);
    if (checkList.length < 1) return showError('请勾选一条数据！');
    if (checkList.some(o => helper.isEmpty2(value[o]))) return showError('勾选的数据为必填！');
  }
  const url = type < 2 ? DIALOG_API.newAdd : type === 2 ? DIALOG_API.editSave: DIALOG_API.batchEdit;
  const params = {...value, supplierPriceId: value['supplierPriceId'] || value['contractNumber']};
  const {returnCode, result, returnMsg} = await fetchJson(url, postOption(convert(params)));
  if (returnCode !== 0) return showError(returnMsg);
  helper.showSuccessMsg(returnMsg);
  dispatch(action.assign({okResult: true}));
  afterClose();
};

const exitValidActionCreator = () => action.assign({valid: false});

const onCheckItem = (control) => (dispatch,getState) => {
  const {controls} = getSelfState(getState());
  const index = controls.findIndex(o => o.key === control.key);
  if (index > -1) {
    const checked = !control.checked;
    dispatch(action.update({checked}, 'controls', index));
  }
};

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCheckItem
};

const buildState = async (config={}) => {
  const {type=0, controls=[], value={}, DIALOG_API} = deepCopy(config);
  const titleArr = ['新增', '复制新增', '编辑', '批量修改'];
  return {
    type,
    title: titleArr[type],
    controls,
    value,
    DIALOG_API,
    checkable: type === 3,
  }
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(EditDialog));
export default async (params) => {
  const payload = await buildState(params);
  global.store.dispatch(action.create(payload));
  await showPopup(Container, {status: 'page'}, true);
  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.okResult;
}
