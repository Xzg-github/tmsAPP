import { connect } from 'react-redux';
import TreePageContainer from './TreePageContainer';
import EditDialogContainer from './EditDialogContainer';
import {EnhanceLoading, EnhanceEditDialog} from '../../../components/Enhance';
import {getObject, fetchJson, showError} from '../../../common/common';
import {fetchDictionary2, setDictionary} from '../../../common/dictionary';
import Tree from '../../../common/tree';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';

const STATE_PATH = ['basic', 'tenant'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/basic/tenant/config';
const URL_LIST = '/api/basic/tenant/tree';
const URL_CHILDREN = '/api/basic/tenant/children/root';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildState = (config, treeArg, tableItems) => {
  const tree = Tree.createWithInsertRoot(treeArg, config.root, {guid: 'root'});
  const key = Tree.getRootKey(tree);
  return {
    ...config.index,
    tree,
    tableItems,
    expand: {[key]: true},
    select: key,
    editConfig: config.edit,
    userConfig: config.userConfig,
    keys: config.keys
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

  const tree = await fetchJson(URL_LIST);
  if (tree.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    showError(tree.returnMsg);
    return;
  }

  const table = await fetchJson(URL_CHILDREN);
  if (table.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    showError(table.returnMsg);
    return;
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
  setDictionary(state.userConfig.filters, dictionary.result);
  setDictionary(state.userConfig.tableCols, dictionary.result);
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
