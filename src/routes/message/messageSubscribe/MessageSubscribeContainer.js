import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import helper, {fetchJson, getJsonResult} from '../../../common/common';
import {Action} from '../../../action-reducer/action'
import {getPathValue} from '../../../action-reducer/helper';
import OrderPageContainer from './OrderPageContainer';

const STATE_PATH = ['message', 'messageSubscribe'];
const action = new Action(STATE_PATH);

const URL_CONFIG = '/api/message/messageSubscribe/config';
const URL_LIST = '/api/message/messageSubscribe/list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

// 为OrderPage组件构建状态
const buildOrderPageState = (result =[], config, other={}) => {
  return {
    ...other,
    ...config,
    tableItems: result,
  };
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const config = getJsonResult(await fetchJson(URL_CONFIG));
    const list = getJsonResult(await fetchJson(URL_LIST));
    const payload = buildOrderPageState(list, config,{status: 'page'});
    dispatch(action.create(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
};

const Component = EnhanceLoading(OrderPageContainer);
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
