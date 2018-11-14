import { connect } from 'react-redux';
import SignatureDialog from './SignatureDialog';
import {postOption, fetchJson, showError, validValue} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {updateTable} from './OrderPageContainer';
import {toFormValue} from '../../../common/check';

const URL_NEW = '/api/platform/mouldMake/new';
const URL_UPDATE = '/api/platform/mouldMake/edit';

const PARENT_STATE_PATH = ['platform', 'mouldMake'];
const STATE_PATH = ['platform', 'mouldMake', 'signatureDialog'];
const action = new Action(STATE_PATH);
const actionParent = new Action(PARENT_STATE_PATH);
const CLOSE_ACTION = action.assignParent({signatureDialog: undefined});

const buildSignatureState = (config, data, key, isEdit, editIndex) => {
  let newConfig = config;
  return {
    key,
    isEdit,
    editIndex,
    config: config.config,
    ...newConfig,
    controls: newConfig.signatureControls,
    title: isEdit ? config.edit : config.add,
    value: data,
    size: 'middle'
  };
};


const createContainer = (statePath, afterEditActionCreator) => {
  const action = new Action(statePath);

  const getSelfState = (rootState) => {
    return getPathValue(rootState, statePath);
  };

const changeActionCreator = (key, value) => async (dispatch,getState) => {
  dispatch(action.assign({[key]: value}, 'value'));
};

const formSearchActionCreator = () => {

};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const {isEdit, editIndex, value, controls, key} = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  const postData = {
    id: value.id? value.id: '',
    modelType: value.modelType? value.modelType: key,
    excelReportGroup: value.excelReportGroup,
    modelName: value.modelName,
    content: value.content
  };
  let option, data;
  if(isEdit){
    data = await fetchJson(URL_UPDATE, postOption(toFormValue(postData), 'put'));
  }else{
    data = await fetchJson(URL_NEW, postOption(toFormValue(postData)));
  }
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  const result = data.result;
  afterEditActionCreator(result)(dispatch, getState);
};

const cancelActionCreator = () => (dispatch, getState) => {
  afterEditActionCreator()(dispatch, getState);
};

const actionCreators = {
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };



  return connect(mapStateToProps, actionCreators)(SignatureDialog);
};


const afterEditActionCreator = (result) => (dispatch, getState) => {
  dispatch(CLOSE_ACTION);
  result && updateTable(dispatch, getState);
};

const Container = createContainer(STATE_PATH, afterEditActionCreator);
export default Container;
export {buildSignatureState, createContainer};

