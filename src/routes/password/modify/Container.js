import { connect } from 'react-redux';
import Page from './Page';
import {EnhanceLoading} from '../../../components/Enhance';
import helper from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';

const STATE_PATH = ['password', 'modify'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/password/modify/config';
const URL_MODIFY = '/api/password/modify';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const config = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    const payload = {label: config, value: {}, loading: false, status: 'page'};
    dispatch(action.create(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const okActionCreator = () => async (dispatch, getState) => {
  const {value} = getSelfState(getState());
  if (value.new !== value.confirm) {
    helper.showError('输入的新密码不一致');
    return;
  }

  dispatch(action.assign({loading: true}));

  const option = helper.postOption({newPassword: value.new, oldPassword: value.old}, 'put');
  const {returnCode, returnMsg} = await helper.fetchJson(URL_MODIFY, option);
  if (returnCode === 0) {
    helper.showSuccessMsg('密码修改成功');
    dispatch(action.assign({value: {}}));
  } else if (returnCode === 40002) {
    helper.showError('原密码错误');
  } else {
    helper.showError(returnMsg);
  }

  dispatch(action.assign({loading: false}));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onChange: changeActionCreator,
  onOk: okActionCreator
};

const Component = EnhanceLoading(Page);
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;

