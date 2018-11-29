import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import helper, {postOption, fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import showPopup from '../../../standard-business/showPopup';

const URL_SAVE = '/api/config/customer_service/save';
const URL_CUSTOMER_OPTIONS = '/api/config/customer_factory/customer';
const URL_USER = '/api/basic/user/name';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const searchClient = (key, value) => async (dispatch) => {
  const option = postOption({maxNumber: 20, filter: value});
  const {returnCode, result} = await fetchJson(URL_CUSTOMER_OPTIONS, option);
  if (returnCode === 0) {
    dispatch(action.assign({[key]: result}, 'options'));
  }
};

const searchUser = (key, value) => async (dispatch) => {
  const option = postOption({filter: value});
  const {returnCode, result} = await fetchJson(URL_USER, option);
  if (returnCode === 0) {
    dispatch(action.assign({[key]: result.data}, 'options'));
  }
};

const searchActionCreator = (key, value) => {
  if (key === 'customerId') {
    return searchClient(key, value);
  } else if (key === 'userId') {
    return searchUser(key, value);
  }
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = ({onClose}) => async (dispatch, getState) => {
  const {isEdit, value, controls} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }

  const option = postOption(helper.convert(value), isEdit ? 'put': 'post');
  const {returnCode, returnMsg, result} = await fetchJson(URL_SAVE, option);
  if (returnCode === 0) {
    onClose(true);
  } else {
    showError(returnMsg);
  }
};

const cancelActionCreator = ({onClose}) => () => {
  onClose(false);
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

export default (config, data, isEdit) => {
  const props = {
    isEdit,
    config: config.config,
    controls: config.controls,
    title: isEdit ? config.edit : config.add,
    value: data,
    size: 'middle',
    options: {},
    inset: false
  };
  global.store.dispatch(action.create(props));
  const Container = connect(mapStateToProps, actionCreators)(EditDialog);
  return showPopup(Container, {});
};
