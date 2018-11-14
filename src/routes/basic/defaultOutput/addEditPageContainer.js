import { connect } from 'react-redux';
import EditPage from './EditPage1/EditPage';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import EditPageContainer from './EditPageContainer';

const STATE_PATH = ['basic', 'defaultOutput','edit','addEdit'];
const PARENT_STATE_PATH = ['basic', 'defaultOutput','edit'];


const createContainer = (statePath, afterEditActionCreator) => {
  const action = new Action(statePath, false);
  const actionParents = new Action(PARENT_STATE_PATH, false);

  const getSelfState = (rootState) => {
    return getPathValue(rootState, statePath);
  };

  const changeActionCreator = (keyName, keyValue) => async (dispatch, getState) => {

  };

  const exitValidActionCreator = () => {
    return action.assign({valid: false});
  };

  const getParentState = (rootState) => {
    return getPathValue(rootState, PARENT_STATE_PATH);
  };

  const okActionCreator = () => async (dispatch, getState) => {
    const {tableItems,index} = getSelfState(getState());
    const state = getParentState(getState());
    state.tableItems[index].recivers = JSON.stringify(tableItems);
    dispatch(actionParents.update(state.tableItems, 'tableItems', index));
    afterEditActionCreator()(dispatch, getState);
  };

  const cancelActionCreator = () => {
    return afterEditActionCreator();
  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const checkActionCreator = (rowIndex, keyName, checked) => {
    return action.update({checked}, 'tableItems', rowIndex);
  };


  const contentChangeActionCreator = (rowIndex, keyName, value) => (dispatch, getState) => {
    let {tableItems} = getSelfState(getState());
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


  const toolbarActions = {
    add: addAction,
    delete: delAction,
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

  };

  return connect(mapStateToProps, actionCreators)(EditPage);
};

const AddEditDialogContainer = createContainer(STATE_PATH, EditPageContainer);
export default AddEditDialogContainer;
export {createContainer};
