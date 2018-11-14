import { connect } from 'react-redux';
import EditDialog from '../../../../components/EditDialog';
import {postOption, validValue, fetchJson, showError} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';

const STATE_PATH = ['platform', 'jurisdiction', 'dataType', 'edit'];
const action = new Action(STATE_PATH);
const CLOSE_ACTION = action.assignParent({edit: undefined});
const URL_SAVE = '/api/platform/jurisdiction/dataType';

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
  const {edit, editIndex, value, controls} = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  let arr = [];
  value.relationList.map((item) => {
    arr.push({value: item, title: item})
  });
  value.relationList = arr;
  const option = postOption(value, edit ? 'put': 'post');
  const {returnCode, returnMsg, result} = await fetchJson(URL_SAVE, option);
  if (returnCode != 0) {
    showError(returnMsg);
    return;
  }
  if (edit) {
    dispatch(action.updateParent(result, 'tableItems', editIndex))
  }else {
    dispatch(action.addParent(result, 'tableItems', 0))
  }
  dispatch(CLOSE_ACTION);
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
  onCancel: cancelActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EditDialog);
export default Container;
