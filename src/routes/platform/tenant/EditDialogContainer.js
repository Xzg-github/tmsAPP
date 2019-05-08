import { connect } from 'react-redux';
import EditDialog from './EditDialog';
import helper, {postOption, validValue, fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import showPopup from '../../../standard-business/showPopup';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH, false);
const SAVE_URL = '/api/basic/tenant';

const buildEditState = (config, data, edit) => {
  return {
    edit,
    readonly: edit ? ['tenantName', 'tenantCode', 'currencyType'] : [],
    config: config.config,
    controls: config.controls,
    title: edit ? config.edit : config.add,
    value: data,
    visible: true,
    confirmLoading: false,
  };
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const {edit, value, controls} = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  dispatch(action.assign({confirmLoading: true}));
  const option = postOption(helper.convert(value), edit ? 'put': 'post');
  const {returnCode, returnMsg, result} = await fetchJson(SAVE_URL, option);
  if (returnCode !== 0) {
    dispatch(action.assign({confirmLoading: false}));
    helper.showError(returnMsg);
    return;
  }
  dispatch(action.assign({visible: false, res: true}));
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false}));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

export default async (config, data, isEdit) => {
  const state = buildEditState(config, data, isEdit);
  global.store.dispatch(action.create(state));
  const Container = connect(mapStateToProps, actionCreators)(EditDialog);
  return showPopup(Container, {}, true);
};
