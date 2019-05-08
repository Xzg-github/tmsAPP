import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import {EnhanceLoading} from '../../../components/Enhance';
import {fetchJson, showError} from '../../../common/common';
import {buildOrderPageState} from '../../../common/state';
import {search} from '../../../common/search';
import {fetchDictionary2, setDictionary} from '../../../common/dictionary';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';

const STATE_PATH = ['basic', 'tenant'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/basic/tenant/config';
const URL_LIST = '/api/basic/tenant/list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const config = await fetchJson(URL_CONFIG);
  if (config.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    showError(config.returnMsg);
    return;
  }
  const {index, editConfig, userConfig} = config.result;
  const list = await search(URL_LIST, 0, index.pageSize, {});
  if (list.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    showError(list.returnMsg);
    return;
  }
  const dictionary = await fetchDictionary2(index.tableCols);
  if (dictionary.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    showError(dictionary.returnMsg);
    return;
  }
  const state = buildOrderPageState(list.result, index, {editConfig, userConfig, status: 'page'});
  setDictionary(state.filters, dictionary.result);
  setDictionary(state.tableCols, dictionary.result);
  setDictionary(state.editConfig.controls, dictionary.result);
  setDictionary(state.userConfig.filters, dictionary.result);
  setDictionary(state.userConfig.tableCols, dictionary.result);
  dispatch(action.create(state));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(OrderPageContainer);
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
