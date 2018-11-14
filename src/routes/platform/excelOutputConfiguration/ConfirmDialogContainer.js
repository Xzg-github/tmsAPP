import { connect } from 'react-redux';
import ConfirmDialog from '../../../components/ConfirmDialog';
import {fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {updateTable} from './OrderPageContainer';

const STATE_PATH = ['platform', 'excelOutputConfiguration','confirm'];
const action = new Action(STATE_PATH);
const CLOSE_ACTION = action.assignParent({confirm: undefined});

const URL_DELETE = '/api/platform/excelOutputConfiguration/delete';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const okActionCreator = () => async (dispatch, getState) => {
  const {checkedType} = getSelfState(getState());
  const res = await fetchJson(`${URL_DELETE}/${checkedType}`, 'delete');
  if (res.returnCode) {
    showError(res.returnMsg);
    dispatch(CLOSE_ACTION);
  } else {
    dispatch(CLOSE_ACTION);
  }
  return updateTable(dispatch, getState);
};


const cancelActionCreator = () => (dispatch) => {
  dispatch(CLOSE_ACTION);
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

const ConfirmDialogContainer = connect(mapStateToProps, actionCreators)(ConfirmDialog);

export default ConfirmDialogContainer;

