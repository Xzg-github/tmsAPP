import { connect } from 'react-redux';
import EditPage from './EditPage/EditPage';
import helper, {postOption, fetchJson} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {toFormValue} from '../../../common/check';
import {updateTable} from './OrderPageContainer';
import addRecivers from './addRecivers/addRecivers'



const STATE_PATH = ['basic', 'defaultOutput','edit'];
const URL_SAVE = '/api/basic/defaultOutput/save';
const URL_REPORT = '/api/basic/defaultOutput/template';//模板类型下拉
const URL_CLIENT = '/api/basic/client2/base/business_drop_list';//客户下拉
const URL_SEARCH_NAME = '/api/basic/supplier/base/search/name'; //供应商下拉
const URL_INSTITUTION = '/api/basic/institution/list'; // 机构
const URL_REPORT_NAME = '/api/basic/commonOutput/reportName';//模板名称下拉


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

const createContainer = (statePath) => {
  const action = new Action(statePath, true);
  const CLOSE_ACTION = action.assignParent({edit: undefined});

  const getSelfState = (rootState) => {
    return getPathValue(rootState, statePath);
  };

  const changeActionCreator = (keyName, keyValue) => async (dispatch, getState) => {
    const {controls,value,tableCols} = getSelfState(getState());
    let data, options, body;
    if(keyName === 'reportTypeConfigId' && keyValue){
      dispatch(action.assign({[keyName]: keyValue}, 'value'));
      data = await fetchJson(`${URL_REPORT_NAME}/${keyValue.value}`,'get');
      if (data.returnCode != 0) {
        return;
      }
      options = data.result;
      tableCols.map(item => item.key == 'reportConfigId' ? item.options = options : null);
    }
    if(keyName === 'outputType' && keyValue){
      if(value.reportTypeConfigId){
        value.reportTypeConfigId = ""
      }
      data =await fetchJson(`${URL_REPORT}/${keyValue}`,'get');
      if (data.returnCode != 0) {
        return;
      }
      options = data.result;
      controls.map(item => item.key == 'reportTypeConfigId' ? item.options = options : null);
    }
    dispatch(action.assign({[keyName]: keyValue}, 'value'));
  };


  const searchActionCreator = (key, keyValue) => async (dispatch,getState) => {
    const {controls,value} = getSelfState(getState());
    let data, options, body,res;
    switch (key) {
      case 'reportTypeConfigId': {
        if(!value.outputType){
          return
        }
        body = {maxNumber: 0,param:{modeName:value.outputType}};
        data =await fetchJson(`${URL_REPORT}/${value.outputType}`,'get');
        if (data.returnCode != 0) {
          return;
        }
        break;
      }
      case 'customerId' : {
        body = {customerName: keyValue,maxNumber:65536};
        data = await fetchJson(URL_CLIENT, helper.postOption(body));
        if (data.returnCode != 0) {
          return;
        }
        break;
      }
      case 'supplierId' : {
        body = {filter:keyValue};
        data = await fetchJson(URL_SEARCH_NAME, helper.postOption(body));
        if (data.returnCode != 0) {
          return;
        }
        break;
      }
      case 'institutionId' : {
        body = {itemFrom:0, itemTo:65536, filter:{}};
        res = await fetchJson(URL_INSTITUTION, helper.postOption(body));
        if (res.returnCode != 0) {
          return;
        }
        data = [];
        res.result.data.forEach(item => {
          data.unshift({
            value:item.guid,
            title:item.institutionName
          })
        });

        break;
      }
      default:
        return;
    }

    options = data.result ? data.result : data;
    const index = controls.findIndex(item => item.key == key);
    dispatch(action.update({options}, 'controls', index));

  };

  const exitValidActionCreator = () => {
    return action.assign({valid: false});
  };

  const required = (value) =>{

  };

  const okActionCreator = () => async (dispatch, getState) => {
    const {edit, value, controls,tableItems} = getSelfState(getState());

    let isRequred = false

    if (!helper.validValue(controls, value)) {
      dispatch(action.assign({valid: true}));
      return;
    }
/*    if(!value.customerId && !value.supplierId && !value.taskUnitCode){
      helper.showError('客户,供应商,作业单元必须填写一个');
      return
    }*/
    if(tableItems.length == 0){
      helper.showError('通知信息不能为空');
      return
    }
    value.list = [];
    tableItems.forEach(item => {
      if(isRequred ){
        return
      }
      if(!item.reciverType){
        helper.showError('类别不能为空');
        isRequred = true;
        return
      }else if(!item.reportConfigId){
        helper.showError('模板名称不能为空');
        isRequred = true;
        return
      }else if(!item.recivers){
        helper.showError('接受信息不能为空');
        isRequred = true;
        return
      }
      isRequred = false;
      item = toFormValue(item);
      value.list.push(item)
    });

    if(isRequred ){
      return
    }

    const option = postOption(toFormValue(value), edit ? 'put': 'post');
    const {returnCode, result, returnMsg} = await fetchJson(URL_SAVE, option);
    if (returnCode !== 0) {
      helper.showError(returnMsg);
      return;
    }
    helper.showSuccessMsg('保存成功');
    let isShow = false;
    dispatch(action.assign({ isShow }));
    return updateTable(dispatch, getState);

  };

  const checkActionCreator = (rowIndex, keyName, checked) => {
    return action.update({checked}, 'tableItems', rowIndex);
  };

  const contentChangeActionCreator = (rowIndex, keyName, value) => async (dispatch, getState) => {
    dispatch(action.update({[keyName]: value}, 'tableItems', rowIndex));
  };


  const addAction = (dispatch, getState) => {
    dispatch(action.add({}, 'tableItems', 0))
  };

  const delAction = (dispatch, getState) => {
    const {tableItems} = getSelfState(getState());
    const newItems = tableItems.filter(item => !item.checked);
    dispatch(action.assign({tableItems: newItems}));
  };

  const addReciversAction  = (dispatch, getState) => {
    const {tableItems} = getSelfState(getState());
    let reciverType,recivers;
    const newItems = tableItems.filter(item => item.checked);
    const index = tableItems.findIndex(item => item.checked);
    if(newItems.length == 1){
      if(newItems[0].reciverType){

        addRecivers(newItems[0].recivers,index,newItems[0].reciverType)
      }else {
        helper.showError('类别不能为空');
      }

    }else {
      helper.showError('请勾选一个');
    }

  };


  const toolbarActions = {
    add: addAction,
    delete: delAction,
    addRecivers: addReciversAction
  };

  const clickActionCreator = (key) => {
    if (toolbarActions.hasOwnProperty(key)) {
      return toolbarActions[key];
    } else {
      console.log('unknown key:', key);
      return {type: 'unknown'};
    }
  };


  const cancelActionCreator = () => (dispatch) => {
    let isShow = false;
    dispatch(action.assign({ isShow }));
  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const actionCreators = {
    onClick: clickActionCreator,
    onChange: changeActionCreator,
    onSearch: searchActionCreator,
    onExitValid: exitValidActionCreator,
    onOk: okActionCreator,
    onCancel: cancelActionCreator,
    onCheck: checkActionCreator,
    onContentChange: contentChangeActionCreator,
  };

  return connect(mapStateToProps, actionCreators)(EditPage);
};

const EditDialogContainer = createContainer(STATE_PATH);
export default EditDialogContainer;
export {createContainer};
export {buildEditState};
