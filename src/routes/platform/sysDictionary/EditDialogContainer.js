import { connect } from 'react-redux';
import EditPage from './EditPage';
import helper, {postOption, fetchJson} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {toFormValue, toTableValue} from '../../../common/check';
import Tree from '../../../common/tree';

const PARENT_STATE_PATH = ['basic', 'sysDictionary'];
const STATE_PATH = ['basic', 'sysDictionary', 'edit'];
const action = new Action(STATE_PATH);
const actionParent = new Action(PARENT_STATE_PATH);
const CLOSE_ACTION = action.assignParent({edit: undefined});
const URL_ADD = '/api/basic/sysDictionary/add';
const URL_EDIT = '/api/basic/sysDictionary/edit';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const getParentState = (rootState) => {
  return getPathValue(rootState, PARENT_STATE_PATH);
};


const contentChangeActionCreator = (rowIndex, keyName, value) => (dispatch, getState) => {
  dispatch(action.update({[keyName]: value}, 'tableItems', rowIndex));
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  let list, data;
  const {tableItems, controls, edit, value, index} = getSelfState(getState());
  const {expand, root, select} = getParentState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  const body = toFormValue(value);
  body.dictionaryLanguage = toTableValue(tableItems);
  const newBody = helper.getObjectExclude(body, ['insertDate', 'insertUser', 'updateDate', 'updateUser']);
  if (edit) {
    list = await fetchJson(URL_EDIT, postOption(newBody, 'put'));
    if(list.returnCode !== 0) {
      helper.showError(list.returnMsg);
      return
    }
    dispatch(action.updateParent(list.result.data, 'tableItems', index));
    dispatch(CLOSE_ACTION)
  }else {
    list = await fetchJson(URL_ADD, postOption(body));
    if(list.returnCode !== 0) {
      helper.showError(list.returnMsg);
      return
    }
    const listTree = Tree.createWithInsertRoot(list.result.tree.data, root, {guid: 'root', districtType:0});
    const key = Tree.getRootKey(list.result.tree);
    dispatch(action.assignParent({tableItems: list.result.data, tree: listTree, select: key, expand: expand, edit:undefined}));
  }



};

const cancelActionCreator = () => (dispatch) => {
  dispatch(CLOSE_ACTION);
};

const addAction = (dispatch, getState) => {
  dispatch(action.add({}, 'tableItems', 0))
};

const delAction = (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const newItems = tableItems.filter(items => !items.checked);
  dispatch(action.assign({tableItems:newItems}));
};

const toolbarActions = {
  add: addAction,
  del: delAction
};

const checkActionCreator = (rowIndex, keyName, checked) => {
  return action.update({checked}, 'tableItems', rowIndex);
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
  onClick: clickActionCreator,
  onCheck: checkActionCreator,
  onChange: changeActionCreator,
  onContentChange: contentChangeActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EditPage);
export default Container;



