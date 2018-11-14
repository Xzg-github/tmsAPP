import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import helper, {postOption, fetchJson} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {afterEditActionCreator} from './OrderPageContainer';

const STATE_PATH = ['basic', 'currencyFile', 'edit'];
const action = new Action(STATE_PATH, false);
const URL_SAVE = '/api/basic/currencyFile/save';

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
  const {edit, controls, value} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  delete value.checked;
  const option = postOption(value, edit ? 'put': 'post');
  const {returnCode, result, returnMsg} = await fetchJson(URL_SAVE, option);
  if (returnCode !== 0) {
    helper.showSuccessMsg(returnMsg);
    return;
  }
  afterEditActionCreator(result, edit)(dispatch, getState);
};

const cancelActionCreator = () => {
  return afterEditActionCreator();
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

const EditDialogContainer = connect(mapStateToProps, actionCreators)(EditDialog);
export default EditDialogContainer;


