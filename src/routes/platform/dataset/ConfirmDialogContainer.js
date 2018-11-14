import { connect } from 'react-redux';
import ConfirmDialog from '../../../components/ConfirmDialog';
import {fetchJson, showSuccessMsg, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {updateTable} from './OutPutTypeContainer';

const STATE_PATH = ['config', 'dataSet','dataSet1','confirm'];
const action = new Action(STATE_PATH);
const CLOSE_ACTION = action.assignParent({confirm: undefined});

const URL_DEL = '/api/config/dataset/del';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const okActionCreator = () => async (dispatch, getState) => {
  const {checkedId} = getSelfState(getState());
  const res = await fetchJson(`${URL_DEL}/${checkedId}`, 'delete');
  if (res.returnCode) {
    showError(res.returnMsg);
    dispatch(CLOSE_ACTION);
  } else {
    showSuccessMsg('删除成功');
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
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

const ConfirmDialogContainer = connect(mapStateToProps, actionCreators)(ConfirmDialog);

export default ConfirmDialogContainer;

