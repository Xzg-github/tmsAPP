import { connect } from 'react-redux';
import { Action } from '../../../../action-reducer/action';
import { showError, fetchJson} from '../../../../common/common';
import { getSelfState } from '../helper';
import { ConfirmDialog, cancelConfirmActionCreator } from '../helper2';
import NewModel from './NewModel';
import helper from './helper';
import { NEW_URL_UPLOAD_EXCEL as URL_UPLOAD_EXCEL } from '../uploadUrl';

const URL_LIST = '/api/basic/excelConfigLib/list';
const STATE_PATH = ['basic', 'excelConfigLib', 'edit'];
const URL_INSERT_EXCEL = '/api/basic/excelConfigLib/insertExcelModel';
const URL_EDIT = '/api/basic/excelConfigLib/edit';
const URL_GENERATE = '/api/basic/excelConfigLib/generateExcelModel';
const URL_EXCEL = '/api/basic/excelConfigLib/uploadExcelModel';
const URL_OPTIONS = '/api/basic/excelConfigLib/options';
const action = new Action(STATE_PATH);
// 取消
const onCancelActionCreator = () => (dispatch, getState) => {
  helper.onCancelAction(dispatch, getState, action);
};
// 值变化
const onChangeActionCreator = (value, type) => (dispatch, getState) => {
  if (type) {
    const { tableItems } = getSelfState(getState(), ['bill', 'excelConfigLib']);
    const { modelCode } = getSelfState(getState(), STATE_PATH);
    if (modelCode) {
      const current = tableItems.find(item => item.modelCode === modelCode);
      if (current.modelName === value.modelName) {
        return;
      }
      const current1 = tableItems.find(item => item.modelCode !== modelCode || item.modelName.trim() === value.modelName.trim());
      if (current1 !== undefined) {
        showError('模板名已存在，请更改模板名');
      }
    } else {
      const name = tableItems.find(item => item.modelName.trim() === value.modelName.trim());
      if (name !== undefined) {
        showError('模板名已存在，请更改模板名');
        return;
      }
    }
  }
  dispatch(action.assign(value));
};

const formSearchActionCreator = (key, value) => async (dispatch, getState) => {
  const {controls, value} = getSelfState(getState(), STATE_PATH);
  let res;
  switch(key) {
    case 'uniqueTitle':
    {
      res = await fetchJson(`${URL_OPTIONS}/${value.apiStandardLibraryId}`);
      break;
    }
    default:
      return;
  }
  if(res.returnCode !== 0) return;
  let options = res.result;
  const index = controls.findIndex(item => item.key == key);
  dispatch(action.update({options}, 'controls', index));
};

const changeActionCreator = (key, values) => async(dispatch, getState) => {
  const { tableItems } = getSelfState(getState(), ['bill', 'excelConfigLib']);
  const { modelCode } = getSelfState(getState(), STATE_PATH);
  if (modelCode) {
    const current = tableItems.find(item => item.modelCode === modelCode);
    if (current.modelName === values.modelName) {
      return;
    }
    const current1 = tableItems.find(item => item.modelCode !== modelCode || item.modelName === values.modelName);
    if (current1 !== undefined) {
      showError('模板名已存在，请更改模板名');
    }
  } else {
    const name = tableItems.find(item => item.modelName === values.modelName);
    if (name !== undefined) {
      showError('模板名已存在，请更改模板名');
      return;
    }
  }
  dispatch(action.assign({[key]: values}, 'value'));
};

// 上传模板
const uploadActionCreator = (dispatch, getState) => {
  dispatch(action.assign({ visible1: true }));
};

// 取消
const onCancel1ActionCreator = () => (dispatch, getState) => {
  dispatch(action.assign({ visible1: false }));
};
// 保存
const saveActionCreator = async (dispatch, getState) => {
  helper.saveAction(dispatch, getState, action, STATE_PATH, URL_INSERT_EXCEL, URL_LIST, URL_EDIT);
};
// 生成模板
const generateActionCreator = async (dispatch, getState) => {
  helper.generateAction(dispatch, getState, action, STATE_PATH, URL_GENERATE, URL_LIST);
};
// 上传
const onUploadActionCreator = (file) => async (dispatch, getState) => {
  helper.onUploadAction(dispatch, getState, action, STATE_PATH, URL_EXCEL, URL_UPLOAD_EXCEL, file);
};

