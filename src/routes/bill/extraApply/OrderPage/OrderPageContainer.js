import { connect } from 'react-redux';
import OrderPage from '../../../../components/OrderPage';
import helper,{postOption, fetchJson, showError, showSuccessMsg, convert, getJsonResult, fuzzySearchEx, deepCopy} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {search2} from '../../../../common/search';

const STATE_PATH = ['extraApply'];
const action = new Action(STATE_PATH);
const URL_LIST = '/api/bill/extraApply/list';
const URL_DELETE = '/api/bill/extraApply/delete';

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

const afterEdit = async (dispatch, getState) => {
  const {searchData, currentPage, pageSize} = getSelfState(getState());
  await search2(dispatch, action, URL_LIST, currentPage, pageSize, convert(searchData), {}, undefined, false);
};

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

const showEditPage = (dispatch, getState, editType=0, itemData={}) => {
  // editType: 0:新增, 1:只读, 2:编辑, 3:审核, 4:结案
  const {tabs, editConfig} = getSelfState(getState());
  const key = editType === 0 ? 'add' : itemData['extraChargeNumber'];
  const title = editType === 0 ? '新增' : key;
  if (helper.isTabExist(tabs, key)) return dispatch(action.assign({activeKey: key}));
  const config = deepCopy(editConfig);
  config.footerButtons = config.footerButtons.filter(o => o.showInEditType.includes(editType));
  if (editType > 0) {
    // 单号设为只读
    config.controls[0].cols[0].type = 'readonly';
  }
  switch (itemData['statusType']) {
    // 待提交
    case 'status_submit_awaiting': {
      // 去掉应收表格
      config.tables = config.tables.filter(o => o.key === 'payChargeList');
      // 如果费用来源不为空，设置表格为只读
      if (itemData.chargeFrom) {
        config.tables = setReadonly(config.tables);
      }
      break;
    }
    // 应收待提交
    case 'status_receive_check_awaiting': {
      config.isShowAmount = true;
      config.tables[0].btns = config.payBtns;
      config.tables[0].cols = config.tables[0].cols.map(o => {
        if (o.key !== 'index' && o.key !== 'checked') {
          o.type = 'readonly';
        }
        return o;
      });
      config.tables[1].btns = config.receiveBtns;
      config.footerButtons = config.footerButtons.filter(o => o.key !== 'save');
      // 如果费用来源不为空，设置表格为只读
      if (itemData['chargeFrom']) {
        config.tables = setReadonly(config.tables);
      }
      break;
    }
    // 应付待审核
    case 'status_pay_check_awaiting': {
      config.isShowAmount = true;
      // 去掉应收表格
      config.tables = config.tables.filter(o => o.key === 'payChargeList');
      // 去掉回退按钮
      config.footerButtons = config.footerButtons.filter(btn => btn.key !== 'fallback');
      break;
    }
    // 待审批
    case 'status_checked_awaiting': {
      config.isShowAmount = true;
      config.isShowAudit = true;
      config.controls = setReadonly(config.controls);
      config.tables = setReadonly(config.tables);
      break;
    }
    // 待结案
    case 'status_settle_lawsuit_awaiting': {
      config.isShowEndCase = true;
      config.controls = setReadonly(config.controls);
      config.tables = setReadonly(config.tables);
      break;
    }
    // 已结案
    case 'status_settle_lawsuit_completed': {
      config.isShowEndCase = true;
      config.controls = setReadonly(config.controls);
      config.tables = setReadonly(config.tables);
      break;
    }
    // 新增
    default: {
      config.tables = config.tables.filter(o => o.key === 'payChargeList');
    }
  }
  // 只读
  if (editType === 1) {
    config.controls = setReadonly(config.controls);
    config.tables = setReadonly(config.tables);
    config.fallbackInfo = config.fallbackInfo.map(o => {
      o.type = 'readonly';
      return o;
    });
    config.resultForm.cols = config.resultForm.cols.map(o => {
      o.type = 'readonly';
      return o;
    });
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
  switch (type) {
    case 0: {
      if (item.statusType !== 'status_submit_awaiting' && item.statusType !== 'status_receive_check_awaiting') {
        showError('只有待提交或应收待提交状态下才能编辑！');
        return false;
      }
      break;
    }
    case 1: {
      if (item.statusType !== 'status_checked_awaiting' && item.statusType !== 'status_pay_check_awaiting') {
        showError('只有待审批或应付待审批状态下才能审核！');
        return false;
      }
      break;
    }
    case 2: {
      if (item.statusType !== 'status_settle_lawsuit_awaiting') {
        showError('只有待结案状态下才能结案！');
        return false;
      }
      break;
    }
  }
  return true;
};

const editActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const item = checkOnly(tableItems);
  item && isCanEdit(item, 0) && showEditPage(dispatch, getState, 2, item);
};

// 双击编辑
const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const item = tableItems[index];
  isCanEdit(item, 0) && showEditPage(dispatch, getState, 2, item);
};

// 查看
const linkActionCreator = (key, rowIndex, item) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  showEditPage(dispatch, getState, 1, tableItems[rowIndex]);
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

// 删除
const deleteActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkList = tableItems.filter(o=> o.checked);
  if(!checkList.length) return showError('请勾选一条数据！');
  const ids = checkList.map(o => o.id);
  const {returnCode, result, returnMsg} = await helper.fetchJson(URL_DELETE, postOption(ids));
  if (returnCode !== 0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  afterEdit(dispatch, getState);
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchActionCreator,
  add: addActionCreator,
  edit: editActionCreator,
  audit: auditActionCreator,
  endACase: endACaseActionCreator,
  delete: deleteActionCreator
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
export {afterEdit, setReadonly};
