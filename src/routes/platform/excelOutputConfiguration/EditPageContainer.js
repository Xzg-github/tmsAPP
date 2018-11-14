import { connect } from 'react-redux';
import EditPage from './EditPage/EditPage';
import helper, {postOption, fetchJson} from '../../../common/common';
import {toFormValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {updateTable} from './OrderPageContainer';
import addService from './addService';
import showImportDiaLog from './ImportDialogContainer'

// 为EditPage组件构建状态
const buildEditPageState = (config={}, data, edits) => {

  return {
    edits,
    ...config,
    size:'large',
    title: edits ? config.edit : config.add,
    value: data,
    tableItems2:JSON.parse(data.gridConfig ? data.gridConfig : "[]" )
  };
};

const handelComponentType = async(key) => {
  let type,title,options = [],span,formValue,props={};
  switch(key){
    case 'search' : {
      type = 'select';
      title = '下拉数据源';
      let names = ['searchType'];
      let data = await fetchJson(DICTIONARY_URL, postOption({names}));
      if(data.returnCode !== 0) {
        helper.showError(data.returnMsg);
        return {type:'readonly',title:'数据源'}
      }
      options = data.result.searchType;
      break
    }
    case 'select' : {
      type = 'textArea';
      title = '自定义数据';
      formValue = '[{"title":"","value":""}]';
      props.placeholder  =  '[{"title":"","value":""}]';
      span = 2;
      break
    }
    case 'dictionary' : {
      type = 'text';
      title = '字典编码';
      break
    }
    default:
      return {type:'readonly',title:'数据源'}
  }

  return {type,title,options,span,formValue,props}
};


const STATE_PATH = ['platform', 'excelOutputConfiguration','edit'];
const PARENT_STATE_PATH = ['basic', 'orderCreateService'];
const action = new Action(STATE_PATH);
const CLOSE_ACTION = action.assignParent({edit: undefined});
const URL_SAVE = '/api/platform/excelOutputConfiguration/save';
const URL_UPDATE = '/api/platform/excelOutputConfiguration/update';
const DICTIONARY_URL = '/api/dictionary';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (keyName, keyValue) => async (dispatch, getState) => {
  dispatch(action.assign({[keyName]: keyValue}, 'value'));
};


const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};


const searchActionCreator = (key, title) => async (dispatch, getState) => {


};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const {edits, controls, tableItems, value,tableItems2,tableCols2} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }

  if(tableItems2.length > 0){
    for(let item of tableItems2){
      if (!helper.validValue(tableCols2,item )) {
        dispatch(action.assign({valid: true}));
        return;
      }

    }
  }

  if(tableItems2.length < 1){
    helper.showError('导出模板不能为空')
    return
  }
  value.parameters = tableItems;
  value.gridConfig = JSON.stringify(tableItems2);
  let option = postOption(toFormValue(value),'post');
  const {returnCode, result, returnMsg} = !edits? await fetchJson(URL_SAVE, option) : await fetchJson(URL_UPDATE, option);
  if (returnCode !== 0) {
    helper.showError(returnMsg);
    return;
  }
  dispatch(CLOSE_ACTION);
  return updateTable(dispatch, getState);
};


const cancelActionCreator = () => (dispatch) => {
  dispatch(CLOSE_ACTION);
};

const addAction = (dispatch, getState) => {
  const {data} = getSelfState(getState());
  data.edit. controls[3].type = 'readonly';
  data.edit.controls[3].required = false;
  data.edit.tableItems2 =  [] ;
  data.edit.tableItems1 = [] ;
  addService(data,true)
};


const editACtion = async(dispatch, getState) => {
  const {tableItems,data} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {

    const {messageList,extList} = tableItems[index];
    data.edit.tableItems2 = messageList ? messageList : [] ;
    data.edit.tableItems1 = extList ? extList : [] ;

    const {type='readonly',title='数据源',options=[],span=1,props ={}} = await handelComponentType(tableItems[index].componentType);
    data.edit.controls[3].type = type;
    data.edit.controls[3].title = title;
    data.edit.controls[3].options = options;
    data.edit.controls[3].props = props;
    data.edit.controls[3].span = span;

    addService(data,false,tableItems[index],index)
  }else {
    const msg = '请勾选一个';
    helper.showError(msg);
  }
};


const delAction = (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const newItems = tableItems.filter(item => !item.checked);
  dispatch(action.assign({tableItems: newItems}));
};

const add1Action = (dispatch, getState) => {
  const {tableItems2} = getSelfState(getState());
  dispatch(action.add({}, 'tableItems2', tableItems2.length))

};


const del1Action = (dispatch, getState) => {
  const {tableItems2} = getSelfState(getState());
  const newItems = tableItems2.filter(item => !item.checked);
  dispatch(action.assign({tableItems2: newItems}));
};

const importAction = (dispatch, getState) => {
  return showImportDiaLog({});
};

const check1ActionCreator = (rowIndex, keyName, checked) => {
  return action.update({checked}, 'tableItems2', rowIndex);
};

const contentChangeActionCreator = (rowIndex, keyName, keyValue) => (dispatch, getState) => {
  dispatch(action.update({[keyName]: keyValue}, 'tableItems2', rowIndex));
};



const toolbarActions = {
  add: addAction,
  add1: add1Action,
  edit:editACtion,
  delete: delAction,
  delete1: del1Action,
  import:importAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onSearch: searchActionCreator,
  onClick: clickActionCreator,
  onCheck: checkActionCreator,
  onCheck1: check1ActionCreator,
  onContentChange: contentChangeActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
};

const EditDialogContainer = connect(mapStateToProps, actionCreators)(EditPage);
export {buildEditPageState,handelComponentType}
export default EditDialogContainer;



