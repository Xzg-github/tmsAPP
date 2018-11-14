import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {postOption, getObject, swapItems, fetchJson, showError,  getActions} from '../../../common/common';
import {fetchDictionary2, setDictionary} from '../../../common/dictionary';
import {toFormValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildOrderPageState} from '../../../common/orderAdapter';
import {buildEditState} from './EditDialogContainer';
import {search, search2} from '../../../common/search';

const STATE_PATH = ['platform', 'importTemplate'];
const URL_CONFIG = '/api/platform/importTemplate/config';
const URL_LIST = '/api/platform/importTemplate/list';
const URL_DEL = '/api/platform/importTemplate/del';
const URL_DOWNLOAD= '/api/common/download';  // 点击下载
const URL_LEAD = '/api/platform/importTemplate/lead_list';
const URL_ISACTIVE = '/api/platform/importTemplate/is_active';

const action = new Action(STATE_PATH);

export const buildState = async () => {
  let res, data, config;
  res = await fetchJson(URL_CONFIG);
  if (!res) {
    showError('get config failed');
    return;
  }
  config = res.result;

  const buttons = config.index.buttons;
  const actions = getActions('importTemplate');
  config.index.buttons = buttons.filter(button => actions.findIndex(item => item === button.sign)!==-1);

  const {tableCols, filters} = config.index;
  const {controls, editControls} = config.edit;
  data = await fetchDictionary2(tableCols);
  if(data.returnCode !==0){
    showError(data.returnMsg);
    return;
  }
  setDictionary(filters, data.result);
  setDictionary(tableCols, data.result);
  setDictionary(controls, data.result);
  setDictionary(editControls, data.result);
  const modeDic = data.result.upload_mode;

  res = await search(URL_LIST, 0, config.index.pageSize, {});
  if(res.returnCode !=0){
    showError(res.returnMsg);
    return;
  }else data = res.result;

  return buildOrderPageState(data, config.index, {editConfig: config.edit, modeDic});
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const checkedOne = (tableItems) => {
  const index = tableItems.reduce((result, item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return index.length !== 1 ? -1 : index[0];
};

const changeActionCreator = (key, value) => (dispatch) =>{
  dispatch(action.assign({[key]: value}, 'searchData'));
};

const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch, getState) =>{
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex));
};

const swapActionCreator = (key1, key2) => (dispatch) => {
  const {tableCols} = getSelfState(getState());
  dispatch(action.assign({tableCols: swapItems(tableCols, key1, key2)}));
};

const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak));
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
};

const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, toFormValue(searchData), newState);
};

const resetActionCreator = (dispatch) =>{
  dispatch( action.assign({searchData: {}}) );
};

const addAction = (dispatch, getState) => {
  const {editConfig, modeDic} = getSelfState(getState());
  const payload = buildEditState(editConfig, {}, false, '', modeDic);
  dispatch(action.assign(payload, 'edit'));
};

const FORMATS = ['image/jpeg', 'image/gif', 'image/bmp', 'image/jpg', 'image/png', 'image/tiff', 'image/gif', 'image/pcx', 'image/tga', 'image/exif', 'image/fpx', 'image/svg', 'image/psd', 'image/cdr', 'image/pcd', 'image/dxf', 'image/ufo', 'image/eps', 'image/ai', 'image/raw', 'image/WMF'];
const FORMATS1 = ['.jpeg', '.gif', '.bmp', '.jpg', '.png', '.tiff', '.gif', '.pcx', '.tga', '.exif', '.fpx', '.svg', '.psd', '.cdr', '.pcd', '.dxf', '.ufo', '.eps', '.ai', '.raw', '.WMF'];

const formatDisplayList =  async (originFileList=[]) => {
  let fileList = [], uid = 0;
  for(let item of originFileList) {
    let fileItem = {};
    if(item.fileFormat ==='id'){
      const { result, returnMsg, returnCode }  = await fetchJson(`${URL_DOWNLOAD}/${item.fileUrl}`);
      if (returnCode !== 0) {
        showError(returnMsg);
        return;
      }
      fileItem.url = `/api/proxy/file-center-service/${result[item.fileUrl]}`;
    }
    if (FORMATS1.indexOf(item.fileName.substr(item.fileName.lastIndexOf('.'))) !== -1) {
      fileItem.type = 'image/jpeg';
    }else {
      fileItem.thumbUrl = '/default.png';
    }
    fileItem.status='done';
    fileItem.name = item.fileName;
    fileItem.uid = ++uid;
    fileItem.response = { returnCode: 0, result: item.fileUrl };
    fileItem.fileFormat = item.fileFormat;
    fileList.push(fileItem);
  }
  return fileList;
};

