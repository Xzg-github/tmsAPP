import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import helper,{getObject, swapItems, fetchJson, showError} from '../../../common/common';
import {toFormValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildEditState} from './EditDialogContainer';
import EditDialogContainer from './EditDialogContainer';
import {search2} from '../../../common/search';
import {EnhanceDialogs} from '../../../components/Enhance';
import ConfirmDialogContainer from './ConfirmDialogContainer'

const prefix = ['config', 'dataSet','dataSet1'];
const action = new Action(prefix);
const URL_LIST = '/api/config/dataset/outputList';
const URL_REPORT = '/api/config/dataset/reportType';//模板类型下拉
const URL_TABLE_ITEMS = '/api/config/dataset/tableItems';

const getSelfState = (rootState) => {
  return getPathValue(rootState, prefix);
};

//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak));
};

const addAction = (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const payload = buildEditState(editConfig, {},false);
  dispatch(action.assign(payload, 'edit'));
};

const editAction = async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    let checkedId = tableItems[index].id;
    const res = await fetchJson(`${URL_TABLE_ITEMS}/${checkedId}`,'get');
    if (res.returnCode !== 0) {
      return;
    }
    editConfig.tableItems  = res.result.list;
    res.result.id = checkedId;
    const payload = buildEditState(editConfig, res.result, true);
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
  const {tableItems} = getSelfState(getState());
  const index =  helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    showError('请勾选一条记录进行删除');
    return;
  }
  const item = tableItems[index];
  let checkedId = item.id;
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
  edit:editAction,
  search: searchClickActionCreator,
  del: delAction,
  reset: resetActionCreator
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const changeActionCreator = (key, value) =>  async (dispatch, getState) => {
  dispatch(action.assign({[key]: value}, 'searchData'));
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
  const {filters} = getSelfState(getState());
  let data, options, body;
  switch (key) {
    case 'reportTypeConfigId': {
      body = {maxNumber: 0,param:{modeName:title}};
      data = await fetchJson(URL_REPORT, helper.postOption(body));
      break;
    }
    default:
      return;
  }
  if (data.returnCode != 0) {
    return;
  }
  options = data.result;
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
  return getObject(getSelfState(state), OrderPage.PROPS.concat(['edit','confirm']));
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onSwapCol: swapActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onSearch: formSearchActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceDialogs(OrderPage,
  ['edit','confirm'],[EditDialogContainer,ConfirmDialogContainer]));
export default Container;
export {updateTable};
