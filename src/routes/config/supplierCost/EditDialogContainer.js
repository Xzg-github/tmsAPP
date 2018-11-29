import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import {postOption, validValue, fetchJson, showError} from '../../../common/common';
import {toFormValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import showPopup from "../../../standard-business/showPopup";

const URL_SUPPLIER_OPTIONS = '/api/config/supplier_contact/customer';
const URL_CHANGE_OPTIONS = '/api/config/customer_cost/charge_name_drop_list';
const URL_ADD = '/api/config/supplier_cost/add';
const URL_EDIT = '/api/config/supplier_cost/edit';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const formSearchActionCreator = (key, title) => async (dispatch) => {
  let data, options, body;
  switch (key) {
    case 'supplierId': {
      body = {maxNumber: 20, filter:title};
      data = await fetchJson(URL_SUPPLIER_OPTIONS, postOption(body));
      options = data.result;
      break;
    }
    case 'chargeItemId': {
      body =  {maxNumber: 20,  chargeName: title};
      data = await fetchJson(URL_CHANGE_OPTIONS, postOption(body));
      options = data.result;
      break;
    }
    default:
      return;
  }
  if (data.returnCode !== 0) {
    return;
  }
  dispatch(action.update({options}, 'controls', {key: 'key', value: key}));
};

const changeActionCreator = (keyName, keyValue) => async (dispatch) => {
  dispatch(action.assign({[keyName]: keyValue}, 'value'));
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = ({onClose}) => async (dispatch, getState) => {
  const { value, controls ,isEdit} = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  const options = postOption(toFormValue(value),"post");
  let url = isEdit ? URL_EDIT : URL_ADD;
  let data = await fetchJson(url, options);
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  onClose(true);
};

const cancelActionCreator = ({onClose}) => () => {
  onClose(false);
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
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
    size: 'middle'
  };
  global.store.dispatch(action.create(props));
  const Container = connect(mapStateToProps, actionCreators)(EditDialog);
  return showPopup(Container, {});
};

