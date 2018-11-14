/**
 * Created by vincentzheng on 2017/8/4.
 */
import { getSelfState, getInitInfo } from '../helper';
import { fetchJson, getObject, showError, postOption, showSuccessMsg } from '../../../../common/common';

const onCancelAction = (dispatch, getState, action) => {
  dispatch(action.assign({ visible: false }));
};

const generateSubTableItems = (subs) => {
  const values = [];
  Object.keys(subs).map(key => {
    subs[key]['fieldCode'] = key;
    values.push(subs[key]);
  });
  return values;
};

const saveAction = async (dispatch, getState, action, STATE_PATH, URL_INSERT_EXCEL, URL_LIST, URL_EDIT) => {
  const { tableItems, tableItems1, currentKey, isEdit, modelCode, value } = getSelfState(getState(), STATE_PATH);
  if (!value.modelName) {
    showError('请输入模板名');
    return;
  }
  let apiStandardLibraryId, modelName, tenantId, uniqueIndex, uniqueTitle, id, sheetList;
  if(!value.uniqueTitle){
    tableItems[currentKey].mapperList = tableItems1;
    apiStandardLibraryId = value.apiStandardLibraryId;
    modelName = value.modelName;
    tenantId = value.tenantId;
    uniqueIndex = '';
    uniqueTitle = '';
    id = value.id;
    sheetList = tableItems;
  }else{
    tableItems[currentKey].mapperList = tableItems1;
    apiStandardLibraryId = value.apiStandardLibraryId;
    modelName = value.modelName;
    tenantId = value.tenantId;
    uniqueIndex = value.uniqueTitle.value;
    uniqueTitle = value.uniqueTitle.title;
    id = value.id;
    sheetList = tableItems;
  }
  let data;
  if(isEdit){
    data = { sheetList, apiStandardLibraryId, modelName, tenantId, uniqueIndex, uniqueTitle, id };
  }else{
    data = { sheetList, apiStandardLibraryId, modelName, tenantId, uniqueIndex, uniqueTitle };
  }

  const option = postOption(data, 'post');
  const { returnCode, returnMsg, result } = isEdit ? await fetchJson(URL_EDIT, option) : await fetchJson(URL_INSERT_EXCEL, option);
  if (returnCode !== 0) {
    returnMsg && showError(returnMsg);
    return;
  }
  returnMsg && showSuccessMsg(returnMsg);

  if(isEdit){
    const { id: id1, url, content } = result;
    dispatch(action.assign({ id: id1, modelCode, url, content, isEdit: true, tableItems: sheetList }));
  }else{
    const { id: id1, modelCode, url, content } = result;
    dispatch(action.assign({ id: id1, modelCode, url, content, isEdit: true, tableItems: sheetList }));
  }


  // 更新主页数据
  const tableInfo = await getInitInfo(URL_LIST);
  if (tableInfo.returnCode !== 0) {
    return;
  }
  dispatch(action.assignParent({ tableItems: tableInfo.tableItems, maxRecords: tableInfo.maxRecords }));
};

const generateAction = async (dispatch, getState, action, STATE_PATH, URL_GENERATE, URL_LIST) => {
  const { value } = getSelfState(getState(), STATE_PATH);
  const { returnCode, returnMsg, result } = await fetchJson(`${URL_GENERATE}/${value.id}`);
  if (returnCode !== 0) {
    returnMsg && showError(returnMsg);
    return;
  }
  returnMsg && showSuccessMsg(returnMsg);
};


const onUploadAction = async (dispatch, getState, action, STATE_PATH, URL_EXCEL, URL_UPLOAD_EXCEL, file) => {
  const { value } = getSelfState(getState(), STATE_PATH);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('id', value.id);
  let xhr;
  if (window.XMLHttpRequest) { // code for all new browsers
    xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // code for IE5 and IE6
    xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
  }
  if (xhr != null) {
    // const xhr = new XMLHttpRequest();
    xhr.onload = (event) => {
      const { returnCode, returnMsg } = JSON.parse(xhr.responseText); // 服务器返回
      if (returnCode !== 0) {
        returnMsg && showError(returnMsg);
        return;
      }
      returnMsg && showSuccessMsg(returnMsg);
      dispatch(action.update({ checked: false }, 'tableItems', -1));
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
const helper = {
  onCancelAction,
  saveAction,
  generateAction,
  onUploadAction,
  generateSubTableItems,
};
export {
  onCancelAction,
  saveAction,
  generateAction,
  onUploadAction,
  generateSubTableItems,
}

export default helper;
