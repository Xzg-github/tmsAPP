import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../../../../components/Enhance';
import EditDialog from './EditDialog';
import helper, {fetchJson, postOption, showError, getJsonResult, deepCopy, convert}from '../../../../../../common/common';
import {Action} from '../../../../../../action-reducer/action';
import {getPathValue} from '../../../../../../action-reducer/helper';
import showPopup from '../../../../../../standard-business/showPopup';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH, false);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (keyName, keyValue) => action.assign({[keyName]: keyValue}, 'value');

const formSearchActionCreator = (key, value) => async (dispatch, getState) => {
  const {controls, DIALOG_API} = getSelfState(getState());
  let result = [], params = {maxNumber: 20, filter: value};
  switch (key) {
    case 'customerId': {
       result = getJsonResult(await fetchJson(DIALOG_API.search_customer, postOption(params)));
       break;
    }
    case 'carModeId': {
      result = getJsonResult(await fetchJson(DIALOG_API.search_carMode, postOption(params)));
      break;
   }
   case 'chargeItemId': {
     result = getJsonResult(await fetchJson(DIALOG_API.search_chargeItem, postOption(params)));
     break;
  }
  }
  const index = controls.findIndex(item => item.key === key);
  dispatch(action.update({options: result}, ['controls'], index));
};

const okActionCreator = (afterClose) => async (dispatch, getState) => {
  const {type, controls, value, DIALOG_API} = getSelfState(getState());
  if(!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return showError('请填写必填项！');
  }
  const url = type < 2 ? DIALOG_API.newAdd : DIALOG_API.editSave;
  const {returnCode, result, returnMsg} = await fetchJson(url, postOption(convert(value)));
  if (returnCode !== 0) return showError(returnMsg);
  helper.showSuccessMsg(returnMsg);
  dispatch(action.assign({okResult: result}));
  afterClose();
};

const exitValidActionCreator = () => action.assign({valid: false});

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator
};

const buildState = async (config={}) => {
  const {type=0, controls=[], value={}, DIALOG_API} = deepCopy(config);
  const titleArr = ['新增', '复制新增', '编辑'];
  return {
    title: titleArr[type],
    controls,
    value,
    DIALOG_API
  }
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(EditDialog));
export default async (params) => {
  const payload = await buildState(params);
  global.store.dispatch(action.create(payload));
  await showPopup(Container, {status: 'page'}, true);
  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.okResult;
}
