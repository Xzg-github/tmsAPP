import { connect } from 'react-redux';
import EditDialog from './EditDialog';
import { postOption, fetchJson, validValue, showError } from '../../../common/common';
import { Action } from '../../../action-reducer/action';
import { getPathValue } from '../../../action-reducer/helper';

const STATE_PATH = ['config', 'datalib', 'transform', 'edit'];
const action = new Action(STATE_PATH);
const actionParent = new Action(['config', 'datalib', 'transform']);
const CLOSE_ACTION = action.assignParent({ edit: undefined });
const URL_INSERT = '/api/config/datalib/trans_insert';
const URL_UPDATE = '/api/config/datalib/trans_update';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const getParentState = (rootState) => {
  return getPathValue(rootState, ['config', 'datalib', 'transform']);
};

const buildAddState = (config, data, edit, editIndex) => {
  return {
    edit,
    editIndex,
    config: config.config,
    controls: config.controls,
    title: edit ? config.edit : config.add,
    value: data
  };
};

const changeActionCreator = (key, value) => {
  return action.assign({ [key]: value }, 'value');
};

const exitValidActionCreator = () => {
  return action.assign({ valid: false });
};

const okActionCreator = () => async (dispatch, getState) => {
  const { edit, editIndex, value, controls } = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({ valid: true }));
    return;
  }
  const postData = {
    id: value.id ? value.id : '',
    apiName: value.apiName,
    code: value.code,
    api: value.api,
    valuePath: value.valuePath
  };
  let res;
  if (edit) {
    res = await fetchJson(URL_UPDATE, postOption(postData, 'put'));
  } else {
    res = await fetchJson(URL_INSERT, postOption(postData));
  }
  if (res.returnCode) {
    showError(res.returnMsg);
  } else {
    if (edit) {
      dispatch(actionParent.update(res.result, 'tableItems', editIndex));
    } else {
      dispatch(actionParent.add(res.result, 'tableItems', 0));
    }
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
  onChange: changeActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

const TransformAddDialogContainer = connect(mapStateToProps, actionCreators)(EditDialog);

export default TransformAddDialogContainer;
export { buildAddState };