const editAction = async(dispatch, getState) => {
  const {tableItems, editConfig, modeDic} = getSelfState(getState());
  const index = checkedOne(tableItems);
  let fileList = [], upload;
  if(tableItems[index].uploadMode !== 'upload_mode_epld_excel'){
    upload = true;
  }else{
    upload = false;
  }
  if(tableItems[index].uploadTemplate && tableItems[index].uploadTemplate.length === 1){
    fileList = await formatDisplayList(tableItems[index].uploadTemplate);
  }else {
    fileList = [];
  }
  if (index !== -1 && tableItems[index].active !== 'active_invalid' && tableItems[index].uploadMode === 'upload_mode_epld_excel') {
    let newModeValue = tableItems[index].modeValue;
    const payload = buildEditState(editConfig, tableItems[index], true, index, modeDic, fileList, upload, newModeValue);
    dispatch(action.assign(payload, 'edit'));
  }else if (index !== -1 && tableItems[index].active !== 'active_invalid' && tableItems[index].uploadMode !== 'upload_mode_epld_excel') {
    const payload = buildEditState(editConfig, tableItems[index], true, index, modeDic, fileList, upload);
    dispatch(action.assign(payload, 'edit'));
  } else{
    showError('不能编辑失效状态')
  }
};

const doubleClickActionCreator = (rowIndex) => async(dispatch, getState) => {
  const {tableItems, editConfig, modeDic} = getSelfState(getState());
  let fileList = [], upload;
  if(tableItems[rowIndex].uploadMode !== 'upload_mode_epld_excel'){
    upload = true;
  }else{
    upload = false;
  }
  if(tableItems[rowIndex].uploadTemplate && tableItems[rowIndex].uploadTemplate.length === 1){
    fileList = await formatDisplayList(tableItems[rowIndex].uploadTemplate);
  }else {
    fileList = [];
  }
  if(tableItems[rowIndex].active !== 'active_invalid'&& tableItems[rowIndex].uploadMode === 'upload_mode_epld_excel'){
    let newModeValue = {value: tableItems[rowIndex].modeValue, title: tableItems[rowIndex].modeTitle};
    const payload = buildEditState(editConfig, tableItems[rowIndex], true, rowIndex, modeDic, fileList, upload, newModeValue);
    dispatch(action.assign(payload, 'edit'));
  }else if(tableItems[rowIndex].active !== 'active_invalid' && tableItems[rowIndex].uploadMode !== 'upload_mode_epld_excel'){
    const payload = buildEditState(editConfig, tableItems[rowIndex], true, rowIndex, modeDic, fileList, upload);
    dispatch(action.assign(payload, 'edit'));
  }
  else{
    showError('不能编辑失效状态')
  }
};

// 查看
const linkActionCreator = (key, rowIndex, item) => async (dispatch, getState) => {
  if (key === 'uploadTemplate') {
    if(item.fileFormat === 'id'){
      const {returnCode, result, returnMsg} = await fetchJson(`${URL_DOWNLOAD}/${item.fileUrl}`);
      if (returnCode !== 0) {
        return showError(returnMsg);
      }
      window.open(`/api/proxy/file-center-service/${result[item.fileUrl]}`);
    }else {
      window.open(item.fileUrl);
    }
  }
};

const importAction = async(dispatch, getState) => {
  const{returnCode, returnMsg} = await fetchJson(URL_LEAD, postOption());
  if(returnCode === 0){
    updateTable(dispatch, getState);
  }else {
    showError(returnMsg);
    return;
  }
};

// 激活
const activeAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  let ids=[];
  tableItems.map(item => {if(item.checked){ids.push(item.id)}});
  if (ids.length === 0) {
    showError('请勾选记录');
    return;
  }
  const {returnCode, returnMsg} = await fetchJson(URL_ISACTIVE, postOption({active: 'active_activated', ids}, 'put'));
  if (returnCode === 0) {
    return updateTable(dispatch, getState);
  } else {
    showError(returnMsg);
  }
};

// 失效
const inactiveAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  let ids=[];
  tableItems.map(item => {if(item.checked){ids.push(item.id)}});
  if (ids.length === 0) {
    showError('请勾选记录');
    return;
  }
  const {returnCode, returnMsg} = await fetchJson(URL_ISACTIVE, postOption({active: 'active_invalid', ids}, 'put'));
  if (returnCode === 0) {
    return updateTable(dispatch, getState);
  } else {
    showError(returnMsg);
  }
};

const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index === -1) {
    showError("只能删除一条");
    return;
  }
  const item = tableItems[index];
  if(item.active === 'active_unactivated'){
    const res = await fetchJson(`${URL_DEL}/${item.id}`, 'delete');
    if (res.returnCode) {
      showError(res.returnMsg);
    } else {
      dispatch(action.del('tableItems', index));
      return updateTable(dispatch, getState);
    }
  }else{
    showError('只能删除未激活状态');
  }
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchClickActionCreator,
  add: addAction,
  edit: editAction,
  import: importAction,
  active: activeAction,
  inactive: inactiveAction,
  del: delAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
  const {filters} = getSelfState(getState());
  let res;
  switch (key) {
    case 'serviceId': {
      res = await search(URL_SERVICE_LIST, 0, 10, {['serviceName'] : title});
      break;
    }
    default:
      return;
  }
  if (res.returnCode!==0) return;
  let items = res.result.data;
  let options = [];
  items.map((item) => {
    options.push({
      value: item.id,
      title: item.serviceName
    })
  });
  const index = filters.findIndex(item => item.key == key);
  dispatch(action.update({options}, 'filters', index));
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const actionCreators = {
  onClick: clickActionCreator,
  onSearch: formSearchActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onSwapCol: swapActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onLink: linkActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable};
