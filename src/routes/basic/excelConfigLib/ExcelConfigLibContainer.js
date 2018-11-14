import { connect } from 'react-redux';
import { Action } from '../../../action-reducer/action';
import { EnhanceLoading } from '../../../components/Enhance';
import { fetchJson, getObject, showError } from '../../../common/common';
import { buildPageState, searchAction, pageNumberAction, ConfirmDialog, cancelConfirmActionCreator } from './helper2';
import { onUploadAction } from './New/helper';
import helper from './helper';
import ExcelConfigLib from './ExcelConfigLib';
import { URL_UPLOAD_EXCEL } from './uploadUrl';

const STATE_PATH = ['basic', 'excelConfigLib'];
const URL_CONFIG = '/api/basic/excelConfigLib/config';
const URL_LIST = '/api/basic/excelConfigLib/list';
const URL_MODEL_TYPE = '/api/basic/excelConfigLib/tenantModelType';
const URL_ADD = '/api/basic/excelConfigLib/add';
const URL_DELETE = '/api/basic/excelConfigLib/excelModelConfig';
const URL_EDIT_EXCEL = '/api/basic/excelConfigLib/selectExcelModel';
const URL_EXCEL = '/api/basic/excelConfigLib/uploadExcelModel';
const action = new Action(STATE_PATH);


// 初始化
const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  // 配置表
  const { returnCode, returnMsg, result } = await fetchJson(URL_CONFIG);
  if (returnCode !== 0) {
    showError(returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  // 初始化列表
  const tableInfo = await helper.getInitInfo(URL_LIST);
  if (tableInfo.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  const { tableItems, maxRecords } = tableInfo;
  const { index } = result;

  const tabs = [{ key: 'index', title: index.title, close: false }];
  const other = { tabs, activeKey: 'index', currentPage: 1, searchData: {}, maxRecords, tableItems, status: 'page'};
  const payload = buildPageState(result, other);
  const success = await helper.getModelType(payload, URL_MODEL_TYPE);
  if (!success) {
    dispatch(action.assign({status: 'retry'}));
    return;
  }

  dispatch(action.create(payload));
};
// 新增
const onAddActionCreator = async (dispatch, getState, key) => {
  if (key !== 'add') {
    helper.addAction(dispatch, getState, action, STATE_PATH, URL_ADD, key);
  }
};

// 编辑
const onEditActionCreator = async (dispatch, getState, key, checkItem) => {
  helper.editAction(dispatch, getState, action, STATE_PATH, URL_EDIT_EXCEL, checkItem);
};

// 搜索值变化
const onChangeActionCreator = (key, value) => async (dispatch) => {
  dispatch(action.assign({ [key]: value }, 'searchData'));
};

// 搜索条件触发
const onSearchActionCreator = async (dispatch, getState) => {
  searchAction(dispatch, action, helper.getSelfState(getState(), STATE_PATH), URL_LIST);
};
// 重置
const resetActionCreator = (dispatch, getState) => {  // 重置
  dispatch(action.assign({ searchData: {} }));
};
// 复制新增
const copyActionCreator = async (dispatch, getState, key, checkItem) => {
  helper.copyAction(dispatch, getState, action, STATE_PATH, URL_EDIT_EXCEL, checkItem);
};

// 删除
const deleteActionCreator = async (dispatch, getState, key, checkItem) => {
  helper.deleteAction(dispatch, getState, action, STATE_PATH, URL_DELETE, checkItem);
};

// 导入测试
const importActionCreator = (dispatch, getState, key, checkItem) => {
  dispatch(action.assign({ visible1: true, id: checkItem[0].id }));
};

// 表格勾选事件
const onCheckActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({ checked }, 'tableItems', rowIndex);
};

const clickEvents = {
  search: onSearchActionCreator,
  reset: resetActionCreator,
  add: onAddActionCreator,
  edit: onEditActionCreator,
  copyAdd: copyActionCreator,
  delete: deleteActionCreator,
  import: importActionCreator,
};

const actions = ['edit', 'copyAdd', 'delete', 'import'];

const checkedList = (tableItems = [], multiple = false) => {
  const checkedList = tableItems.reduce((list, item) => {
    if (item.checked) {
      //delete item.checked;
      list.push(item);
    }
    return list;
  }, []);
  if (multiple) return checkedList;
  return checkedList.length !== 1 ? [] : checkedList;
};

const onClickActionCreator = (key) => async (dispatch, getState) => {
  let checkItem = [];
  if (actions.indexOf(key) !== -1) {
    const { tableItems } = helper.getSelfState(getState(), STATE_PATH);
    checkItem = checkedList(tableItems);
    if (checkItem.length === 0) {
      showError('请勾选一个选项进行操作');
      return;
    }
  }
  if (clickEvents[key]) {
    if (key === 'delete') {
      ConfirmDialog.onCancel = () => {
        cancelConfirmActionCreator(dispatch, getState, action);
      };
      ConfirmDialog.onOk = () => {
        clickEvents[key](dispatch, getState, key, checkItem);
      };
      ConfirmDialog.content = '是否确认删除';
      dispatch(action.assign({ confirmType: key, ConfirmDialog }));
    }else{
      clickEvents[key](dispatch, getState, key, checkItem);
    }
  } else {
    clickEvents.add(dispatch, getState, key, checkItem);
  }
};
// 页码过滤
const pageNumberActionCreator = (currentPage) => async (dispatch, getState) => {
  const { pageSize } = helper.getSelfState(getState(), STATE_PATH);
  pageNumberAction(dispatch, action, helper.getSelfState(getState(), STATE_PATH), currentPage, pageSize, URL_LIST);
};
// 页条数过滤
const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  pageNumberAction(dispatch, action, helper.getSelfState(getState(), STATE_PATH), currentPage, pageSize, URL_LIST);
};


// 取消
const onCancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({ visible1: false }));
};
// 上传
const onUploadActionCreator = (file) => async (dispatch, getState) => {
  onUploadAction(dispatch, getState, action, STATE_PATH, URL_EXCEL, URL_UPLOAD_EXCEL, file);
};

const filters = ['status', 'activeKey', 'tabs', 'ConfirmDialog'];
const mapStateToProps = (state) => {
  return getObject(helper.getSelfState(state, STATE_PATH), filters.concat(ExcelConfigLib.PROPS));
};

const actionCreators = {
  onInit: initActionCreator,
  onClick: onClickActionCreator,
  onChange: onChangeActionCreator,
  onSearch: onSearchActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onCheck: onCheckActionCreator,
  onCancel: onCancelActionCreator,
  onUpload: onUploadActionCreator,
};

const component = EnhanceLoading(ExcelConfigLib);
const Container = connect(mapStateToProps, actionCreators)(component);
export default Container;
