import { connect } from 'react-redux';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';
import ChangeDialog from './ChangeDialog';
import showPopup from '../../../../standard-business/showPopup';
import {fetchAllDictionary, setDictionary2} from "../../../../common/dictionary";

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false}));
};

const okActionCreator = () => async (dispatch, getState) => {
  const {value, controls} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  dispatch(action.assign({confirmLoading: true}));
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/config/car_manager/change`, helper.postOption(value));
  if (returnCode !== 0) {
    dispatch(action.assign({confirmLoading: false}));
    helper.showError(returnMsg);
    return;
  }
  dispatch(action.assign({visible: false, res: true}));
};

const changeActionCreator = (key, value) => async (dispatch) => {
  dispatch(action.assign({[key]: value}, 'value'));
};

const exitValidActionCreator = () => (dispatch) => {
  dispatch(action.assign({valid: false}));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
  onChange: changeActionCreator,
  onExitValid : exitValidActionCreator,
};

const buildDialogState = async (id) => {
  const config = {
    title: '变更状态',
    ok: '确定',
    cancel: '取消',
    controls: [
      {key: 'carState', title: '车辆状态', type: 'select', dictionary: 'car_state', required: true},
      {key: 'reason', title: '变更说明', type: 'text', span: 2, required: true}
    ]
  };
  const dic = await fetchAllDictionary();
  setDictionary2(dic.result, config.controls);
  global.store.dispatch(action.create({
    ...config,
    value: {id},
    visible: true,
    confirmLoading: false,
  }));
};

/*
* 功能：变更状态对话框
* 参数：id: 【必需】待变更状态的记录id
* 返回值：成功返回true，取消或关闭时返回空
*/
export default async (id) => {
  await buildDialogState(id);
  const Container = connect(mapStateToProps, actionCreators)(ChangeDialog);
  return showPopup(Container, {}, true);
};
