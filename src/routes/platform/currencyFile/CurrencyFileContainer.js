import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EditDialogContainer from './EditDialogContainer';
import {EnhanceLoading, EnhanceEditDialog} from '../../../components/Enhance';
import {getObject, postOption, fetchJson, showError} from '../../../common/common';
import {buildOrderPageState} from './common/state';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {fetchDictionary2, setDictionary} from '../../../common/dictionary';

const STATE_PATH = ['basic', 'currencyFile'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/basic/currencyFile/config';
const URL_LIST = '/api/basic/currencyFile/list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const config = await fetchJson(URL_CONFIG);
  if (config.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  const option = postOption({});
  const list = await fetchJson(URL_LIST, option);
  if (list.returnCode !== 0 ) {
    showError(list.returnMsg);
    return;
  }
  const {index, edit} = config.result;
  const {tableCols} = index;
  let data = await fetchDictionary2(tableCols);
  if(data.returnCode !== 0){
    dispatch(action.assign({status: 'retry'}));
    showError(data.returnMsg);
    return;
  }
  setDictionary(tableCols, data.result);
  const payload = buildOrderPageState(list.result, index, {editConfig: edit, status: 'page'});
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

