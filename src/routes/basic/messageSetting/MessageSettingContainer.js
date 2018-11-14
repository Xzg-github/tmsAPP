import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import helper from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import showDiaLog from './EditPageContainer'
import {toFormValue} from '../../../common/check';
import {search} from '../../../common/search';
import {toTableItems} from '../../../common/state';

const STATE_PATH = ['basic', 'messageSetting'];
const URL_LIST = '/api/basic/messageSetting/list';
const URL_DEL = '/api/basic/messageSetting/del';
const NAME_URL = '/api/basic/roleDataAuthority/user';  // 用户
const URL_INSTITUTION = '/api/basic/institution/list'; // 机构

const search2 = async (dispatch, action, url, currentPage, pageSize, filter, newState={}, path=undefined) => {

  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;
  const {returnCode, returnMsg, result} = await search(url, from, to, filter);

  result.data.length > 0 && result.data.forEach(item => {
    let userId = []
    item.userList.forEach(user => {
      if(user.userId && user.userId.title){
        userId.push(user.userId.title)
      }
    });
    item.userId = userId

  });

  if (returnCode === 0) {
    const payload = {
      ...newState,
      tableItems: toTableItems(result),
      maxRecords: result.returnTotalItem
    };
    dispatch(action.assign(payload, path));
  } else {
    helper.showError(returnMsg);
  }
};


//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={},tabKey} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak),{},tabKey);
};

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, STATE_PATH);
  return parent[parent.activeKey];
};


const addActionCreator = (dispatch, getState) => {
  const {editConfig} = getPathValue(getState(), STATE_PATH);
  const okFunc = () => {
    return updateTable(dispatch, getState);
  };
  return showDiaLog(editConfig,[], {},okFunc,false);

};

const editActionCreator = (dispatch, getState) => {
  const {editConfig} = getPathValue(getState(), STATE_PATH);
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条记录进行编辑');
    return;
  }
  const okFunc = () => {
    return updateTable(dispatch, getState);
  };
  return showDiaLog(editConfig,tableItems[index].userList, tableItems[index],okFunc,true);


};

const delActionCreator = async(dispatch,getState) => {
  const {tableItems} = getSelfState(getState());

  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条记录进行删除');
    return;
  }

  const {returnCode,returnMsg} = await helper.fetchJson(`${URL_DEL}/${tableItems[index].id}`,'delete');
  if(returnCode != 0){
    helper.showError(returnMsg)
    return
  }
  helper.showSuccessMsg('删除成功')
  return updateTable(dispatch,getState)

};

const resetActionCreator  = (dispatch, getState) => {
  const {tabKey} = getSelfState(getState());
  dispatch(action.assign({searchData: {}}, tabKey));
};

const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData,tabKey} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState,tabKey);
};


const toolbarActions = {
  add:addActionCreator,
  edit:editActionCreator,
  del:delActionCreator,
  search: searchClickActionCreator,
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
  const {editConfig} = getPathValue(getState(), STATE_PATH);
  const {tableItems} = getSelfState(getState());

  const okFunc = () => {
    return updateTable(dispatch, getState);
  };
  return showDiaLog(editConfig,tableItems[rowIndex].userList, tableItems[rowIndex],okFunc,true);

};

const changeActionCreator = (key, value) => (dispatch,getState) =>{
  const {tabKey} = getSelfState(getState());
  dispatch(action.assign({[key]: value}, [tabKey, 'searchData']));
};



const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch, getState) =>{
  const {tabKey} = getSelfState(getState());
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, [tabKey, 'tableItems'], rowIndex));
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={},tabKey} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState,tabKey);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={},tabKey} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState,tabKey);
};


const searchActionCreator = (key, value) => async (dispatch, getState) => {
  const {filters,tabKey} = getSelfState(getState());
  let data, options, body,res = {};
  switch (key) {
    case 'userId' : {
      res = helper.getJsonResult(await helper.fetchJson(NAME_URL, helper.postOption({itemFrom:0, itemTo:65536,filter: {}})));
      break
    }
    case 'institutionId' : {
      //res = helper.getJsonResult(await helper.fetchJson(URL_INSTITUTION, helper.postOption({itemFrom:0, itemTo:65536, filter:{}})));
      const url = `/api/standard/search/institution?filter=${value}`
      res.data = helper.getJsonResult(await helper.fetchJson(url))

      break
    }
    default:
      return;
  }
  options = res.data;
  const index = filters.findIndex(item => item.key == key);
  dispatch(action.update({options}, [tabKey,'filters'], index));
};




const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onSearch: searchActionCreator,
};

const MessageThemeContainer = connect(mapStateToProps, actionCreators)(OrderPage);
export default MessageThemeContainer;

