import { connect } from 'react-redux';
import {Action} from '../../action-reducer/action';
import {getPathValue} from '../../action-reducer/helper';
import helper from '../../common/common';
import Template, {bubbleSort} from './Template';
import showPopup from '../showPopup';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const actionLayout = new Action(['layout']);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false}));
};

const okActionCreator = () => async (dispatch, getState) => {
  const {code, activeKey, value, controls, items=[], templateList=[]} = getSelfState(getState());
  if (activeKey === 'add' && !helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  const list = activeKey === 'add' ? items : templateList;
  const checkedItems = list.filter(item => item.checked === true);
  if (checkedItems.length < 1) return helper.showError('请先勾选记录');
  const existNames = templateList.map(item => item.name);
  if (existNames.includes( value.name)) {
    return helper.showError(`模板名称已存在`);
  }
  dispatch(action.assign({confirmLoading: true}));
  const state = global.store.getState();
  const path = ['layout', 'tableColsSetting', code];
  const config = getPathValue(state, path) || {};
  const URL_SETTING = '/api/permission/table_cols_setting';
  let newConfig = {...config}, successMsg='';
  if (activeKey === 'add') {
    const newTemplate = {
      ...value,
      cols: bubbleSort(items.filter(item => item.checked === true).map(item => ({...item, checked: undefined})))
    };
    let [...newTemplateList] = config.templateList || [];
    newTemplateList.push(newTemplate);
    newConfig.templateList = newTemplateList;
    successMsg = `新增模板成功`;
  }else {
    newConfig.templateList = templateList.filter(item => item.checked !== true);
    successMsg = `删除模板成功`;
  }
  const {returnCode, returnMsg} = await helper.fetchJson(URL_SETTING, helper.postOption({code, config: newConfig}));
  if (returnCode !== 0) {
    dispatch(action.assign({confirmLoading: false}));
    return helper.showError(returnMsg);
  }else {
    helper.showSuccessMsg(successMsg);
  }
  dispatch(actionLayout.assign({[code]: newConfig}, 'tableColsSetting'));
  if (activeKey === 'add') {
    dispatch(action.assign({value: {}, items: items.map(item => ({...item, checked: undefined}))}));
  }
  dispatch(action.assign({res: true, templateList: newConfig.templateList, confirmLoading: false}));
};

const checkActionCreator = (path, rowIndex, keyName, checked) => (dispatch) => {
  dispatch(action.update({[keyName]: checked}, path, rowIndex));
};

const contentChangeActionCreator = (rowIndex, keyName, value) => (dispatch) => {
  dispatch(action.update({[keyName]: value}, 'items', rowIndex));
};

const tabChangeActionCreator = (activeKey) => (dispatch) => {
  dispatch(action.assign({activeKey}));
};

const changeActionCreator = (key, value) => (dispatch) => {
  dispatch(action.assign({[key]: value}, 'value'));
};

const exitValidActionCreator = () => (dispatch) => {
  dispatch(action.assign({valid: false}));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onTabChange: tabChangeActionCreator,
  onCheck: checkActionCreator,
  onContentChange : contentChangeActionCreator,
  onChange: changeActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
};

const getTemplateList = (code) => {
  if (!code || !global.store) {
    return [];
  }else {
    const state = global.store.getState();
    const path = ['layout', 'tableColsSetting', code];
    const config = getPathValue(state, path) || {};
    const {templateList=[]} = config;
    return Array.isArray(templateList) ? templateList : [];
  }
};

const buildDialogState = (tableCols, code) => {
  const config = {
    title: '导出Excel模板管理',
    okText: '确定',
    cancelText: '关闭',
    tabs: [{key: 'add', title: '新增模板'}, {key: 'del', title: '删除模板'}],
    activeKey: 'add',
    cols: [
      {key: 'checked', title:'', type: 'checkbox'},
      {key: 'index', title:'序号', type: 'index'},
      {key: 'title', title:'列名', type: 'readonly'},
      {key: 'sequence', title:'列序', type: 'number'},
    ],
    templateCols: [
      {key: 'name', title:'模板名称'},
      {key: 'remark', title:'备注'},
    ],
    controls: [
      {key: 'name', title: '模板名称', type: 'text', required: true},
      {key: 'remark', title: '备注', type: 'text', span: 3}
    ]
  };
  global.store.dispatch(action.create({
    ...config,
    code,
    items: tableCols,
    templateList: getTemplateList(code),
    visible: true,
    confirmLoading: false,
    value: {}
  }));
};

/*
* 功能：导出模板管理对话框
* 参数：tableCols: 【必需】列表字段配置
*       code: 【必需】列表标识，推荐与该列表配置字段功能的code相同，或使用该模块侧边栏权限key，也可自定义，但必需唯一
* 返回值：模板有变更时返回true,否则返回空
*/
export default async (tableCols, code) => {
  buildDialogState(tableCols, code);
  const Container = connect(mapStateToProps, actionCreators)(Template);
  return showPopup(Container, {}, true);
};
