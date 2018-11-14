import React from 'react';
import { connect } from 'react-redux';
import ConfirmDialog from '../../../components/ConfirmDialog';
import {postOption, fetchJson,showError} from '../../../common/common';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from '../../../action-reducer/action';
import Tree from '../../../common/tree';

const STATE_PATH = ['basic', 'sysDictionary', 'confirm'];
const action = new Action(STATE_PATH);
const URL_DEL = '/api/basic/sysDictionary/del';
const URL_LIST = '/api/basic/sysDictionary/list';
const URL_TREE = '/api/basic/sysDictionary/tree';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};


const okActionCreators = () => async (dispatch, getState) => {
  const {codeItems, root, expand, index, dictionaryCode} = getSelfState(getState());
  const {returnCode, result, returnMsg} = await fetchJson(URL_DEL, postOption(codeItems));
  if (returnCode !== 0) {
    showError('已失效删除'+returnMsg);
    return;
  }

  const listTree = Tree.createWithInsertRoot(result.tree.data, root, {guid: 'root', districtType:0});
  const key = Tree.getRootKey(result.tree);
  dispatch(action.assignParent({tableItems: result.data, tree: listTree, select: key, expand: expand, confirm:undefined}));
};

const cancelActionCreators = () => (dispatch, getState) => {
  dispatch(action.assignParent({confirm: undefined}));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreators,
  onCancel: cancelActionCreators
};

const Container = connect(mapStateToProps, actionCreators)(ConfirmDialog);
export default Container;
