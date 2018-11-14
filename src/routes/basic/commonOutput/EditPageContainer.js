import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import helper,{postOption, validValue, fetchJson, showError} from '../../../common/common';
import {toFormValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {updateTable} from './OrderPageContainer';

const URL_ADD = '/api/basic/commonOutput/add';
const URL_REPORT = '/api/config/dataset/reportType';//模板类型下拉
const URL_REPORT_NAME = '/api/basic/commonOutput/reportName';//模板名称下拉

const STATE_PATH =  ['basic', 'commonOutput','edit'];
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
  const {controls,value} = getSelfState(getState());
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
  const {controls,value} = getSelfState(getState());
  let data, options, body;
  if(keyName === 'reportTypeConfigId' && keyValue){
    data = await fetchJson(`${URL_REPORT_NAME}/${keyValue.value}`,'get');
    if (data.returnCode != 0) {
      return;
    }
    options = data.result;
    const index = controls.findIndex(item => item.key == 'reportConfigId');

    dispatch(action.update({options}, 'controls', index));
  }
  dispatch(action.assign({[keyName]: keyValue}, 'value'));
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const { edit, value, controls } = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  let options = toFormValue(value);
  let arr = [];
  options.reportConfigId.forEach(item => {
    arr.push({
      reportTypeConfigId:options.reportTypeConfigId,
      reportConfigId:item
    })
  });

  arr = postOption(arr,  "post");
  let data = await fetchJson(URL_ADD, arr);
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
