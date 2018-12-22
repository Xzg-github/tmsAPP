import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import helper from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import showPopup from '../../../standard-business/showPopup';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const searchActionCreator = (key, filter, config) => async (dispatch) => {
  const {returnCode, result} = await helper.fuzzySearchEx(filter, config);
  dispatch(action.update({options: returnCode === 0 ? result : undefined}, 'controls', {key: 'key', value: key}));
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const {value, controls, isEdit} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  dispatch(action.assign({confirmLoading: true}));
  const URL_OK = '/api/config/corporation';
  const body = helper.convert(value);
  const {returnCode, returnMsg} = await helper.fetchJson(URL_OK, helper.postOption(body, isEdit ? 'put' : 'post'));
  if (returnCode !== 0) {
    helper.showError(returnMsg);
    dispatch(action.assign({confirmLoading: false}));
    return;
  }
  helper.showSuccessMsg('保存成功');
  dispatch(action.assign({confirmLoading: false, visible: false, res: true}));
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false}));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onSearch: searchActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

/*
* 功能：新增、编辑法人档案对话框
* 参数：data - 记录信息
*       config - 编辑界面配置
* 返回：成功返回true,取消或关闭返回空
* */
export default (data, config) => {
  const isEdit = !!data.id;
  const props = {
    isEdit,
    config: config.config,
    controls: config.controls,
    title: isEdit ? config.edit : config.add,
    value: data,
    visible: true,
    confirmLoading: false
  };
  global.store.dispatch(action.create(props));
  const Container = connect(mapStateToProps, actionCreators)(EditDialog);
  return showPopup(Container, {}, true);
};
