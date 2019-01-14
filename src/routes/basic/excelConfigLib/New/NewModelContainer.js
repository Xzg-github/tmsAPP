import { connect } from 'react-redux';
import { Action } from '../../../../action-reducer/action';
import { showError, fetchJson, postOption, showSuccessMsg, validValue, validArray} from '../../../../common/common';
import NewModel from './NewModel';
import {getPathValue} from '../../../../action-reducer/helper';
import {updateTable} from '../OrderPageContainer';

const URL_INSERT_EXCEL = '/api/basic/excelConfigLib/insertExcelModel';
const URL_EDIT = '/api/basic/excelConfigLib/edit';
const URL_EXCEL = '/api/basic/excelConfigLib/uploadExcelModel';
const URL_OPTIONS = '/api/basic/excelConfigLib/options';
const URL_MODEL_TYPE = '/api/basic/excelConfigLib/tenantModelType';
const URL_MODEL_TYPE_ADD = '/api/basic/excelConfigLib/add';
const URL_UPLOAD_EXCEL = '/api/proxy/integration_service/excelModelConfig/uploadExcelModel';
const URL_EXCEL_MODEL= '/api/basic/excelConfigLib/selectExcelModel';

const STATE_PATH = ['basic','excelConfigLib','edit'];
const PARENT_STATE_PATH = ['basic','excelConfigLib'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, PARENT_STATE_PATH);
  return parent[parent.activeKey];
};

const getParentState = (rootState) => {
  return getPathValue(rootState, PARENT_STATE_PATH);
};

const actionParent = new Action(PARENT_STATE_PATH);

// 关闭编辑页
const cancelAction = (dispatch, getState) => {
  const { activeKey, tabs } = getParentState(getState());
  const newTabs = tabs.filter(tab => tab.key !== activeKey);
  // 如果tab刚好是最后一个，则直接减一，
  if (activeKey !== 'index') {
    dispatch(action.assignParent({ tabs: newTabs, [activeKey]: undefined,activeKey: 'index'}));
  } else {
    dispatch(action.assign({}));
  }
};

//下拉选择
const formSearchActionCreator = (key, val) => async (dispatch, getState) => {
  const {controls, value} = getSelfState(getState());
  let res = {};
  switch(key) {
    case 'modelCode':                     //模板类型
    {
      const data = await fetchJson(URL_MODEL_TYPE);
      res.result = data.result.map(obj=>({value: obj.id, title: obj.apiName}));
      break;
    }
    case 'uniqueTitle':                       //唯一字段
    {
      if(!value.modelCode){
        showError('请先选择模板类型');
        return
      }
      const id = typeof value.modelCode === 'object' ? value.modelCode.value : value.apiStandardLibraryId ? value.apiStandardLibraryId : '';
      res = await fetchJson(`${URL_OPTIONS}/${id}`);
      break;
    }
    default:
      return;
  }
  let options = res.result;
  const index = controls.findIndex(item => item.key === key);
  dispatch(action.update({options}, 'controls', index));
};

//生成表格内容
const generateSubTableItems = (subs) => {
  const values = [];
  Object.keys(subs).map(key => {
    subs[key]['fieldCode'] = key;
    values.push(subs[key]);
  });
  return values;
};

//值改变
const changeActionCreator = (key, values) => async(dispatch, getState) => {
  const { CURRNT_TABLE_CODE, controls1,value } = getSelfState(getState());
  if(key==='modelCode'){
    const {result, returnCode} = await fetchJson(`${URL_MODEL_TYPE_ADD}/${values.value}`);
    if (returnCode !== 0) return;
    const {field, table} = result.content;
    const tableCode = table[0].tableCode.split(','); //以逗号为分割，生成数组，元素为字符串
    const tableTitle = table[0].tableTitle.split(',');
    const newTabs = tableCode.map((key, index) => ({key, title: tableTitle[index]}));  //根据field属性个数生成Tab切换
    const state = {};
    for(let obj of Object.keys(field)){                           //根据field属性个数生成切换的内容
      state[obj] = {
        mapperList: generateSubTableItems(field[obj]).map( item => {    //字段名称的值默认填入列标题空格中
          return Object.assign({columnTitle: item.fieldTitle}, item);
        }),
      }
    }
    dispatch(action.assign({state, controls1, content: result.content, CURRNT_TABLE_CODE, tabs: newTabs}));
  }
  if (controls1.map(item=>item.key).includes(key)) {
    dispatch(action.assign({[key]: values}, ['state', CURRNT_TABLE_CODE]));
  }else {
    dispatch(action.assign({[key]: values}, 'value'));
  }

};

