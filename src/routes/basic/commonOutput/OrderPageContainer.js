import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import helper, {getObject, swapItems, fetchJson, showError} from '../../../common/common';
import {toFormValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildEditState} from './EditPageContainer';
import {search2} from '../../../common/search';

const STATE_PATH =  ['basic', 'commonOutput'];
const URL_LIST = '/api/basic/commonOutput/list';
const URL_REPORT = '/api/config/dataset/reportType';//模板类型下拉
const URL_USER = '/api/basic/user/name'; //用户下拉


const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak));
};

const addAction  = (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const payload = buildEditState(editConfig, {},false);
  dispatch(action.assign(payload, 'edit'));
};



const findCheckedIndex1 = (items) => {
  const index = items.reduce((result = [], item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return !index.length ? -1 : index;
};

const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = findCheckedIndex1(tableItems);
  if (index === -1) {
    showError('请勾选一条记录进行删除');
    return;
  }
  let item = [];
  index.forEach(index => {
    item.push(tableItems[index].id)
  });
  let checkedId = item;
  if(checkedId) {
    const confirm = {
      title: '请确认操作',
      ok: '确认',
      cancel: '取消',
      content: '是否确认删除'
    };
    dispatch(action.assign({...confirm, checkedId}, 'confirm'));
  }
};


const resetActionCreator = (dispatch) =>{
  dispatch( action.assign({searchData: {}}) );
};

const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, toFormValue(searchData), newState);
};


const toolbarActions = {
  add: addAction,
  search: searchClickActionCreator,
  del: delAction,
  reset: resetActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const doubleClickActionCreator = (rowIndex) => (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const payload = buildEditState(editConfig, tableItems[rowIndex], true, rowIndex);
  dispatch(action.assign(payload, 'edit'));
};

const changeActionCreator = (key, value) => (dispatch) =>{
  dispatch(action.assign({[key]: value}, 'searchData'));
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
  const {filters} = getSelfState(getState());
  let data, options, body;
  switch (key) {
    case 'reportTypeConfigId': {
      body = {maxNumber: 0,param:{modeName:title}};
      data = await fetchJson(URL_REPORT, helper.postOption(body));
      if (data.returnCode != 0) {
        return;
      }
      break;
    }
    case 'userId': {
      const postData = {filter: title};
      const json = await fetchJson(URL_USER, helper.postOption(postData));
      if (json.returnCode) {
        return helper.showError(json.returnMsg);
      } else {
        data = json.result;
      }
      break;
    }
    default:
      return;
  }
  options = key !== 'userId' ? data.result :data.data;
  const index = filters.findIndex(item => item.key == key);
  dispatch(action.update({options}, 'filters', index));
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
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onSwapCol: swapActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onSearch: formSearchActionCreator,
  onDoubleClick: doubleClickActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable};