// 删除
const deleteActionCreator = (dispatch, getState) => {
  const { tableItems1, tableItems, currentKey, delSubs = {} } = getSelfState(getState(), STATE_PATH);
  const uncheckedItems = tableItems1.filter(item => item.checked !== true);
  const checkedItems = tableItems1.filter(item => item.checked === true);
  const tableCode = tableItems[currentKey].tableCode;
  const hasProperty = delSubs.hasOwnProperty(tableCode);
  delSubs[tableCode] = hasProperty ? delSubs[tableCode].concat(checkedItems) : checkedItems;
  tableItems[currentKey].mapperList = uncheckedItems;
  dispatch(action.update({ checked: false }), 'tableItems1', -1);
  dispatch(action.assign({ tableItems, delSubs, tableItems1: uncheckedItems, confirmType: '' }));
};
// 加载
const loadActionCreator = (dispatch, getState) => {
  const { tableItems1, tableItems, currentKey, content, delSubs = {} } = getSelfState(getState(), STATE_PATH);
  const tableCode = tableItems[currentKey].tableCode;
  if (!content) {
    showError('无可加载项');
    return;
  }
  const subs = content.field[tableCode];
  const plus = [];
  let count = 0;

  const items = tableItems1.concat(Object.values(delSubs[tableCode] || {}))
  const codes = items.reduce((list, item) => {
    list.push(item.fieldCode);
    return list;
  }, []);

  for (const key of Object.keys(subs)) {
    if (count === 20) {
      break;
    }
    if (codes.indexOf(key) === -1) {
      plus.push(subs[key]);
      count = count + 1;
    }
  }

  tableItems[currentKey].mapperList = tableItems1.concat(plus);
  dispatch(action.assign({ tableItems1: tableItems1.concat(plus), tableItems }, content));
};
const clickEvents = {
  upload: uploadActionCreator,
  save: saveActionCreator,
  generate: generateActionCreator,
  delete: deleteActionCreator,
  load: loadActionCreator,
};

const onClickActionCreator = (key) => async (dispatch, getState) => {
  if (key === 'delete') {
    const { tableItems1 } = getSelfState(getState(), STATE_PATH);
    const checkItems = tableItems1.filter(item => item.checked === true);
    if (checkItems.length === 0) {
      showError('请选择删除项');
      return;
    }
    ConfirmDialog.onCancel = () => {
      cancelConfirmActionCreator(dispatch, getState, action);
    };
    ConfirmDialog.onOk = () => {
      clickEvents[key](dispatch, getState);
    };
    ConfirmDialog.content = '是否确认删除';
    dispatch(action.assign({ confirmType: key, ConfirmDialog }));
  } else {
    clickEvents[key](dispatch, getState);
  }
};
// 主表格内容值变化
const contentChangeActionCreator = (rowIndex, keyName, value) => {
  return action.update({ [keyName]: value }, 'tableItems', rowIndex);
};
// 子表格内容值
const contentChangeActionCreator1 = (rowIndex, keyName, value) => {
  return action.update({ [keyName]: value }, 'tableItems1', rowIndex);
};
// 单元格点击事件
const onCellClickActionCreator = (record, event) => (dispatch, getState) => {
  const { tableItems, tableItems1, currentKey } = getSelfState(getState(), STATE_PATH);
  tableItems[currentKey].mapperList = tableItems1;

  const nTableItems1 = tableItems[record.key].mapperList;
  dispatch(action.assign({ tableItems1: nTableItems1, currentKey: record.key, tableItems }));
};
// 表格勾选事件
const onCheckActionCreator = (rowIndex, key, checked) => {
  return action.update({ checked }, 'tableItems1', rowIndex);
};

const mapStateToProps = (state) => {
  return getSelfState(state, STATE_PATH) || {};
};

const actionCreators = {
  onCancel: onCancelActionCreator,
  onCancel1: onCancel1ActionCreator,
  onCellClick: onCellClickActionCreator,
  onContentChange: contentChangeActionCreator,
  onModelChange: onChangeActionCreator,
  onContentChange1: contentChangeActionCreator1,
  onCheck: onCheckActionCreator,
  onClick: onClickActionCreator,
  onUpload: onUploadActionCreator,
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(NewModel);
export default Container;
