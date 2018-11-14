import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EditPageContainer from './EditPageContainer';
import {EnhanceLoading} from '../../../components/Enhance';
import {EnhanceEditDialog} from './components/Enhance/index'
import {getObject, postOption, fetchJson, showError, getActions} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildOrderPageState} from '../../platform/currencyFile/common/state';

const STATE_PATH = ['basic', 'tenantCurrency'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/basic/tenantCurrency/config';
const URL_LIST = '/api/basic/tenantCurrency/list';

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
  const {index, join} = config.result;
  const list = await fetchJson(URL_LIST, postOption({}));
  if (list.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    showError(list.returnMsg);
    return;
  }

  const payload = buildOrderPageState(list.result, index, {joinConfig: join});
  const newAction = getActions('tenantCurrency', true);
  payload.buttons = payload.buttons.filter(items => newAction.indexOf(items.key) !== -1);
  payload.status = 'page';
  dispatch(action.create(payload));
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), ['status', 'join']);
};

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(EnhanceEditDialog(OrderPageContainer,EditPageContainer));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;



