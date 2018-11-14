import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {findOnlyCheckedIndex,getObject, swapItems, fetchJson, showError, initTableCols} from '../../../common/common';
import {toFormValue, dealActions} from '../../../common/check';
import {fetchDictionary, setDictionary} from '../../../common/dictionary';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildOrderPageState,toTableItems} from '../../../common/orderAdapter';
import {buildEditState} from './EditDialogContainer';
import {search} from '../../../common/search';
import {buildTreeState} from './DistributionDialogContainer';

const STATE_PATH = ['platform', 'urlResourceLib'];
const URL_CONFIG = '/api/platform/urlResourceLib/config';
const URL_LIST = '/api/platform/urlResourceLib/list';
const URL_TREE_LIST = '/api/platform/urlResourceLib/tree_list';
const action = new Action(STATE_PATH);

const unfold = (foldObj, separator, parentName) => {
  separator = separator || ".";
  parentName = parentName || "";
  let unfoldObj = {};

  if (typeof foldObj === "object") {
    for (let fieldName in foldObj) {
      if (foldObj.hasOwnProperty(fieldName)) {
        if (typeof foldObj[fieldName] === "object") {
          if (foldObj[fieldName] instanceof Array) {     // 数据为数组的处理函数
            let array = {};
            foldObj[fieldName].forEach((obj) => {       // 把数组对象[{key1: value, key2: value},{key1: value, key2: value}]根据key值转成对象数组{key1: []， key2: []}
              Object.keys(obj).forEach((key) => {
                if (Object.keys(array).indexOf(key) === -1) {
                  array[key] = [];                        // 对象数组初始化
                }
                array[key].push(typeof obj[key] === 'object' ? obj[key].title : obj[key]);
              });
            });
            Object.keys(array).forEach((key) => {     //
              const newKey = fieldName + separator + key;
              unfoldObj[newKey] = array[key].join(',');
            });
          } else {   // 数据为对象是的处理函数
            (function () {
              const _parentName = parentName ? (parentName + separator + fieldName) : fieldName;
              const _unfoldObj = unfold(foldObj[fieldName], separator, _parentName);
              for (let _fieldName in _unfoldObj) {
                if (_unfoldObj.hasOwnProperty(_fieldName)) {
                  unfoldObj[_fieldName] = _unfoldObj[_fieldName];
                }
              }
            })();
          }
        } else {
          const prefix = parentName ? (parentName + separator + fieldName) : fieldName;
          unfoldObj[prefix] = foldObj[fieldName];
        }
      }
    }
  } else {
    return foldObj;
  }
  return unfoldObj;
};

export const buildUrlsourceLib = async () => {
  let res, data, config;
  data = await fetchJson(URL_CONFIG);
  if (data.returnCode !== 0) {
    showError('get config failed');
    return;
  }
  config = data.result;
  config.index.buttons = dealActions(config.index.buttons, 'urlResourceLib');
  config.index.tableCols = initTableCols('client_factory', config.index.tableCols);
  const {tableCols, filters} = config.index;
  const {controls} = config.edit;
  data = await fetchDictionary(config.dicNames);

  if(data.returnCode !=0){
    showError(data.returnMsg);
    return;
  }
  setDictionary(tableCols, data.result);
  setDictionary(filters, data.result);
  setDictionary(controls, data.result);

  res = await search(URL_LIST, 0, config.index.pageSize, {});
  if(data.returnCode !=0){
    showError(data.returnMsg);
    return;
  }
  data = res.result;

  let dataReset = [];
  data.data.map(item => {
    dataReset.push(unfold(item, '_'))
  });
  data.data = dataReset;
  return buildOrderPageState(data, config.index, {editConfig: config.edit});
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};


const search2 = async (dispatch, action, url, currentPage, pageSize, filter, newState={}, path=undefined) => {
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;
  const {returnCode, returnMsg, result} = await search(url, from, to, filter);
  if(!result.data){
    return
  }
  let dataReset = [];
  result.data.map(item => {
    dataReset.push(unfold(item, '_'))
  });
  result.data = dataReset;
  if (returnCode === 0) {
    const payload = {
      ...newState,
      tableItems: toTableItems(result),
      maxRecords: result.returnTotalItem
    };
    dispatch(action.assign(payload, path));
  } else {
    showError(returnMsg);
  }
};


//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak));
};

const checkedOne = (tableItems) => {
  const index = tableItems.reduce((result, item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return index.length !== 1 ? -1 : index[0];
};

const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch, getState) =>{
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex));
};


const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const addAction = (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const payload = buildEditState(editConfig, {}, false);
  dispatch(action.assign(payload, 'edit'));
};

const resetActionCreator = (dispatch) =>{
  dispatch( action.assign({searchData: {}}) );
};


const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index =  findOnlyCheckedIndex(tableItems);
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

const editAction = (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    showError('请勾选一条记录进行编辑');
    return;
  }else {
    const payload = buildEditState(editConfig, tableItems[index], true, index);
    dispatch(action.assign(payload, 'edit'));
  }
};


const changeActionCreator = (key, value) => (dispatch) =>{
  dispatch(action.assign({[key]: value}, 'searchData'));
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


const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1}
  return search2(dispatch, action, URL_LIST, 1, pageSize, toFormValue(searchData), newState);
};


const distributionActionCreator = async(dispatch, getState) =>{
  const {tableItems} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index === -1) {
    showError("只能选中一条");
    return;
  }

  const checkedId = tableItems[index].id;
  const json = await fetchJson(`${URL_TREE_LIST}?urlResourceLibraryId=${checkedId}`);
  if (json.returnCode) {
    return showError(json.returnMsg);
  }

  const treeConfig = {
    ok: '确认',
    cancel: '取消',
    distributionTree: {},
    distributionExpand: {},
    distributionChecked: {}
  };
  const distribution = buildTreeState(treeConfig, json.result, checkedId);
  dispatch(action.assign({distribution}));
};

const toolbarActions = {
  add: addAction,
  search: searchClickActionCreator,
  reset: resetActionCreator,
  del: delAction,
  edit: editAction,
  distribution: distributionActionCreator
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};


const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onSwapCol: swapActionCreator,
  onCheck: checkActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable};
