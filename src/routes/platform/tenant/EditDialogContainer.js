import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import {postOption, validValue, fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {closeActionCreator} from './TreePageContainer';

const STATE_PATH = ['basic', 'tenant', 'edit'];
const action = new Action(STATE_PATH, false);
const SAVE_URL = '/api/basic/tenant';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const convert = (value) => {
  return Object.keys(value).reduce((result, key) => {
    result[key] = typeof value[key] === 'object' ? value[key].value : value[key];
    return result;
  },{});
};

const okActionCreator = () => async (dispatch, getState) => {
  const {edit, value, controls} = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }

  const option = postOption(convert(value), edit ? 'put': 'post');
  const {returnCode, returnMsg, result} = await fetchJson(SAVE_URL, option);
  if (returnCode === 0) {
    closeActionCreator(result, edit)(dispatch, getState);
  } else {
    showError(returnMsg);
  }
};

const cancelActionCreator = () => {
  return closeActionCreator();
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

const Container = connect(mapStateToProps, actionCreators)(EditDialog);
export default Container;
