import { connect } from 'react-redux';
import EditDialog from '../../platform/datalib/EditDialog';
import {postOption, fetchJson, showError, validValue, convert} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {updateTable} from './EmailConfigurationContainer';

const STATE_PATH = ['config', 'emailAccept', 'email', 'edit'];
const action = new Action(STATE_PATH);
const CLOSE_ACTION = action.assignParent({edit: undefined});
const URL_USER_NAME = '/api/config/emailAccept/user_name';
const URL_EMAIL_LIST = '/api/config/emailAccept/email_list';
const URL_EMAIL_ADD = '/api/config/emailAccept/email_add';
const URL_EMAIL_EDIT = '/api/config/emailAccept/email_edit';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildEditState = (config, data, edit, editIndex, isActive) => {
  return {
    edit,
    editIndex,
    config: config,
    controls: edit && isActive? config.editControls: config.controls,
    title: edit ? config.edit : config.add,
    value: data
  };
};

const formSearchActionCreator = (key, value) => async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  let res, items, body;
  switch(key) {
    case 'userId':
    {
      res = await fetchJson(URL_USER_NAME, postOption({filter: value, maxNumber: 10}));
      break;
    }
    default:
      return;
  }
  if (res.returnCode !== 0) {
    return;
  }
  items = res.result;
  let options = [];
  items.map((item) => {
    options.push({
      value: item.guid,
      title: item.username
    })
  });
  const index = controls.findIndex(item => item.key == key);
  dispatch(action.update({options}, 'controls', index));
  dispatch(action.assign({allResult : items}));
};

const changeActionCreator = (key, value) => (dispatch, getState) => {
  const {allResult} = getSelfState(getState());
  if(key === 'isSendSsl'){
    if(value === 'true_false_type_true'){
      dispatch(action.assign({[key]: value, sendPort: 465}, 'value'));
    }else{
      dispatch(action.assign({[key]: value, sendPort: 25}, 'value'));
    }
  }else if(key === 'isReceiveSsl'){
    if(value === 'true_false_type_true'){
      dispatch(action.assign({[key]: value, receivePort: 995}, 'value'));
    }else{
      dispatch(action.assign({[key]: value, receivePort: 110}, 'value'));
    }
  }else if(key === 'userId'){
    dispatch(action.assign({[key]: value, notifyEmailAddress: ''}, 'value'));
    allResult.map(item => {
      if(value.value === item.guid){
        dispatch(action.assign({[key]: value, notifyEmailAddress: item.userEmail}, 'value'));
      }
    })
  }
  dispatch(action.assign({[key]: value}, 'value'));
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const {edit, editIndex, value, controls, editControls} = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  let res;
  if(!edit){
    res = await fetchJson(URL_EMAIL_ADD, postOption(convert(value)));
  }else{
    res = await fetchJson(URL_EMAIL_EDIT, postOption(convert(value), 'put'));
  }
  if (res.returnCode !== 0) {
    showError(res.returnMsg);
    return;
  }else if (res.returnCode === 0) {
    dispatch(CLOSE_ACTION);
    return updateTable(dispatch, getState);
  }
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(CLOSE_ACTION);
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
  onSearch: formSearchActionCreator,
};

const EmailConfigurationEditDialogContainer = connect(mapStateToProps, actionCreators)(EditDialog);

export default EmailConfigurationEditDialogContainer;
export {buildEditState};

