import { connect } from 'react-redux';
import EmailAcceptConfigurationEditDialog from './EmailAcceptConfigurationEditDialog';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import helper,{postOption, fetchJson, showError, validValue} from '../../../common/common';
import {updateTable} from './EmailAcceptConfigurationContainer';
import LeadDialog from './LeadDialog';
import showPopup from '../../../standard-business/showPopup';

const prefix = ['config', 'emailAccept', 'accept', 'edit'];
const action = new Action(prefix);
const parent_fix = ['config', 'emailAccept', 'accept'];
const CLOSE_ACTION = action.assignParent({edit: undefined});

const URL_LEAD_LIST ='/api/config/emailAccept/lead_list';
const URL_EMAIL_DROP = '/api/config/emailAccept/email_drop';
const URL_ACCEPT_ADD = '/api/config/emailAccept/accept_add';
const URL_ACCEPT_EDIT = '/api/config/emailAccept/accept_edit';
const URL_EXCEL_LIST = '/api/config/emailAccept/excel';

const getSelfState = (rootState) => {
  return getPathValue(rootState, prefix);
};

export const buildEditState = (config, data={}, edit, editIndex=-1) => {
  return {
    ...config,
    edit,
    editIndex,
    title: edit ? config.edit : config.add,
    visible: true,
    value: data,
    tableItems: edit ? data.details : []
  };
};

const changeActionCreator = (key, value) => (dispatch, getState) => {
  const { editControls, editControls1} = getSelfState(getState());
  if(key === 'uploadMode' && value){
    if(value === 'upload_mode_epld_excel'){
      dispatch(action.update({type: 'search', required: true}, 'editControls', {key: 'key', value: 'excelModelConfigId'}));
      dispatch(action.update({type: 'search', required: true}, 'editControls1', {key: 'key', value: 'excelModelConfigId'}));
    }else{
      dispatch(action.assign({[key]: value, excelModelConfigId: ''}, 'value'));
      dispatch(action.update({type: 'readonly', required: false}, 'editControls', {key: 'key', value: 'excelModelConfigId'}));
      dispatch(action.update({type: 'readonly', required: false}, 'editControls1', {key: 'key', value: 'excelModelConfigId'}));
    }
  }
  dispatch(action.assign({[key]: value}, 'value'));
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
  const {controls, value, editControls, editControls1} = getSelfState(getState());
  let body, res;
  if(key === 'emailAddressConfigId'){
    body = {maxNumber: 10, filter: title};
    res = await fetchJson(URL_EMAIL_DROP, postOption(body));
    let index = {key: 'key', value: 'emailAddressConfigId'};
    dispatch(action.update({options: res.result}, 'controls', index));
    dispatch(action.update({options: res.result}, 'editControls1', index));
  } else if(key ==='excelModelConfigId'){
    res = await fetchJson(`${URL_EXCEL_LIST}/${value.importTemplateConfigId.value}`);
    let index = {key: 'key', value: 'excelModelConfigId'};
    dispatch(action.update({options: res.result}, 'editControls', index));
    dispatch(action.update({options: res.result}, 'editControls1', index));
  }else if(key ==='importTemplateConfigId'){
    body = {maxNumber: 10, filter: title};
    res = await fetchJson(URL_LEAD_LIST, postOption(body));
    let options = [];
    res.result.map((item) => {
      options.push({
        value: item.id,
        title: item.uploadSubject
      })
    });
    let index = {key: 'key', value: 'importTemplateConfigId'};
    dispatch(action.update({options}, 'editControls1', index));
  }
};

const contentChangeActionCreator = (rowIndex, keyName, value) => (dispatch, getState) => {
  dispatch(action.update({[keyName]: value}, 'tableItems', rowIndex));
};

