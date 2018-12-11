import { connect } from 'react-redux';
import EditDialog from '../customerContact/EditDialog';
import helper, {postOption, fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import showPopup from "../../../standard-business/showPopup";
import {updateTable} from "./OrderPageContainer";

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH, false);

const URL_SAVE = '/api/config/customersArchives/finance';
const URL_FINANANCIAL = '/api/basic/user/name';


const buildState = (config, data) => {
  return {
    ...config,
    title: '设置财务人员',
    visible: true,
    idList: data,
    value: {}
  }
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};


const okActionCreator = () => async (dispatch, getState) => {
  const {value, controls, idList} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    return dispatch(action.assign({valid: true}));
  }
  const option = Object.assign({ids: idList}, helper.convert(value));
  const {returnCode, returnMsg} = await fetchJson(URL_SAVE, postOption(option));
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
  const {returnCode, result} = await fetchJson(URL_FINANANCIAL, postOption({filter: value}));
  if (returnCode === 0) {
    dispatch(action.assign({[key]: result.data}, 'options'));
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


export default async(config, data={}) => {
  global.store.dispatch(action.create(buildState(config, data)));
  await showPopup(Container, data,true);
};
