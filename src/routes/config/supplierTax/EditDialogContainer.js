import { connect } from 'react-redux';
import EditDialog from './EditDialog';
import helper, {postOption, fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import showPopup from "../../../standard-business/showPopup";
import {updateTable} from './OrderPageContainer';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH, false);

const URL_SAVE = '/api/config/supplier_tax/add';
const URL_CLIENT = '/api/config/supplier_tax/customer';
const URL_ITEMS = '/api/config/supplier_tax/Items';

const buildState = (config, data, edit) => {
  return {
    ...config,
    title: edit ? '编辑' :'新增',
    visible: true,
    value: data,
  }
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const okActionCreator = () => async (dispatch, getState) => {
  const {value, controls} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    return dispatch(action.assign({valid: true}));
  }
  const option = postOption(helper.convert(value), 'post');
  const {returnCode, returnMsg} = await fetchJson(URL_SAVE, option);
  if (returnCode === 0) {
    dispatch(action.assign({visible: false}));
    return updateTable(dispatch, getState);
  } else {
    showError(returnMsg);
  }
};

const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible:false}));
};

const clickActionCreators = {
  ok: okActionCreator,
  close: closeActionCreator
};

const clickActionCreator = (key) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key]();
  }else{
    return {type: 'unknown'}
  }
};

const changeActionCreator = (key, value) =>  {
  if (key === 'taxRate') {
    if (value >= 100) {
      value = null;
      showError('税率必须小于100');
    }
  }else if (key === 'oilRatio')  {
    if (value >= 100) {
      value = null;
      showError('油卡比例必须小于100');
    }
  }
  return action.assign({[key]: value}, 'value');
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const searchActionCreator = (key, value) => async (dispatch) => {
  if (key === 'supplierId') {
    const {returnCode, result} = await fetchJson(URL_CLIENT, postOption({"filter": value, "maxNumber": 10}));
    if (returnCode === 0) {
      dispatch(action.assign({[key]: result}, 'options'));
    }
  }else if (key === 'chargeItemId') {
    const {returnCode, result} = await fetchJson(URL_ITEMS, postOption({"param": {chargeName: value}, "maxNumber": 10}));
    if (returnCode === 0) {
      dispatch(action.assign({[key]: result}, 'options'));
    }
  }
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onSearch: searchActionCreator,
  onExitValid: exitValidActionCreator,
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const Container = connect(mapStateToProps, actionCreators)(EditDialog);


export default async(config, data={},isAdd=true) => {
  global.store.dispatch(action.create(buildState(config, data, isAdd)));
  await showPopup(Container, data,true);
};
