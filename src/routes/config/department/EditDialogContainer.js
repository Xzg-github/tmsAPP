import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import helper, {postOption, fetchJson} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {afterEditActionCreator} from './TreePageContainer';

const STATE_PATH = ['basic', 'department', 'edit'];
const action = new Action(STATE_PATH, false);
const SAVE_URL = '/api/basic/department';
const URL_USER = '/api/basic/user/name';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildEditState = (config, data, edit) => {
  return {
    edit,
    config: config.config,
    controls: config.controls,
    title: edit ? config.edit : config.add,
    value: data
  };
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const searchActionCreator = (key, value) => async (dispatch) => {
  const {returnCode, result} = await fetchJson(URL_USER, postOption({filter: value}));
  if (returnCode === 0) {
    dispatch(action.assign({[key]: result.data}, 'options'));
  }
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const {edit, value, controls} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }

  const option = postOption(helper.convert(value), edit ? 'put': 'post');
  const {returnCode, returnMsg, result} = await fetchJson(SAVE_URL, option);
  if (returnCode === 0) {
    afterEditActionCreator(result, edit)(dispatch, getState);
  } else {
    helper.showError(returnMsg);
  }
};

const cancelActionCreator = () => {
  return afterEditActionCreator();
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onSearch: searchActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EditDialog);
export default Container;
export {buildEditState};