// 上传模板
const uploadActionCreator = (dispatch, getState) => {
  dispatch(action.assign({ visible1: true }));
};

// 弹出框关闭
const onCancel1ActionCreator = () => (dispatch, getState) => {
  dispatch(action.assign({ visible1: false }));
};

//刷新页面
const updatePage = (guid) => async (dispatch, getState) => {
  showSuccessMsg('保存成功');
  const selfState = getSelfState(getState());
  const {returnCode, result, returnMsg} = await fetchJson(`${URL_EXCEL_MODEL}/${guid}`);
  if (returnCode !== 0) {
    return showError(`刷新页面数据失败-${returnMsg}`);
  }
  const state = result.sheetList.reduce((result, item) => {
    const key = Object.keys(item)[0];
    result[key] = item[key];
    return result;
  }, {});
  const buttons1 = [
    { key: "cancel", title: '关闭'},
    { key: 'upload', title: '上传模板'},
    { key: 'save', title: '保存', bsStyle: 'primary'},
  ];
  const newControls = selfState.controls[0].type = 'readonly';
  dispatch(action.assign({value:result, edit: true, state, newControls, buttons1}));
  selfState.tabs.map(tab => {
    dispatch(action.assign({items: result[tab.key] || []}, tab.key));
  });
  const {activeKey} = getPathValue(getState(), PARENT_STATE_PATH);
  dispatch(actionParent.update({title: result.modelName}, 'tabs', {key: 'key', value: activeKey}));
};

//保存
const saveAction = async (dispatch, getState) => {
  const {edit, value, modelCode, controls, controls1, state, CURRNT_TABLE_CODE, tableCols} = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  if (!validValue(controls1, state[CURRNT_TABLE_CODE])) {
    dispatch(action.assign({valid: true}));
    return;
  }
  if(!validArray(tableCols, state[CURRNT_TABLE_CODE].mapperList.filter(item => !item.hide))){
    dispatch(action.assign( {valid: true, form: false}));
    return;
  }

  const fieldList = [];
  for(let i in state){
    let data = {};
    data[i] = state[i];
    fieldList.push(data)
  }
  const postData = {
    id: edit ? value.id : '',
    apiStandardLibraryId: typeof value.modelCode === 'object' ? value.modelCode.value : value.apiStandardLibraryId,
    modelName: value.modelName,
    tenantId: value.tenantId,
    uniqueIndex: value.uniqueTitle ? value.uniqueTitle.value : '',
    uniqueTitle: value.uniqueTitle ? value.uniqueTitle.title : '',
    sheetList: fieldList,
  };
  const {result, returnCode, returnMsg} = await fetchJson(edit? URL_EDIT : URL_INSERT_EXCEL, postOption(postData, 'post'));
  if (returnCode !== 0) {
    showError(returnMsg);
    return;
  }
  updatePage(result.id)(dispatch, getState);
  updateTable(dispatch, getState);
};

// 上传
const onUploadActionCreator = (file) => async (dispatch, getState) => {
  const { value } = getSelfState(getState());
  const formData = new FormData();
  formData.append('file', file);
  formData.append('id', value.id);
  let xhr;
  if (window.XMLHttpRequest) { // code for all new browsers
    xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // code for IE5 and IE6
    xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
  }
  if (xhr !== null) {
    // const xhr = new XMLHttpRequest();
    xhr.onload = (event) => {
      const { returnCode, returnMsg } = JSON.parse(xhr.responseText); // 服务器返回
      if (returnCode !== 0) {
        returnMsg && showError(returnMsg);
        return;
      }
      returnMsg && showSuccessMsg(returnMsg);
      dispatch(actionParent.update({ checked: false }, 'tableItems', -1));
    };
    xhr.onabort = (event) => {
      showError('上传失败');
    };
    xhr.open('post', URL_UPLOAD_EXCEL, true);  // true表示异步
    xhr.withCredentials = true;
    xhr.send(formData);
  } else {
    showError('Your browser does not support XMLHTTP.');
  }
};

