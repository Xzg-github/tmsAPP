import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import helper,{postOption, validValue, fetchJson, showError} from '../../../common/common';
import {toFormValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {updateTable} from './OutPutTypeContainer';


const URL_ADD = '/api/config/dataset/addOutput';
const URL_EDIT = '/api/config/dataset/addOutput';
const URL_REPORT = '/api/config/dataset/reportType';//模板类型下拉

const STATE_PATH = ['config', 'dataSet','dataSet1','edit'];
const action = new Action(STATE_PATH);
const CLOSE_ACTION = action.assignParent({edit: undefined});

const buildEditState = (config, data, edit, editIndex) => {
  return {
    edit,
    editIndex,
    config: config.config,
    controls: config.controls,
    title: edit ? config.edit : config.add,
    value: data,
    size: 'middle'
  };
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  let data, options, body;
  switch (key) {
    case 'reportTypeConfigId': {
      body = {maxNumber: 0,param:{modeName:title}};
      data = await fetchJson(URL_REPORT, helper.postOption(body));
      break;
    }
    default:
      return;
  }
  if (data.returnCode != 0) {
    return;
  }
  options = data.result;
  const index = controls.findIndex(item => item.key == key);
  dispatch(action.update({options}, 'controls', index));
};

const changeActionCreator = (keyName, keyValue) => async (dispatch, getState) => {
  dispatch(action.assign({[keyName]: keyValue}, 'value'));
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const { value, controls ,edit} = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  const options = postOption(toFormValue(value),edit?"put":'post');
  let data = await fetchJson(URL_ADD, options);
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
