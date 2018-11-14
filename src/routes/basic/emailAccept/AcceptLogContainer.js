import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {postOption, swapItems, fetchJson, showError, showSuccessMsg} from '../../../common/common';
import {toFormValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search2} from '../../../common/search';

const STATE_PATH = ['config', 'emailAccept', 'log'];
const action = new Action(STATE_PATH);
const URL_LOG_LIST = '/api/config/emailAccept/log_list';
const URL_LOG_DEL = '/api/config/emailAccept/log_del';
const URL_LOG_ACCEPT = '/api/config/emailAccept/log_accept';
const URL_EMAIL_DROP = '/api/config/emailAccept/email_drop';
const URL_DOWNLOAD= '/api/common/download';  // 点击下载

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LOG_LIST, currentPage, pageSize, toFormValue(searchDataBak));
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

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LOG_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LOG_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
};

const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LOG_LIST, 1, pageSize, toFormValue(searchData), newState);
};

const resetActionCreator = (dispatch) =>{
  dispatch( action.assign({searchData: {}}) );
};

//收取
const addAction = async(dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  if(!searchData.receiveEmailAddress){
    showError('必须存在接收邮箱！');
    return;
  }
  let email_address = searchData.receiveEmailAddress.title;
  const res = await fetchJson(`${URL_LOG_ACCEPT}/${email_address}`);
  if(res.returnCode !== 0){
    showError(res.returnMsg);
    return;
  }else{
    showSuccessMsg('收取成功');
  }
};

// 删除
const delAction = async(dispatch, getState) => {
  let ids = [];
  const {tableItems} = getSelfState(getState());
  const items = tableItems.filter(item => !item.checked);
  tableItems.filter(item => {
    if (item.checked) {
      return item.id ? ids.push(item.id) : '';
    }
  });
  if (ids.length === 0) {
    dispatch(action.assign({tableItems: items}));
  } else {
    const res = await fetchJson(URL_LOG_DEL, postOption(ids, 'delete'));
    if (res.returnCode === 0) {
      showSuccessMsg('删除成功！');
      return updateTable(dispatch, getState);
    }else{
      showError(res.returnMsg);
    }
  }
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchClickActionCreator,
  add: addAction,
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
  let body, res;
  if(key === 'receiveEmailAddress'){
    body = {maxNumber: 10, filter: title};
    res = await fetchJson(URL_EMAIL_DROP, postOption(body));
    let index = {key: 'key', value: 'receiveEmailAddress'};
    dispatch(action.update({options: res.result}, 'filters', index));
  } else if(key ==='importTemplateConfigId'){
    body = {maxNumber: 10, filter: title};
    res = await fetchJson(URL_LEAD_LIST, postOption(body));
    let options = [];
    res.result.map((item) => {
      options.push({
        value: item.id,
        title: item.uploadSubject
      })
    });
    let index = {key: 'key', value: 'importTemplateConfigId'};
    dispatch(action.update({options}, 'filters', index));
  }
};

// 查看
const linkActionCreator = (key, rowIndex, item) => async (dispatch, getState) => {
  if (key === 'fileList') {
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

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onClick: clickActionCreator,
  onSearch: formSearchActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onSwapCol: swapActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onLink: linkActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable};
