import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EditDialogContainer from './EditDialogContainer';
import {EnhanceLoading, EnhanceEditDialog} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildOrderPageState} from '../../../common/state';
import {getObject, fetchJson, showError} from '../../../common/common';
import {search} from '../../../common/search';
import {fetchDictionary2, setDictionary} from '../../../common/dictionary';

const STATE_PATH = ['basic', 'institution'];
const URL_CONFIG = '/api/basic/institution/config';
const URL_LIST = '/api/basic/institution/list';
const action = new Action(STATE_PATH);

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

  const {index, edit} = config.result;
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

  const payload = buildOrderPageState(list.result, index, {editConfig: edit, status: 'page'});
  setDictionary(payload.tableCols, dictionary.result);
  setDictionary(payload.filters, dictionary.result);
  setDictionary(payload.editConfig.controls, dictionary.result);
  dispatch(action.create(payload));
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), ['status', 'edit']);
};

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(EnhanceEditDialog(OrderPageContainer, EditDialogContainer));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
