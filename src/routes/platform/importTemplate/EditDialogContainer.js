import { connect } from 'react-redux';
import EditDialog from './EditDialog';
import {postOption, fetchJson, showError, validValue} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {updateTable} from './OrderPageContainer';
import {toFormValue} from '../../../common/check';

const URL_NEW = '/api/platform/importTemplate/new';
const URL_UPDATE = '/api/platform/importTemplate/edit';
const URL_API_LIST = '/api/platform/importTemplate/api_list';

const PARENT_STATE_PATH = ['platform', 'importTemplate'];
const STATE_PATH = ['platform', 'importTemplate', 'edit'];
const action = new Action(STATE_PATH);
const actionParent = new Action(PARENT_STATE_PATH);
const CLOSE_ACTION = action.assignParent({edit: undefined});

const buildEditState = (config, data, isEdit, editIndex, modeDic, fileList, upload, newModeValue) => {
  let newConfig = config;
  let label;
  if(isEdit){
    if(newModeValue){
      data.modeValue = newModeValue;
      modeDic.map(item =>{
        if(data.uploadMode === item.value){
          label = item.title;
        }
      })
      if(data.active === 'active_unactivated'){
        const [ ...controls ] = config.controls;
        controls.map(item => {
          if (item.key === 'modeValue') {
            item.type = 'search';
            item.title = label;
            item.required = true;
          }
        });
        newConfig = Object.assign({}, config, {controls});
      }else if(data.active === "active_activated"){
        const [ ...editControls ] = config.editControls;
        editControls.map(item => {
          if (item.key === 'modeValue') {
            item.type = 'readonly';
            item.title = label;
            item.required = true;
          }
        });
        newConfig = Object.assign({}, config, {editControls});
      }
    }else {
      data;
      modeDic.map(item =>{
        if(data.uploadMode === item.value){
          label = item.title;
        }
      })
      if(data.active === 'active_unactivated'){
        const [ ...controls ] = config.controls;
        controls.map(item => {
          if (item.key === 'modeValue') {
            item.type = 'text';
            item.title = label;
            item.required = true;
          }
        });
        newConfig = Object.assign({}, config, {controls});
      }else if(data.active === "active_activated"){
        const [ ...editControls ] = config.editControls;
        editControls.map(item => {
          if (item.key === 'modeValue') {
            item.type = 'readonly';
            item.title = label;
            item.required = true;
          }
        });
        newConfig = Object.assign({}, config, {editControls});
      }
    }
  }else{
    const [ ...controls ] = config.controls;
    controls.map(item => {
      if (item.key === 'modeValue') {
        item.type = 'search';
        item.title = 'EPLD导入库';
        item.required = true;
      }
    });
    newConfig = Object.assign({}, config, {controls});
  }
  return {
    modeDic,
    isEdit,
    editIndex,
    config: config.config,
    ...newConfig,
    title: isEdit ? config.edit : config.add,
    value: data,
    fileList: fileList,
    size: 'middle',
    upload: upload
  };
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const getParentState = (rootState) => {
  return getPathValue(rootState, PARENT_STATE_PATH);
};

const changeActionCreator = (file) => (dispatch, getState) => {
  dispatch(action.assign({fileList: [file]}));
};

const removeActionCreator = () => (dispatch) => {
  dispatch(action.assign({fileList: []}));
};

const formSearchActionCreator = (key, value) => async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  if(key ==='modeValue'){
    const body = {maxNumber: 10, filter: value};
    const res = await fetchJson(URL_API_LIST, postOption(body));
    if(res.returnCode !== 0){
      showError(res.returnMsg);
      return;
    }
    const index = controls.findIndex(item => item.key == key);
    dispatch(action.update({options: res.result}, 'controls', index));
  }
};

const formChangeActionCreator = (key, value) => (dispatch, getState) => {
  const {modeDic, controls} = getSelfState(getState());
  let label = '';
  if(key === 'uploadMode' && value){
    dispatch(action.assign({[key]: value, modeValue: ''}, 'value'));
    dispatch(action.assign({fileList: []}));
    if(value !== 'upload_mode_epld_excel'){
      const upload = true;
      dispatch(action.assign({upload}));
      dispatch(action.update({type: 'text', required: true}, 'controls', {key: 'key', value: 'modeValue'}));
    }else{
      const upload = false;
      dispatch(action.assign({upload}));
      dispatch(action.update({type: 'search', required: true}, 'controls', {key: 'key', value: 'modeValue'}));
    }
    modeDic.map(item =>{
      if(value === item.value){
        label = item.title;
      }
    })
    dispatch(action.update({title: label}, 'controls', {key: 'key', value: 'modeValue'}));
  }
  dispatch(action.assign({[key]: value}, 'value'));
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const {isEdit, editIndex, value, controls, fileList} = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  let newFile;
  if(value.uploadMode === 'upload_mode_epld_excel'){
    newFile = [];
  }else{
    if(fileList && fileList.length ===1){
      newFile = fileList.map(item => ({fileFormat: item.fileFormat || 'id', fileName: item.name, fileUrl: item.response.result}));
    }else{
      showError('附件不能没空！');
      return;
    }
  }
  const postData = {
    id: value.id? value.id: '',
    uploadSubject: value.uploadSubject,
    downloadSubject: value.downloadSubject,
    uploadMode: value.uploadMode,
    modeValue: value.modeValue,
    notifyEmailAddress: value.notifyEmailAddress,
    uploadTemplate: newFile
  };
  let option, data;
  if(isEdit){
    data = await fetchJson(URL_UPDATE, postOption(toFormValue(postData), 'put'));
  }else{
    option = postOption(toFormValue(postData));
    data = await fetchJson(URL_NEW, option);
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
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
  onChange: changeActionCreator,
  onRemove: removeActionCreator,
  onFormSearch: formSearchActionCreator,
  onFormChange: formChangeActionCreator,
  onExitValid: exitValidActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(EditDialog);
export default Container;
export {buildEditState};
