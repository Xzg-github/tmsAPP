import {connect} from 'react-redux';
import {Action} from "../../../action-reducer/action";
import helper, {fetchJson, getJsonResult, postOption, showError} from "../../../common/common";
import {EnhanceLoading} from '../../../components/Enhance';
import {fetchDictionary, getDictionaryNames, setDictionary} from "../../../common/dictionary";
import {search, search2} from "../../../common/search";
import {getPathValue} from '../../../action-reducer/helper';
import {toFormValue} from "../../../common/check";
import {commonExport, exportExcelFunc} from "../../../common/exportExcelSetting";
import interfaceLog from './interfaceLog';

const STATE_PATH = ['interfaceLog'];
const action = new Action(STATE_PATH);

const URL_CONFIG = '/api/track/interface_log/config';
const URL_LIST = '/api/track/interface_log/pushLogList';
const URL_RLIST = '/api/track/interface_log/receivingLogList';
const URL_REDOCK = '/api/track/interface_log/redock';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch, getState) => {
  try{
    dispatch(action.assign({status: 'loading'}));
    const {pushLogConfig, receivingConfig, tabs, activeKey} = getJsonResult(await fetchJson(URL_CONFIG));
    //初始化获取接收日志List
    const list = getJsonResult(await search(URL_LIST, 0, pushLogConfig.pageSize, {}));
    const dicNames = getDictionaryNames(receivingConfig.filters, pushLogConfig.filters);
    const dictionary = getJsonResult(await fetchDictionary(dicNames));
    const payload = {
      tabs, activeKey,  status: 'page',
      pushLog: {
        ...pushLogConfig,
        maxRecords: list.returnTotalItem,
        currentPage: 1,
        tableItems: list.data,
        searchData: {}
        },
      receivingLog: {...receivingConfig}
    };
    setDictionary(payload.pushLog.filters, dictionary);
    setDictionary(payload.pushLog.tableCols, dictionary);
    setDictionary(payload.receivingLog.filters, dictionary);
    setDictionary(payload.receivingLog.tableCols, dictionary);

    dispatch(action.create(payload));
  } catch (e) {
    showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const resetActionCreator = async (dispatch,getState) => {
  const {activeKey} = getSelfState(getState());
  dispatch(action.assign({searchData: {}},[activeKey]));
};

const searchActionCreator = async (dispatch, getState) => {
  const {pushLog, receivingLog, activeKey} = getSelfState(getState());
  const url = activeKey === 'pushLog' ? URL_LIST : URL_RLIST;
  const config = activeKey === 'pushLog' ? pushLog : receivingLog;
  const newState = {searchDataBak: config.searchData, currentPage: 1};
  return search2(dispatch, action, url, 1, config.pageSize, config.searchData, newState, [activeKey]);
};

const redockActionCreator = async (dispatch, getState) => {
  const {pushLog, activeKey} =  getSelfState(getState());
  const idList = pushLog.tableItems.reduce((result, item) => {
    item.checked && result.push(item.id);
    return result
  },[]);
  if (!idList.length) return showError('请勾选记录!');
  const {returnMsg, returnCode} = await fetchJson(URL_REDOCK, postOption(idList));
  const searchDataBak = pushLog.searchDataBak || {};
  return returnCode === 0 ?
    search2(dispatch, action, URL_LIST, pushLog.currentPage, pushLog.pageSize, toFormValue(searchDataBak),{}, [activeKey])
    : showError(returnMsg);
};

// 查询导出
const exportSearchActionCreator = (dispatch, getState) => {
  const {pushLog, receivingLog, activeKey} = getSelfState(getState());
  const config = activeKey === 'pushLog' ? pushLog : receivingLog;
  const pushAddress = '/mq-service/push_interface_log/list/search';
  const receiveAddress =  '/mq-service/receive_interface_log/list/search';
  const address = activeKey === 'pushLog' ? pushAddress : receiveAddress;
  return commonExport(config.tableCols, address, config.searchData);
};

// 页面导出
const exportPageActionCreator = async (dispatch, getState) => {
  const {pushLog, receivingLog, activeKey} = getSelfState(getState());
  const config = activeKey === 'pushLog' ? pushLog : receivingLog;
  return exportExcelFunc(config.tableCols, config.tableItems);
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchActionCreator,
  exportSearch: exportSearchActionCreator,
  exportPage: exportPageActionCreator,
  redock: redockActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)){
    return toolbarActions[key];
  } else {
    console.log('unknow key:', key);
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => async (dispatch, getState) =>  {
  isAll && (rowIndex = -1);
  const {activeKey} = getSelfState(getState());
  dispatch(action.update({checked}, [activeKey,'tableItems'], rowIndex));
};

const changeActionCreator = (key, value) => async (dispatch, getState) => {
  const {activeKey} = getSelfState(getState());
  dispatch(action.assign({[key]: value}, [activeKey, 'searchData']));
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pushLog, receivingLog, activeKey} = getSelfState(getState());
  const url = activeKey === 'pushLog' ? URL_LIST : URL_RLIST;
  const config = activeKey === 'pushLog' ? pushLog : receivingLog;
  const newState = {currentPage};
  return search2(dispatch, action, url, currentPage, config.pageSize, config.searchDataBak, newState, [activeKey]);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {pushLog, receivingLog, activeKey} = getSelfState(getState());
  const url = activeKey === 'pushLog' ? URL_LIST : URL_RLIST;
  const config = activeKey === 'pushLog' ? pushLog : receivingLog;
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, url, currentPage, pageSize, config.searchDataBak, newState, [activeKey]);
};

const tabChangeActionCreator = (key) => async (dispatch, getState) => {
  const {pushLog, receivingLog} = getSelfState(getState());
  const url = key === 'pushLog' ? URL_LIST : URL_RLIST;
  const config = key === 'pushLog' ? pushLog : receivingLog;
  const list = getJsonResult(await search(url, 0, config.pageSize, {}));
  dispatch(action.assign({
    maxRecords: list.returnTotalItem,
    currentPage: 1,
    tableItems: list.data,
    searchData: {}}, [key]));
  dispatch(action.assign({activeKey: key}));
};

const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator,
  onChange: changeActionCreator,
  onClick: clickActionCreator,
  onCheck: checkActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const Component = EnhanceLoading(interfaceLog);
export default connect(mapStateToProps, actionCreators)(Component);;




