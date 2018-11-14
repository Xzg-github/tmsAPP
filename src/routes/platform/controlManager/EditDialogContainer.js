import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import {postOption, fetchJson, showError, validValue} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {updateTable} from './OrderPageContainer';
import {search} from '../../../common/search';

const URL_NEW = '/api/platform/controlManager/new';
const URL_UPDATE = '/api/platform/controlManager/edit';
const URL_SERVICE_LIST = '/api/platform/serviceManager/list';

const PARENT_STATE_PATH = ['platform',  'controlManager'];
const STATE_PATH = ['platform',  'controlManager', 'edit'];
const action = new Action(STATE_PATH);
const actionParent = new Action(PARENT_STATE_PATH);
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

const getParentState = (rootState) => {
  return getPathValue(rootState, PARENT_STATE_PATH);
};

const changeActionCreator = (key, value) => async (dispatch,getState) => {
    dispatch(action.assign({[key]: value}, 'value'));
};

const formSearchActionCreator = (key, value) => async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  if(key ==='serviceId'){
    let res = await search(URL_SERVICE_LIST, 0, 10, {['serviceName'] : value});
    let items = res.result.data;
    let options = [];
    items.map((item) => {
      options.push({
        value: item.id,
        title: item.serviceName
      })
    });
    const index = controls.findIndex(item => item.key == key);
    dispatch(action.update({options}, 'controls', index));
  }
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
  let data;
  if(edit){
    const postData = {
      id: edit? value.id: '',
      serviceId: value.serviceId.value,
      controllerName: value.controllerName,
      controllerUrl: value.controllerUrl,
      controllerPath:value.controllerPath,
      controllerExplain: value.controllerExplain
    };
    data = await fetchJson(URL_UPDATE, postOption(postData));
  }else{
    const postData = {
      serviceId: value.serviceId.value,
      controllerName: value.controllerName,
      controllerUrl: value.controllerUrl,
      controllerPath:value.controllerPath,
      controllerExplain: value.controllerExplain
    };
    data = await fetchJson(URL_NEW, postOption(postData));
  }
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
