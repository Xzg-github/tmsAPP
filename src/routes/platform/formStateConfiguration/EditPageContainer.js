import { connect } from 'react-redux';
import EditPage from './EditPage/EditPage';
import helper, {postOption, fetchJson} from '../../../common/common';
import {toFormValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {updateTable} from './OrderPageContainer';


const STATE_PATH = ['platform', 'formStateConfiguration', 'edit'];
const PARENT_STATE_PATH = ['platform', 'formStateConfiguration'];
const action = new Action(STATE_PATH);
const actionParent = new Action(['platform', 'formStateConfiguration']);
const CLOSE_ACTION = action.assignParent({edit: undefined});
const URL_SAVE = '/api/platform/formStateConfiguration/save';
const URL_RULE_OPTIONS = '/api/platform/ruleFieldLibrary/valueTypeOptions';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const getParentState = (rootState) => {
  return getPathValue(rootState, PARENT_STATE_PATH);
};

const changeActionCreator = (keyName, keyValue) => async (dispatch, getState) => {
  dispatch(action.assign({[keyName]: keyValue}, 'value'));
};


const checkActionCreator = (rowIndex, keyName, checked) => {
  return action.update({checked}, 'tableItems', rowIndex);
};

const contentChangeActionCreator = (rowIndex, keyName, value) => (dispatch, getState) => {
  dispatch(action.update({[keyName]: value}, 'tableItems', rowIndex));
};

const searchActionCreator = (key, title) => async (dispatch, getState) => {


};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const {edit, controls, tableItems, value} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  let isCode = false;
  let msg;

  if(tableItems.length < 1){
    msg = '表单状态不能为空';
  }else {
    tableItems.forEach(item => {
      if(!item.dictionaryCode){
        isCode = true;
        msg = '表单状态不能为空';
        return
      }
    });
    tableItems.reduce( (a,b) => {
      if(a.dictionaryCode == b.dictionaryCode){
        isCode = true;
        if(!a.dictionaryCode || !b.dictionaryCode){
          msg = '表单状态不能为空';
          return b
        }else {
          msg = '表单状态不能重复';
          return b
        }
      }
      return b
    },[]);
  }

  if(isCode || tableItems.length < 1){
    helper.showError(msg);
    return
  }

  value.dictionaryCodeList = tableItems;

  let option = postOption(toFormValue(value), edit ? 'put': 'post');
  const {returnCode, result, returnMsg} = await fetchJson(URL_SAVE, option);
  if (returnCode !== 0) {
    helper.showError(returnMsg);
    return;
  }
  if(result){
    const confirm = {
      title: '请确认操作',
      ok: '确认',
      cancel: '取消',
      content: '表单类型已存在,是否覆盖？'
    };
    value.flag = true;
    option = postOption(toFormValue(value), edit ? 'put': 'post');
    dispatch(actionParent.assign({...confirm,option}, 'confirm'));
    return
  }
  dispatch(CLOSE_ACTION);
  return updateTable(dispatch, getState);
};


const cancelActionCreator = () => (dispatch) => {
  dispatch(CLOSE_ACTION);
};

const addAction = (dispatch, getState) => {
  dispatch(action.add({}, 'tableItems', 0))
};

const delAction = (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const newItems = tableItems.filter(item => !item.checked);
  dispatch(action.assign({tableItems: newItems}));
};


const toolbarActions = {
  add: addAction,
  delete: delAction
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
  onContentChange: contentChangeActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
};

const EditDialogContainer = connect(mapStateToProps, actionCreators)(EditPage);
export default EditDialogContainer;



