import { connect } from 'react-redux';
import ConfirmDialog from '../../../components/ConfirmDialog';
import {fetchJson, showSuccessMsg, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search} from '../../../common/search';
import {updateTable} from './OrderPageContainer';

const STATE_PATH = ['platform', 'formStateConfiguration','confirm'];
const action = new Action(STATE_PATH);
const CLOSE_ACTION = action.assignParent({confirm: undefined});
const CLOSE_EDIT_ACTION = action.assignParent({edit: undefined});

const URL_DEL = '/api/platform/formStateConfiguration/delete';
const URL_LIST = '/api/platform/formStateConfiguration/list';
const URL_SAVE = '/api/platform/formStateConfiguration/save';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const okActionCreator = () => async (dispatch, getState) => {
  const {checkedType,option} = getSelfState(getState());
  if(checkedType){
    const res = await fetchJson(`${URL_DEL}/${checkedType}`, 'delete');
    if (res.returnCode) {
      showError(res.returnMsg);
      dispatch(CLOSE_ACTION);
    } else {
      const data = await search(URL_LIST, 0, 10,{});
      dispatch(action.assignParent({tableItems: data.result.data}));
      showSuccessMsg('删除成功');
      dispatch(CLOSE_ACTION);
    }
  }else {
    const {returnCode, returnMsg} = await fetchJson(URL_SAVE, option);
    if (returnCode !== 0) {
      showError(returnMsg);
      return;
    }
    dispatch(CLOSE_ACTION);
    dispatch(CLOSE_EDIT_ACTION);
    return updateTable(dispatch, getState);
  }


};


const cancelActionCreator = () => (dispatch) => {
  dispatch(CLOSE_EDIT_ACTION);
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

