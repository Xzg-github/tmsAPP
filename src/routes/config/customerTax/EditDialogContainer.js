import { connect } from 'react-redux';
import EditDialog from './EditDialog';
import helper, {postOption, fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import showPopup from "../../../standard-business/showPopup";
import {updateTable} from './OrderPageContainer';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH, false);

const URL_SAVE = '/api/config/customer_tax/add';
const URL_CLIENT = '/api/config/customer_tax/customer';
const URL_ITEMS = '/api/config/customer_tax/Items';

const buildState = (config, data, edit) => {
  const newControls = helper.deepCopy(config.controls).map(item => {
    if (item.key === 'taxRate') item.type = 'readonly';
    return item;
  });
  return {
    ...config,
    title: edit ? '编辑' :'新增',
    visible: true,
    value: data,
    controls: data['taxRateWay'] === 'tax_rate_way_not_calculate' ? newControls : config.controls
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

const changeActionCreator = (key, keyValue) => (dispatch, getState) => {
  if (key === 'oilRatio')  {
    if (keyValue >= 100) {
      keyValue = null;
      showError('油卡比例必须小于100');
    }
  }
  if (key === 'taxRate') {
    const {controls} = getSelfState(getState());
    const options = controls.find(item => item.key === 'taxRate').options;
    keyValue = options.find(item => item.value === keyValue).title;
  }
  if (key === 'taxRateWay') {
    const {controls, value} = getSelfState(getState());
    //如果是不计税(字典值: tax_rate_way_not_calculate) 税率为0且不可编辑
    if (keyValue === 'tax_rate_way_not_calculate') {
      const newControls = controls.map(item => {
        if (item.key === 'taxRate') item.type = 'readonly';
        return item;
      });
      dispatch(action.assign(({controls: newControls, initialValue: value.taxRate})));
      dispatch(action.assign({[key]: keyValue, taxRate: '0'}, 'value'));
    } else {
      const state = getSelfState(getState());
      const newControls = controls.map(item => {
        if (item.key === 'taxRate' && item.type === 'readonly') item.type = 'select';
        return item;
      });
      dispatch(action.assign(({controls: newControls})));
      dispatch(action.assign({[key]: keyValue, taxRate: state.initialValue || value.taxRate}, 'value'));
    }
  }
  dispatch(action.assign({[key]: keyValue}, 'value'));
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const searchActionCreator = (key, value) => async (dispatch) => {
  if (key === 'customerId') {
    const {returnCode, result} = await fetchJson(URL_CLIENT, postOption({"filter": value, "maxNumber": 10}));
    if (returnCode === 0) {
      dispatch(action.assign({[key]: result}, 'options'));
    }
  }else if (key === 'chargeItemId') {
    const {returnCode, result} = await fetchJson(URL_ITEMS, postOption({chargeName: value, "maxNumber": 10}));
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
