import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';
import { connect } from 'react-redux';
import AddDialog from './AddDialog';
import {Action} from '../../../../action-reducer/action';
import showPopup from '../../../../standard-business/showPopup';

const URL_ALL_INSTITUTION = '/api/config/insideDriver/all_institution';                 //归属机构
const URL_ALL_DRIVER = '/api/config/supplierSupervisor/all_driver'; //司机
const URL_ALL_SITE = '/api/config/supplierSupervisor/all_site'; //站点
const URL_SAVE = '/api/config/supplierSupervisor/save';

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
const changeActionCreator = (key, value) => (dispatch)=>{
  if(key === 'supplierId' && value){
    dispatch(action.assign({[key]: value}, 'value')) ;
  }else if(key === 'supplierId' && !value){
    dispatch(action.update({options: []}, 'controls', {key: 'key', value: 'factoryId'}));
    dispatch(action.assign({[key]: value, factoryId: ''}, 'value'));
  }else{
    dispatch(action.assign({[key]: value}, 'value'));
  }
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

//输入框搜索
const formSearchActionCreator = (key, title, keyControls) => async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  let data, body;
  if(key === 'institutionId') {                                                     //归属机构
    body = {institutionName: title};
    data = await helper.fetchJson(URL_ALL_INSTITUTION, helper.postOption(body));
  }else if(key === 'factoryId'){
      body = {customerId: -1, name: title};
      data = await helper.fetchJson(URL_ALL_SITE, helper.postOption(body));debugger
  }else if(key === 'driverId'){
    body = { isOwner: 1, name: title};
    data = await helper.fetchJson(URL_ALL_DRIVER, helper.postOption(body));
  }else{
    data = await helper.fuzzySearchEx(title, keyControls);
  }
  if (data.returnCode !== 0) {
    return;
  }
  const index = controls.findIndex(item => item.key === key);
  dispatch(action.update({options: data.result}, 'controls', index));
};

const okActionCreator = () => async (dispatch, getState) => {
  const {controls, value} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  const newValue = {...value, isOwner: 1};
  const body = helper.convert(newValue);
  const {returnCode, returnMsg} = await helper.fetchJson(URL_SAVE, helper.postOption(body));
  if (returnCode !== 0) {
    helper.showError(returnMsg);
    return;
  }
  helper.showSuccessMsg('保存成功');
  dispatch(action.assign({visible: false, res: true}));
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
* 返回值：成功返回true，取消返回false
*/
export default async (item={}, config) => {
  buildAddDialogState(item, config);
  const Container = connect(mapStateToProps, actionCreators)(AddDialog);
  return showPopup(Container, {}, true);
};
