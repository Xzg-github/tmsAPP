import { showError, showSuccessMsg, postOption, fetchJson } from '../../../common/common';
import { getPathValue } from '../../../action-reducer/helper';
import helper2 from './New/helper';

const createKeys = (currencyTypeRateList, tdArr) => {
  return currencyTypeRateList.reduce((options, item) => {
    for (let arr of tdArr) {
      item[arr[1]] && (item[arr[0]] = item[arr[1]]);
    }
    options.push(item);
    return options;
  }, []);
};

const ConfirmDialog = {
  title: '请确认操作',
  ok: '确认',
  cancel: '取消',
};

const getSelfState = (rootState, STATE_PATH) => {
  return getPathValue(rootState, STATE_PATH);
};

const getInitInfo = async (URL_LIST) => {
  const filter = { itemFrom: 0, itemTo: 10 };
  const option = postOption(filter, 'post');
  const { returnCode, returnMsg, result } = await fetchJson(URL_LIST, option);
  if (returnCode !== 0) {
    showError(returnMsg);
    return { returnCode: -1 };
  }
  const { data: tableItems = [], returnTotalItems: maxRecords = 0 } = result;
  return { tableItems, maxRecords, returnCode };
};

const generateTableItems = (content) => {
  if (!(content instanceof Object)) {
    return [];
  }
  return content.table.reduce((list, item) => {
    const subs = content.field[item.tableCode];
    const { tableCode, tableValue, tableTitle, parentCode } = item;
    const mapperList = helper2.generateSubTableItems(subs);
    list.push({
      tableCode,
      tableTitle,
      tableValue,
      mapperList,
      parentCode,
      sheetName: '',
      sheetIndex: '',
      titleRowIndex: '',
      dataRowIndex: '',
    });
    return list;
  }, []);
};

const assignModalData = async(dispatch, getState, action, STATE_PATH, content, isEdit = false, other = {}) => {
  const tableItems = isEdit ? content : generateTableItems(content);
  const tableItems1 = tableItems[0].mapperList;
  // 字段与列标题默认一致
  if (!isEdit) {
    tableItems1.map(t => {
      t.columnTitle = t.fieldTitle;
    });
  }
  const { modelInfo } = getSelfState(getState(), STATE_PATH);
  let value = other;
  const add = { ...modelInfo, value, visible: true, tableItems, tableItems1, currentKey: 0, isEdit };
  dispatch(action.assign({ edit: add, activeKey: 'edit' }));
};

const addAction = async (dispatch, getState, action, STATE_PATH, URL_ADD, key) => {
  const { returnCode, returnMsg, result } = await fetchJson(`${URL_ADD}/${key}`);
  if (returnCode !== 0) {
    showError(returnMsg);
    return;
  }
  const { buttons } = getSelfState(getState(), STATE_PATH);
  const buttonInfo = buttons.filter(item => item.key === 'add');
  const model = buttonInfo[0].children.filter(item => item.key === key);
  // const { id: tenantModelTypeId, apiStandardLibraryId, tenantId } = model[0];
  const { id: apiStandardLibraryId, tenantId, apiName: modelName } = model[0];
  // const other = { apiStandardLibraryId, tenantModelTypeId, tenantId };
  const other = { apiStandardLibraryId, tenantId, modelName };
  assignModalData(dispatch, getState, action, STATE_PATH, result.content, false, other);
};

const editAction = async (dispatch, getState, action, STATE_PATH, URL_EDIT_EXCEL, checkItem) => {
  const { returnCode, returnMsg, result } = await fetchJson(`${URL_EDIT_EXCEL}/${checkItem[0].id}`);
  if (returnCode !== 0) {
    showError(returnMsg);
    return;
  }
  //const isEdit = true;
  const { id, apiStandardLibraryId, modelCode, modelName, url, content, uniqueIndex, uniqueTitle } = result;
  const other = { id, apiStandardLibraryId, modelCode, modelName, url, content, uniqueIndex, uniqueTitle };
  assignModalData(dispatch, getState, action, STATE_PATH, result.sheetList, true, other);
};

const getModelType = async (payload, URL_MODEL_TYPE) => {
  const { returnCode, returnMsg, result } = await fetchJson(URL_MODEL_TYPE);
  if (returnCode !== 0) {
    showError(returnMsg);
    return false;
  }
  payload.buttons.map(item => {
    if (item.key === 'add') {
      // apiStandardLibraryId
      item.children = createKeys(result, [['key', 'id'], ['title', 'apiName']]);
    }
  });
  return true;
};

const copyAction = async (dispatch, getState, action, STATE_PATH, URL_EDIT_EXCEL, checkItem) => {
  const { returnCode, returnMsg, result } = await fetchJson(`${URL_EDIT_EXCEL}/${checkItem[0].id}`);
  if (returnCode !== 0) {
    showError(returnMsg);
    return;
  }
  const isEdit = false;
  // const { apiStandardLibraryId, url, tenantModelTypeId, tenantId } = result;
  const { apiStandardLibraryId, url, tenantId, modelName, uniqueIndex, uniqueTitle} = result;
  // const other = { apiStandardLibraryId, url, tenantModelTypeId, tenantId, isEdit };
  const value = { apiStandardLibraryId, url, tenantId, modelName, uniqueIndex, uniqueTitle };
  const tableItems = result.sheetList;
  const tableItems1 = tableItems[0].mapperList;
  const { modelInfo } = getSelfState(getState(), STATE_PATH);
  const add = { ...modelInfo, value, visible: true, tableItems, tableItems1, currentKey: 0, isEdit };
  dispatch(action.assign({ edit: add, activeKey: 'edit' }));
};

const deleteAction = async (dispatch, getState, action, STATE_PATH, URL_DELETE, checkItem) => {
  const option = postOption({}, 'delete');
  const { returnCode, returnMsg } = await fetchJson(`${URL_DELETE}/${checkItem[0].id}`, option);
  if (returnCode !== 0) {
    showError(returnMsg);
    return;
  }
  showSuccessMsg(returnMsg);
  dispatch(action.del('tableItems', { key: 'id', value: checkItem[0].id }));
  dispatch(action.assign({ confirmType: '' }));
};

const helper = {
  getSelfState,
  addAction,
  getInitInfo,
  copyAction,
  editAction,
  deleteAction,
  ConfirmDialog,
  getModelType,
};

export {
  getSelfState,
  addAction,
  getInitInfo,
  copyAction,
  editAction,
  deleteAction,
  getModelType,
  ConfirmDialog,
};

export default helper;
