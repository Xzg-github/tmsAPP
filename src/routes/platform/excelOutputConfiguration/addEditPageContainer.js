import { connect } from 'react-redux';
import EditPage from './EditPage1/EditPage';
import helper from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import EditPageContainer from './EditPageContainer';
import {handelComponentType} from './EditPageContainer'

const STATE_PATH = ['platform', 'excelOutputConfiguration','edit','addEdit'];
const PARENT_STATE_PATH = ['platform', 'excelOutputConfiguration','edit'];


const createContainer = (statePath, afterEditActionCreator) => {
  const action = new Action(statePath, false);
  const actionParents = new Action(PARENT_STATE_PATH, false);

  const getSelfState = (rootState) => {
    return getPathValue(rootState, statePath);
  };

  const changeActionCreator = (keyName, keyValue) => async (dispatch, getState) => {
    const {edit, controls, dataOptions, value} = getSelfState(getState());
    dispatch(action.assign({[keyName]: keyValue}, 'value'));
    if(keyName === 'componentType' && keyValue){
      const {type='readonly',title='数据源',options=[],span=1,props ={}} = await handelComponentType(keyValue);
      dispatch(action.assign({['dataSrc']: ''}, 'value'));
      dispatch(action.update({title,type,options,span,props}, 'controls', 3));
    }

  };

  const exitValidActionCreator = () => {
    return action.assign({valid: false});
  };

  const getParentState = (rootState) => {
    return getPathValue(rootState, PARENT_STATE_PATH);
  };

  const okActionCreator = () => async (dispatch, getState) => {
    const {isEdit, controls, tableItems1,tableItems2, value,index} = getSelfState(getState());
    if (!helper.validValue(controls, value)) {
      dispatch(action.assign({valid: true}));
      return;
    }
    let parameters = value;
    parameters.messageList = tableItems2;
    parameters.extList = tableItems1;

    if(isEdit){
      dispatch(actionParents.add(parameters, 'tableItems', index))
    }else {
      dispatch(actionParents.update(parameters, 'tableItems', index))
    }

    afterEditActionCreator()(dispatch, getState);

  };

  const cancelActionCreator = () => {
    return afterEditActionCreator();
  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const checkActionCreator = (rowIndex, keyName, checked) => {
    return action.update({checked}, 'tableItems1', rowIndex);
  };

  const checkActionCreator1 = (rowIndex, keyName, checked) => {
    return action.update({checked}, 'tableItems2', rowIndex);
  };

  const contentChangeActionCreator = (rowIndex, keyName, value) => (dispatch, getState) => {
    let {tableItems1} = getSelfState(getState());
    dispatch(action.update({[keyName]: value}, 'tableItems1', rowIndex));
  };

  const contentChangeActionCreator1 = (rowIndex, keyName, value) => (dispatch, getState) => {
    let {tableItems2} = getSelfState(getState());
    dispatch(action.update({[keyName]: value}, 'tableItems2', rowIndex));
  };

  const addAction = (dispatch, getState) => {
    dispatch(action.add({}, 'tableItems1', 0))
  };

  const delAction = (dispatch, getState) => {
    const {tableItems1} = getSelfState(getState());
    const newItems = tableItems1.filter(item => !item.checked);
    dispatch(action.assign({tableItems1: newItems}));
  };

  const add1Action = (dispatch, getState) => {
    dispatch(action.add({}, 'tableItems2', 0))
  };

  const del1Action = (dispatch, getState) => {
    const {tableItems2} = getSelfState(getState());
    const newItems = tableItems2.filter(item => !item.checked);
    dispatch(action.assign({tableItems2: newItems}));
  };


  const toolbarActions = {
    add: addAction,
    add1: add1Action,
    delete: delAction,
    delete1: del1Action
  };

  const clickActionCreator = (key) => {
    if (toolbarActions.hasOwnProperty(key)) {
      return toolbarActions[key];
    } else {
      console.log('unknown key:', key);
      return {type: 'unknown'};
    }
  };


  const actionCreators = {
    onChange: changeActionCreator,
    onClick: clickActionCreator,
    onExitValid: exitValidActionCreator,
    onOk: okActionCreator,
    onCancel: cancelActionCreator,
    onCheck: checkActionCreator,
    onContentChange: contentChangeActionCreator,
    onCheck1: checkActionCreator1,
    onContentChange1: contentChangeActionCreator1,
  };

  return connect(mapStateToProps, actionCreators)(EditPage);
};

const AddEditDialogContainer = createContainer(STATE_PATH, EditPageContainer);
export default AddEditDialogContainer;
export {createContainer};
