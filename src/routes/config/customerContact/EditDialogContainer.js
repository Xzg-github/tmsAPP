import { connect } from 'react-redux';
import EditDialog from './EditDialog';
import helper, {postOption, fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import showPopup from "../../../standard-business/showPopup";
import {updateTable} from './OrderPageContainer';
import {fetchAllDictionary, setDictionary2} from '../../../common/dictionary';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH, false);

const URL_SAVE = '/api/config/customer_contact/add';
const URL_CLIENT = '/api/config/customer_contact/customer';

const buildState = (config, data, edit) => {
  return {
    ...config,
    title: edit ? '编辑' :'新增',
    visible: true,
    value: data,
  }
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const okActionCreator = () => async (dispatch, getState) => {
  const {value, controls} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    return dispatch(action.assign({valid: true}));
  }
  //邮箱验证
  const reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
  if(value['contactEmail'] && value['contactEmail'] !== ''){
     if(!reg.test(value['contactEmail'])) {
       return showError('邮箱格式不正确');
     }
  }
  const option = postOption(helper.convert(value), 'post');
  const {returnCode, returnMsg} = await fetchJson(URL_SAVE, option);
  if (returnCode === 0) {
    dispatch(action.assign({visible: false}));
    return updateTable(dispatch, getState);
  } else {
    showError(returnMsg);
  }
};

const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible:false}));
};

const clickActionCreators = {
  ok: okActionCreator,
  close: closeActionCreator
};

const clickActionCreator = (key) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key]();
  }else{
    return {type: 'unknown'}
  }
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const searchActionCreator = (key, value) => async (dispatch) => {
  const {returnCode, result} = await fetchJson(URL_CLIENT, postOption({"customerName": value, "maxNumber": 10}));
  if (returnCode === 0) {
    dispatch(action.assign({[key]: result}, 'options'));
  }
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onSearch: searchActionCreator,
  onExitValid: exitValidActionCreator,
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const Container = connect(mapStateToProps, actionCreators)(EditDialog);


export default async(config, data={},isAdd=true) => {
  if (!config) {
    const {returnCode, result} = await helper.fetchJson('/api/config/customer_contact/config');
    if (returnCode !== 0) return helper.showError('获取界面配置失败');
    config = result.edit;
    const dic = await fetchAllDictionary();
    if (dic.returnCode === 0) {
      setDictionary2(dic.result, config.controls);
    }
  }
  global.store.dispatch(action.create(buildState(config, data, isAdd)));
  await showPopup(Container, data,true);
};
