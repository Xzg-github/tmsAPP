import { connect } from 'react-redux';
import TreePageContainer from './TreePageContainer';
import EditDialogContainer from './EditDialogContainer';
import {EnhanceLoading, EnhanceEditDialog} from '../../../components/Enhance';
import {getObject, fetchJson, showError} from '../../../common/common';
import {fetchDictionary2, setDictionary} from '../../../common/dictionary';
import Tree from '../../../common/tree';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';

const STATE_PATH = ['basic', 'user'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/basic/user/config';
const URL_TREE = '/api/basic/user/tree';
const URL_LIST = '/api/basic/user/list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildState = (config, treeArg, tableItems) => {
  const tree = Tree.create(treeArg);
  const key = Tree.getRootKey(tree);
  return {
    ...config.index,
    tree, tableItems,
    select: key,
    editConfig: config.edit
  };
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const config = await fetchJson(URL_CONFIG);
  if (config.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    showError(config.returnMsg);
    return;
  }

  const tree = await fetchJson(URL_TREE);
  if (tree.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    showError(tree.returnMsg);
    return;
  }

  let table = {result: []};
  if (tree.result.length !== 0) {
    const item = tree.result[0];
    table = await fetchJson(`${URL_LIST}/${item.value.guid}/${item.type}`);
    if (table.returnCode !== 0) {
      dispatch(action.assign({status: 'retry'}));
      showError(table.returnMsg);
      return;
    }
  }

  const dictionary = await fetchDictionary2(config.result.index.tableCols);
  if (dictionary.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    showError(dictionary.returnMsg);
    return;
  }

  const state = buildState(config.result, tree.result, table.result);
  setDictionary(state.tableCols, dictionary.result);
  setDictionary(state.editConfig.controls, dictionary.result);
  state.status = 'page';
  let allItems = [];
  Tree.convertToList(tree.result, allItems);
  state.allItems = allItems;
  state.indexTableItems = allItems;
  dispatch(action.create(state));
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), ['status', 'edit']);
};

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(EnhanceEditDialog(TreePageContainer, EditDialogContainer));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
export {initActionCreator};
