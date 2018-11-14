import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import helper,{getObject, fetchJson, showError} from '../../../common/common';
import {toFormValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildEditPageState} from '../../platform/currencyFile/common/state';
import {search} from '../../../common/search';
import {toTableItems} from '../../../common/orderAdapter';

const URL_LIST = '/api/basic/defaultOutput/list';
const URL_TABLE_ITEMS = '/api/basic/defaultOutput/tableItems';
const STATE_PATH = ['basic', 'defaultOutput'];
const action = new Action(STATE_PATH);
const URL_REPORT = '/api/config/dataset/reportType';//模板类型下拉
const URL_REPORT_NAME = '/api/basic/commonOutput/reportName';//模板名称下拉

const mosaic = (listItem) => {
  let emialModeArr  = [],smsModeArr  = [],iphoneArr  = [],emailArr  = [],arrMessage;

  const listSms = listItem.notify_type_sms;
  const listEmail = listItem.notify_type_email;

  if(listSms&&listSms.length>0){
    listSms.forEach (item => {
      smsModeArr.push(item.reportConfig ? item.reportConfig.title : '');
      item.recivers.forEach( reciver => {
        reciver.phoneNumber && iphoneArr.push(reciver.phoneNumber)
      })
    });
  }

  if(listEmail&&listEmail.length>0){
    listEmail.forEach (item => {
      emialModeArr.push(item.reportConfig ? item.reportConfig.title : '');
      item.recivers.forEach( reciver => {
        reciver.recipientMail && emailArr.push(reciver.recipientMail)
      })
    });

  }

  arrMessage = {
    emialMode : emialModeArr.join(','),
    smsMode : smsModeArr.join(','),
    iphone : iphoneArr.join(','),
    email : emailArr.join(',')
  };
  return arrMessage
};

//处理list
const processingData = (list) => {
  let emialMode,smsMode,iphone,email,listResult;

  listResult = [];

  list.result.data.forEach(item => {
    let arrMessage = mosaic(item.notifyInfoMap)
    item = {...item,...arrMessage}
    listResult.push(item)
  });
  return listResult
};

const search2 = async (dispatch, action, url, currentPage, pageSize, filter, newState={}, path=undefined) => {
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;
  const list = await search(url, from, to, filter);
  list.result.data = processingData(list);
  if (list.returnCode === 0) {
    const payload = {
      ...newState,
      tableItems: toTableItems(list.result),
      maxRecords: list.result.returnTotalItem
    };
    dispatch(action.assign(payload, path));
  } else {
    showError(returnMsg);
  }
};



const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak));
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'searchData');
};

// 双击进入编辑
const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {

};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

// 清空搜索框
const resetAction = (dispatch, getState) => {
  dispatch(action.assign({searchData:{}}));
};

// 搜索
const searchAction = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState);
};

// 弹出新增对话框
const addAction  = (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  editConfig.tableCols.map(item => item.key == 'reportConfigId' ? item.options = [] : null);
  editConfig.tableItems = [];
  editConfig.controls[1].options = [];
  const payload = buildEditPageState(editConfig, {},false);

  payload.isShow = true;

  dispatch(action.assign(payload, 'edit'));
};

const editAction = async (dispatch, getState) => {
  const {editConfig, tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    let checkedId = tableItems[index].id;
    const res = await fetchJson(`${URL_TABLE_ITEMS}/${checkedId}`,'get');
    if (res.returnCode !== 0) {
      return;
    }


    res.result.id = checkedId;
    if(res.result.customer){
      res.result.customerId =  res.result.customer
    }
    if(res.result.supplier){
      res.result.supplierId =  res.result.supplier
    }
    if(res.result.institution){
      res.result.institutionId = res.result.institution
    }
    if(res.result.reportTypeConfig){
      res.result.reportTypeConfigId = res.result.reportTypeConfig
    }
    if( res.result.notifyInfos.reportConfig ){
      res.result.notifyInfos.reportConfigId = res.result.notifyInfos.reportConfig
    }

    res.result.notifyInfos.forEach(item => {
      if(item.reportConfig){
        item.reportConfigId = item.reportConfig
      }
      if(item.recivers){
        item.recivers = JSON.stringify(item.recivers)
      }
    });


    editConfig.tableItems  = res.result.notifyInfos;


    let data = await fetchJson(`${URL_REPORT_NAME}/${res.result.reportTypeConfig.value}`,'get');
    if (data.returnCode != 0) {
      return;
    }
    let options = data.result;
    editConfig.tableCols.map(item => item.key == 'reportConfigId' ? item.options = options : null);



    const payload = buildEditPageState(editConfig, res.result, true);
    payload.isShow = true
    dispatch(action.assign(payload, 'edit'));
  }else {
    const msg = '请勾选一个';
    showError(msg);
  }
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
  options = data.result ;
  const index = filters.findIndex(item => item.key == key);
  dispatch(action.update({options}, 'filters', index));
};

const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    showError('请勾选一条记录进行删除');
    return;
  }

  let checkedId = tableItems[index].id;
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

// 编辑完成后的动作
const afterEditActionCreator = (item, edit) => (dispatch) => {
  dispatch(action.assign({edit: undefined}));
};


const toolbarActions = {
  reset: resetAction,
  search: searchAction,
  add: addAction,
  edit: editAction,
  del:delAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState);
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
  onDoubleClick: doubleClickActionCreator,
  //onLink: linkActionCreator
  onSearch: formSearchActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {afterEditActionCreator};
export {updateTable};