const contentSearchActionCreator = (rowIndex, keyName, value) => async(dispatch, getState) => {
  const {tableCols, tableItems} = getSelfState(getState());
  if(keyName === 'excelModelConfigId' && tableItems[rowIndex].importTemplateConfigId){
    const {returnCode, result, returnMsg} = await fetchJson(`${URL_EXCEL_LIST}/${tableItems[rowIndex].importTemplateConfigId.value}`);
    if(returnCode !== 0){
      showError(returnMsg);
      return;
    }
    const newOptions = result;
    const {options = {}} = tableItems[rowIndex];
    const newOption = Object.assign({}, options, {'excelModelConfigId': newOptions});
    dispatch(action.update({options: newOption}, 'tableItems', rowIndex));
  }
};

const addActionCreator = async(dispatch, getState) => {
  const {leadConfig, value, tableItems, result, edit} = getSelfState(getState());
  const onOk = (checkedItems=[]) => {
    for(let i = 0; i< checkedItems.length; i++) {
      let isRequired = [];
      let isReadonly = [];
      if(checkedItems[i].uploadMode === 'upload_mode_epld_excel'){
        checkedItems[i].isRequired=['excelModelConfigId'];
        checkedItems[i].isReadonly = [];
      }else{
        checkedItems[i].isReadonly=['excelModelConfigId'];
        checkedItems[i].isRequired = [];
      }
    }
    if(tableItems.length <=0){
      dispatch(action.assign({ tableItems: checkedItems }));
    }else{
      dispatch(action.assign({ tableItems: tableItems.concat(checkedItems) }));
    }
  };
  const res = await fetchJson(URL_LEAD_LIST, postOption({ filter: ''}));
  if(res.returnCode === 0) {
    const leadDialogConfig = leadConfig;
    const props = {
      ...leadDialogConfig,
      items: res.result,
      tableItems,
      onOk
    };
    return showPopup(LeadDialog, props);
  }else if(res.returnCode !== 0){
    showError(res.returnMsg);
  }
};

const delActionCreator = (dispatch, getState) =>  {
  const state = getSelfState(getState());
  const [ ...tableItems ] = state.tableItems;
  const items = tableItems.filter(item => !item.checked);
  dispatch(action.assign({tableItems: items}));
};

const okActionCreator = () => async (dispatch, getState) => {
  const {edit, controls, value, tableItems, tableCols, editControls, editControls1} = getSelfState(getState());
  let postData, res;
  if(!edit){
    const list = tableItems.filter(item=>item.isRequired && item.isRequired.length>0);
    if(list.some(item => !item.excelModelConfigId) ){
      return showError('请填写必填项！');
    } else if (!validValue(controls, value)) {
      dispatch(action.assign({valid: true}));
      return;
    }else if (!helper.validArray(tableCols, tableItems.filter(item => !item.readonly))) {
      dispatch(action.assign({valid: true, form: false}));
      return;
    }
    postData = {
      id: edit? value.id: '',
      emailAddressConfigId: value.emailAddressConfigId.value,
      datas: tableItems? tableItems.map(item => helper.convert(item)) : []
    };
    res = await fetchJson(URL_ACCEPT_ADD, postOption(postData));
  }else{
    if(value.active === "active_unactivated"){
      if (!validValue(editControls1, value)) {
        dispatch(action.assign({valid: true}));
        return;
      }
    }else{
      if (!validValue(editControls, value)) {
        dispatch(action.assign({valid: true}));
        return;
      }
    }
    res = await fetchJson(URL_ACCEPT_EDIT, postOption(helper.convert(value), 'put'));
  }
  if (res.returnCode !== 0) {
    showError(res.returnMsg);
    return;
  }
  dispatch(CLOSE_ACTION);
  return updateTable(dispatch, getState);
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(CLOSE_ACTION);
};

const toolbars = {
  add: addActionCreator,
  del: delActionCreator
};

const clickActionCreator = (key) => {
  if (toolbars.hasOwnProperty(key)) {
    return toolbars[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel:cancelActionCreator,
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onContentChange: contentChangeActionCreator,
  onContentSearch: contentSearchActionCreator,
  onClick: clickActionCreator,
  onExitValid: exitValidActionCreator
};

const container = connect(mapStateToProps, actionCreators)(EmailAcceptConfigurationEditDialog);
export default container;
