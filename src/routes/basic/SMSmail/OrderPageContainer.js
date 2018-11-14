import { connect } from 'react-redux';
import OrderPage from './orderPage/OrderPage';
import helper,{getObject, swapItems, showError} from '../../../common/common';
import {toFormValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search2} from './SMSmailContainer'
import {buildEditState} from './EditDialogContainer'

const STATE_PATH = ['basic','SMSmail'];
const action = new Action(STATE_PATH);


const URL_SMS_LIST = '/api/basic/SMSmail/smsList';
const URL_MAIL_LIST = '/api/basic/SMSmail/mailList';

const URL_SMS_DEL = '/api/basic/SMSmail/smsDel';
const URL_MAIL_DEL = '/api/basic/SMSmail/mailDel';


const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={},activeKey,searchData} = getSelfState(getState());
  const state = getSelfState(getState());
  const url = activeKey === 'SMS' ? URL_SMS_LIST : URL_MAIL_LIST;
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, url, currentPage, pageSize, toFormValue(searchDataBak),newState,state[activeKey]);
};

const addAction  = (dispatch, getState) => {
  const {activeKey,SMS,mail} = getSelfState(getState());
  const config = activeKey === 'SMS' ? SMS : mail;
  const payload = buildEditState(config, {},false,activeKey,'新增');
  dispatch(action.assign(payload, 'edit'));
};

const passwordAction  = (dispatch, getState) => {
  const {tableItems, editConfig,activeKey,SMS,mail} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    showError('请勾选一条记录进行编辑');
    return;
  }else {
    const config = activeKey === 'SMS' ? SMS : mail;
    let id = tableItems[index].id;
    const payload = buildEditState(config, {id},false,activeKey,'设置密码');
    dispatch(action.assign(payload, 'edit'));
  }
}


const editAction = async(dispatch, getState) => {
  const {tableItems, editConfig,activeKey,SMS,mail} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    showError('请勾选一条记录进行编辑');
    return;
  }else {
    const config = activeKey === 'SMS' ? SMS : mail;
    const payload = buildEditState(config, tableItems[index], true,activeKey,'编辑');
    dispatch(action.assign(payload, 'edit'));
  }
};

const findCheckedIndex1 = (items) => {
  const index = items.reduce((result = [], item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return !index.length ? -1 : index;
};



const delAction = async (dispatch, getState) => {
  const {tableItems,activeKey} =  getSelfState(getState());
  const index = findCheckedIndex1(tableItems);
  if (index === -1) {
    showError('请勾选一条记录进行编辑');
    return;
  }
  let item = [];
  index.forEach(index => {
    item.push(tableItems[index].id)
  });
  let ids = item;
  const options = helper.postOption(ids, "post");

  const url = activeKey === 'SMS' ? URL_SMS_DEL : URL_MAIL_DEL;
  let data = await helper.fetchJson(url, options);
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  return updateTable(dispatch, getState);
};


const resetActionCreator = (dispatch) =>{
  dispatch( action.assign({searchData: {}}) );
};

const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData,activeKey} = getSelfState(getState());
  const state = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  const url = activeKey === 'SMS' ? URL_SMS_LIST : URL_MAIL_LIST;
  return search2(dispatch, action, url, 1, pageSize, toFormValue(searchData), newState,state[activeKey]);
};


const toolbarActions = {
  add: addAction,
  search: searchClickActionCreator,
  del: delAction,
  edit: editAction,
  password:passwordAction,
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
  const {tableItems, editConfig,activeKey,SMS,mail} = getSelfState(getState());
  const config = activeKey === 'SMS' ? SMS : mail;
  const payload = buildEditState(config, tableItems[rowIndex], true, activeKey);
  dispatch(action.assign(payload, 'edit'));
};

const changeActionCreator = (key, value) => (dispatch) =>{
  dispatch(action.assign({[key]: value}, 'searchData'));
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {

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
  const {pageSize, searchDataBak={},activeKey} = getSelfState(getState());
  const newState = {currentPage};
  const state = getSelfState(getState());
  const url = activeKey === 'SMS' ? URL_SMS_LIST : URL_MAIL_LIST;
  return search2(dispatch, action, url, currentPage, pageSize, toFormValue(searchDataBak), newState,state[activeKey]);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={},activeKey} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  const state = getSelfState(getState());
  const url = activeKey === 'SMS' ? URL_SMS_LIST : URL_MAIL_LIST;
  return search2(dispatch, action, url, currentPage, pageSize, toFormValue(searchDataBak), newState,state[activeKey]);
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onSearch: formSearchActionCreator,
  onDoubleClick: doubleClickActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable};
