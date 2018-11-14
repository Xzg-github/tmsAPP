import { connect } from 'react-redux';
import EditDialog from '../../components/EditDialog';
import helper, {postOption, fetchJson, showError} from '../../common/common';
import {Action} from '../../action-reducer/action';
import {getPathValue} from '../../action-reducer/helper';

const createEditDialogContainer = (urls, statePath, afterEditActionCreator, onSearch) => {
  const {URL_SAVE} = urls;
  const STATE_PATH = statePath;
  const action = new Action(STATE_PATH, false);

  const getSelfState = (rootState) => {
    return getPathValue(rootState, STATE_PATH);
  };

  const changeActionCreator = (key, value) => {
    return action.assign({[key]: value}, 'value');
  };

  const searchActionCreator = (key, value) => (dispatch, getState) => {
    if (onSearch) {
      const env = {dispatch, action, state: getSelfState(getState())};
      onSearch(key, value, env);
    }
  };

  const exitValidActionCreator = () => {
    return action.assign({valid: false});
  };

  const okActionCreator = () => async (dispatch, getState) => {
    const {edit, value, controls} = getSelfState(getState());
    if (!helper.validValue(controls, value)) {
      dispatch(action.assign({valid: true}));
      return;
    }

    const option = postOption(helper.convert(value), edit ? 'put': 'post');
    const {returnCode, returnMsg, result} = await fetchJson(URL_SAVE, option);
    if (returnCode === 0) {
      afterEditActionCreator(result, edit)(dispatch, getState);
    } else {
      showError(returnMsg);
    }
  };

  const cancelActionCreator = () => {
    return afterEditActionCreator();
  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const actionCreators = {
    onSearch: searchActionCreator,
    onChange: changeActionCreator,
    onExitValid: exitValidActionCreator,
    onOk: okActionCreator,
    onCancel: cancelActionCreator
  };

  return connect(mapStateToProps, actionCreators)(EditDialog);
};

export default createEditDialogContainer;