// 删除单元行
const delAction = (dispatch, getState) => {
  const {state, CURRNT_TABLE_CODE} = getSelfState(getState());
  const newItems = state[CURRNT_TABLE_CODE].mapperList.filter(item => !item.checked);
  dispatch(action.assign({mapperList: newItems}, ['state', CURRNT_TABLE_CODE]));
};

// 加入
const loadActionCreator = async (dispatch, getState) => {
  const {state, content, delSubs = {}, CURRNT_TABLE_CODE, value } = getSelfState(getState());
  if (!content) {
    showError('无可加入项,请选择模板类型！');
    return;
  }
  const subs = content.field[CURRNT_TABLE_CODE];
  const plus = [];
  const codes = state[CURRNT_TABLE_CODE].mapperList.map(item => item.fieldCode);
  for (const key of Object.keys(subs)) {
    subs[key].fieldCode = key;
    if (codes.indexOf(key) === -1) {
      plus.push({
        ...subs[key],
        require: 'false',
        excelModelConfigSheetId: state[CURRNT_TABLE_CODE].id,
        fieldCode: key,
        id: '',
        columnTitle: subs[key].fieldTitle,    //列标题默认为字段名称
        tenantId: state[CURRNT_TABLE_CODE].mapperList.tenantId
      });
    }
  }
  state[CURRNT_TABLE_CODE].mapperList =  state[CURRNT_TABLE_CODE].mapperList.concat(plus);
  dispatch(action.assign({ items:  state[CURRNT_TABLE_CODE].mapperList.concat(plus)}));
};

//清空列标题
const emptyAction = (dispatch, getState) => {
  const {state, CURRNT_TABLE_CODE} = getSelfState(getState());
  let idList = [];
  state[CURRNT_TABLE_CODE].mapperList.map((item) => {
    if(item.checked){idList.push(item)}
  });
  if(idList.length === 0){
    showError('请勾选要删除的记录');
    return;
  }
  const newTable = idList.map( item => {
    return Object.assign(item, {columnTitle: ''});
  });
  dispatch(action.assign({items: newTable}))
};

//下载模板
const importAction = async (dispatch, getState) => {
  const {value} = getSelfState(getState());
  const id = value.id;
  const url = '/api/config/modeinput/down';
  const {result, returnCode} = await fetchJson(`${url}?id=${id}`);
  if(returnCode !== 0) {
    showError('没有可下载的模板，请先上传');
    return;
  }
  window.open(`/api/proxy/file-center-service/${result}`);
};

const toolbarActions = {
  upload: uploadActionCreator,
  save: saveAction,
  delete: delAction,
  load: loadActionCreator,
  cancel: cancelAction,
  empty: emptyAction,
  import: importAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

// 主表格内容值变化
const contentChangeActionCreator = (rowIndex, keyName, value) => async (dispatch, getState) => {
  const {state, CURRNT_TABLE_CODE} = getSelfState(getState());
  dispatch(action.update({ [keyName]: value }, ['state', CURRNT_TABLE_CODE, 'mapperList'], rowIndex));
};

// 表格勾选事件
const onCheckActionCreator = (rowIndex, key, checked) => async (dispatch, getState) => {
  const {state, CURRNT_TABLE_CODE} = getSelfState(getState());
  dispatch(action.update({ checked }, ['state', CURRNT_TABLE_CODE, 'mapperList'], rowIndex));
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

//Tab切换
const tabChangeActionCreator = (CURRNT_TABLE_CODE) => async (dispatch, getState) => {
  dispatch(action.assign({CURRNT_TABLE_CODE}));
};

const mapStateToProps = (state) => {
  return getSelfState(state,PARENT_STATE_PATH);
};

const actionCreators = {
  onCancel1: onCancel1ActionCreator,
  onContentChange: contentChangeActionCreator,
  onExitValid: exitValidActionCreator,
  onCheck: onCheckActionCreator,
  onClick: clickActionCreator,
  onUpload: onUploadActionCreator,
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onTabChange: tabChangeActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(NewModel);
export default Container;
