import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import {postOption, validValue, fetchJson, showError} from '../../../common/common';
import addService from './addService';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {updateTable} from './OrderPageContainer';

const URL_SAVE = '/api/platform/urlResourceLib/add';
const URL_UPDATE = '/api/platform/urlResourceLib/update';
const URL_SERVICE_RESOURCE_OPTIONS = '/api/platform/urlResourceLib/service_resource_options';
const URL_CONTROLLER_RESOURCE_OPTIONS = '/api/platform/urlResourceLib/controller_resource_options';
const STATE_PATH = ['platform', 'urlResourceLib', 'edit'];
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

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(CLOSE_ACTION);
};

const changeActionCreator = (keyName,keyValue) => async (dispatch, getState) => {
  const {serviceItems,value,edit,controls,controllerItems} = getSelfState(getState());
  let id,res,data,options,index;
  if(keyName === "service_serviceName" && keyValue){
    if(value.controller_controllerName){
      value.controller_controllerName = "";
      value.url = "";
    }
    options = []
    serviceItems.forEach(item =>{
      if(item.title === keyValue.title){
        id = item.value;
      }
    });
    if(id){
      dispatch(action.assign({id:id}));
    }
  }
  if(keyName === "controller_controllerName" && keyValue){
    controllerItems.forEach(item =>{
      if(item.value === keyValue.value){
        value.url = item.url
      }
    });
  }

  dispatch(action.assign({[keyName]: keyValue}, 'value'));



};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
  const {controls,id,value} = getSelfState(getState());
  let data, options,serviceItems,items,controllerId,controllerItems;
  switch (key) {
    case 'service_serviceName': {
      data = await fetchJson(URL_SERVICE_RESOURCE_OPTIONS);
      if (data.returnCode != 0) {
        showError(data.returnMsg);
        return;
      }
      items = data.result;
      options = [];
      items.map((item) => {
        options.push({
          value: item.id,
          title: item.serviceName
        })
      });
      serviceItems= options;
      const index = controls.findIndex(item => item.key == key);
      dispatch(action.update({options}, 'controls', index));
      dispatch(action.assign({serviceItems:serviceItems}));
      break;
    }
    case 'controller_controllerName': {
      controllerId = id ? id : value.service_id;
      if( controllerId ){
        data = await fetchJson(`${URL_CONTROLLER_RESOURCE_OPTIONS}/${controllerId}`)
        items = data.result;
        options = [];
        items.map((item) => {
          options.push({
            value: item.id,
            title: item.controllerName,
            url:item.controllerUrl
        })
        });
        controllerItems = options;
        const index = controls.findIndex(item => item.key == key);
        dispatch(action.update({options}, 'controls', index));
        dispatch(action.assign({controllerItems}));
      }
    }
    default:
      return;
  }

};

const okActionCreator = () => async (dispatch, getState) => {
  const {edit, editIndex, value, controls} = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  let data;
  const postData = {
    controllerId:value.controller_controllerName.value,
    isOpenApi:value.isOpenApi,
    isPublicApi:value.isPublicApi,
    requestMode:value.requestMode,
    serviceId:value.service_serviceName.value,
    url:value.url,
    urlName:value.urlName,
    isNeedPermissionController:value.isNeedPermissionController
  };
  if(edit){
    postData.id = value.id
    data = await fetchJson(URL_UPDATE, postOption(postData));
  }else{
    data = await fetchJson(URL_SAVE, postOption(postData));
  }
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  dispatch(CLOSE_ACTION);
  return updateTable(dispatch, getState);
};

const addActionCreator = (key) => async (dispatch, getState) => {
  const {value,controls} = getSelfState(getState())
  if( key ==='service_serviceName'){
    addService()
  }else if( key === 'controller_controllerName'){
    if( !value.service_serviceName || value.service_serviceName === "" ){
      return showError("请选择所属服务名")
    }else{
      addService(value,controls)
    }
  }
};

const actionCreators = {
  onExitValid: exitValidActionCreator,
  onCancel: cancelActionCreator,
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onOk: okActionCreator,
  onAdd:addActionCreator

};

const Container = connect(mapStateToProps, actionCreators)(EditDialog);
export default Container;
export {buildEditState};
