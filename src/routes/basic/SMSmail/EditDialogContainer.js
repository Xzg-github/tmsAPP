import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import {postOption, validValue, fetchJson, showError,deepCopy} from '../../../common/common';
import {toFormValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {updateTable} from './OrderPageContainer';

const URL_SMS = '/api/basic/SMSmail/smsAdd';
const URL_MAIL = '/api/basic/SMSmail/mailAdd';

const URL_SMS_PASSWORD = '/api/basic/SMSmail/smsPassword';
const URL_MAIL_PASSWORD = '/api/basic/SMSmail/mailPassword';

const STATE_PATH = ['basic', 'SMSmail','edit'];
const action = new Action(STATE_PATH);
const CLOSE_ACTION = action.assignParent({edit: undefined});

const buildEditState = (config, data, edit,activeKey,title) => {
  let controls = deepCopy(config.controls);
  controls = controls.filter(item => {
    if(edit){
      return item.key !== 'password' && item.key !== 'againPassword';
    }else if(title === '设置密码'){
      return item.key === 'password' || item.key === 'againPassword';
    }
    return item
  });
  return {
    edit,
    config: config.config,
    controls:controls,
    title: title,
    value: data,
    size: 'small',
    activeKey
  };
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {

};

const changeActionCreator = (keyName, keyValue) => async (dispatch, getState) => {
  dispatch(action.assign({[keyName]: keyValue}, 'value'));
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const { edit, value, controls ,activeKey,title} = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  const options = postOption(toFormValue(value), "post");
  const url = activeKey === 'SMS' ? URL_SMS : URL_MAIL;
  const urlPassword = activeKey === 'SMS' ? URL_SMS_PASSWORD : URL_MAIL_PASSWORD;
  let data = await fetchJson(title !== '设置密码'? url:urlPassword, options);
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  dispatch(CLOSE_ACTION);
  return updateTable(dispatch, getState);


};

const cancelActionCreator = () => (dispatch) => {
  dispatch(CLOSE_ACTION);
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

const Container = connect(mapStateToProps, actionCreators)(EditDialog);
export default Container;
export {buildEditState};
