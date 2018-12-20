import { connect } from 'react-redux';
import OrderPage from '../../../../components/OrderPage';
import helper,{postOption, fetchJson, showError, showSuccessMsg, convert, getJsonResult, fuzzySearchEx, deepCopy} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {search2} from '../../../../common/search';
import {showOutputDialog} from '../../../../components/ModeOutput/ModeOutput';

const STATE_PATH = ['extraApply'];
const action = new Action(STATE_PATH);
const URL_LIST = '/api/bill/extraApply/list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const formSearchActionCreator = (key, filter, control) => async (dispatch,getState) => {
  const {filters} = getSelfState(getState());
  const result = getJsonResult(await fuzzySearchEx(filter, control));
  const options = result.data ? result.data : result;
  const index = filters.findIndex(item => item.key === key);
  dispatch(action.update({options}, 'filters', index));
};

const changeActionCreator = (key, value) => async (dispatch, getState) =>  {
   dispatch(action.assign({[key]: value}, 'searchData'));
};

const searchActionCreator = async (dispatch, getState) => {
  const {searchData, currentPage, pageSize} = getSelfState(getState());
  await search2(dispatch, action, URL_LIST, currentPage, pageSize, convert(searchData), {currentPage: 1}, undefined, false);
};

const resetActionCreator = action.assign({searchData: {}});

const setReadonly = (arr=[]) => {
  return arr.map(o => {
    o.btns = [];
    o.cols = o.cols.filter(o => o.key !== 'checked').map(o => {
      if (o.key !== 'index') {
        o.type = 'readonly';
      }
      return o;
    });
    return o;
  });
};

// 弹出编辑页面
const showEditPage = (dispatch, getState, editType=0, itemData={}) => {
  const {tabs, editConfig} = getSelfState(getState());
  const key = editType === 0 ? 'add' : itemData['extraChargeNumber'];
  const title = editType === 0 ? '新增' : key;
  if (helper.isTabExist(tabs, key)) return dispatch(action.assign({activeKey: key}));
  const config = deepCopy(editConfig);
  config.footerButtons = config.footerButtons.filter(o => o.showInEditType.includes(editType));
  // editType: 0:新增, 1:编辑, 2:只读(onLink), 3:审核, 4:结案
  switch (editType) {
    case 0: {
      delete config.tables[1];
      break;
    }
    case 1: {
      config.controls[0].cols[0].type = 'readonly';
      // 参照epld，如果不是应收待提交状态的编辑页面，去掉应收表格信息
      // if (itemData.statusType !== 'status_receive_check_awaiting') {
      //   delete config.tables[1];
      // }
      // 如果费用来源不为空，设置表格为只读
      if (itemData.chargeFrom) {
        config.tables = setReadonly(config.tables);
      }
      break;
    }
    case 2: {
      config.controls = setReadonly(config.controls);
      config.tables = setReadonly(config.tables);
      break;
    }
    case 3: {
      config.controls = setReadonly(config.controls);
      config.tables = setReadonly(config.tables);
      break;
    }
    case 4: {
      config.controls = setReadonly(config.controls);
      config.tables = setReadonly(config.tables);
      break;
    }
  }
  dispatch(action.add({key, title}, 'tabs'));
  dispatch(action.assign({[key]: {editType, config, itemData}, activeKey: key}));
};

const addActionCreator = async (dispatch, getState) => {
  showEditPage(dispatch, getState, 0);
};

const checkOnly = (items) => {
  const index = helper.findOnlyCheckedIndex(items);
  if(index === -1) {
    showError('请勾选一条数据！');
    return false;
  }
  return items[index];
};

const isCanEdit = (item, type=0) => {
  // type: 0:编辑, 1:审核, 2:结案
  // switch (type) {
  //   case 0: {
  //     if (item.statusType !== 'status_submit_awaiting') {
  //       showError('只有待提交状态下才能编辑！');
  //       return false;
  //     }
  //     break;
  //   }
  //   case 1: {
  //     if (item.statusType !== 'status_receive_check_awaiting' || item.statusType !== 'status_pay_check_awaiting') {
  //       showError('只有应收待提交或应付待审核状态下才能审核！');
  //       return false;
  //     }
  //     break;
  //   }
  //   case 2: {
  //     if (item.statusType !== 'status_settle_lawsuit_awaiting') {
  //       showError('只有待结案状态下才能结案！');
  //       return false;
  //     }
  //     break;
  //   }
  // }
  return true;
};

const editActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const item = checkOnly(tableItems);
  item && isCanEdit(item, 0) && showEditPage(dispatch, getState, 1, item);
};

// 双击编辑
const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const item = tableItems[index];
  isCanEdit(item, 0) && showEditPage(dispatch, getState, 1, item);
};

// 查看
const linkActionCreator = (key, rowIndex, item) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  showEditPage(dispatch, getState, 2, tableItems[rowIndex]);
};

// 审核
const auditActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const item = checkOnly(tableItems);
  item && isCanEdit(item, 1) && showEditPage(dispatch, getState, 3, item);
};

// 结案
const endACaseActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const item = checkOnly(tableItems);
  item && isCanEdit(item, 2) && showEditPage(dispatch, getState, 4, item);
};

// 输出
const outputActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkList = tableItems.filter(o=> o.checked);
  if(!checkList.length) return showError('请勾选一条数据！');
  showOutputDialog(checkList, 'receivable_month_bill');
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchActionCreator,
  add: addActionCreator,
  edit: editActionCreator,
  audit: auditActionCreator,
  endACase: endACaseActionCreator,
  output: outputActionCreator
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else if(key.includes('createBill')) {
    return createBillActionCreator(key);
  } else {
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const pageNumberActionCreator = (currentPage) => async (dispatch, getState) => {
  const {searchData, pageSize} = getSelfState(getState());
  await search2(dispatch, action, URL_LIST, currentPage, pageSize, convert(searchData), {currentPage}, undefined, false);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  await search2(dispatch, action, URL_LIST, currentPage, pageSize, convert(searchData), {pageSize, currentPage}, undefined, false);
};

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onSearch: formSearchActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onLink: linkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
