import { connect } from 'react-redux';
import ConfirmDialog from '../../../components/ConfirmDialog';
import {fetchJson, showSuccessMsg, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search} from '../../../common/search';

const STATE_PATH = ['platform',  'controlManager', 'confirm'];
const action = new Action(STATE_PATH);
const CLOSE_ACTION = action.assignParent({confirm: undefined});

const URL_DEL = '/api/platform/controlManager';
const URL_LIST = '/api/platform/controlManager/list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const okActionCreator = () => async (dispatch, getState) => {
  const {checkId} = getSelfState(getState());
  const ids = checkId.join(',');
  const res = await fetchJson(`${URL_DEL}?ids=${ids}`, 'delete');
  if (res.returnCode) {
    showError(res.returnMsg);
    dispatch(CLOSE_ACTION);
  } else {
    const data = await search(URL_LIST, 0, 10,{});
    dispatch(action.assignParent({tableItems: data.result.data}));
    showSuccessMsg('删除成功');
    dispatch(CLOSE_ACTION);
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

