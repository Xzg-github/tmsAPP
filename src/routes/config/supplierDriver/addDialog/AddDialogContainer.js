import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';
import { connect } from 'react-redux';
import AddDialog from './AddDialog';
import {Action} from '../../../../action-reducer/action';
import showPopup from '../../../../standard-business/showPopup';

//const URL_ACTIVE_SUPPLIER = '/api/config/supplierDriver/active_supplier'; //激活供应商下拉
const SUPPLIER = '/api/config/supplierDriver/search/trailer'; //供应商托车行下拉
const URL_SAVE = '/api/config/supplierDriver/save';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);
const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildAddDialogState = (item, config) => {
  global.store.dispatch(action.create({
    ...config,
    value: item,
    readonly: (item.supplierId && !item.id) ? ['supplierId'] : [],//新增，且存在默认供应商，则将供应商作为只读
    visible: true
  }));
};

//关闭
const cancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, res: false}));
};

//修改输入值
const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

//输入框搜索
const formSearchActionCreator = (key,keyValue,keyControls) => async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  let json;
  if(key === 'supplierId') {                                                     //所属供应商
    json = await helper.fuzzySearchEx(keyValue, keyControls);
  }
  if (!json.returnCode) {
    const index = controls.findIndex(item => item.key === key);
    dispatch(action.update({options:json.result}, 'controls', index));
  }else {
    helper.showError(json.returnMsg)
  }
};

const okActionCreator = () => async (dispatch, getState) => {
  const {controls, value} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  const newValue = {...value, isOwner: 0};
  const body = helper.convert(newValue);
  const {returnCode, returnMsg, result} = await helper.fetchJson(URL_SAVE, helper.postOption(body));
  if (returnCode !== 0) {
    helper.showError(returnMsg);
    return;
  }
  helper.showSuccessMsg('保存成功');
  dispatch(action.assign({visible: false, res: result}));
};


const mapStateToProps = (state) => {
  return getSelfState(state);
};



const actionCreators = {
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
  onChange: changeActionCreator,
  onExitValid: exitValidActionCreator,
  onSearch: formSearchActionCreator
};

/*
* 功能：新增/编辑监理档案对话框
* 参数：item: 记录信息
*       config: 界面配置
* 返回值：成功返回完整记录信息，取消返回false
*/
export default async (item={}, config) => {
  if (!config) {
    const {edit} = await helper.fetchJson(`/api/config/supplierDriver/config`);
    config = edit;
  }
  buildAddDialogState(item, config);
  const Container = connect(mapStateToProps, actionCreators)(AddDialog);
  return showPopup(Container, {}, true);
};
