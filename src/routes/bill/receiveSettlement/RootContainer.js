import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import {createCommonTabPage} from '../../../standard-business/createTabPage';
import OrderPageContainer from './OrderPage/OrderPageContainer';
import EditPageContainer from './EditPage/EditPageContainer';
import helper, {fetchJson, getJsonResult, showError, initTableCols, setOptions, postOption, deepCopy} from '../../../common/common';
import {fetchDictionary, setDictionary} from '../../../common/dictionary';
import {search} from '../../../common/search';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {getStatus} from  "../../../common/commonGetStatus";

const STATE_PATH = ['receiveSettlement'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/bill/receiveSettlement/config';
const URL_LIST = '/api/bill/receiveSettlement/list';
const CUSTOM_CONFIG = '/api/bill/receiveSettlement/custom_config';
const URL_CURRENCY = '/api/bill/receiveSettlement/currency';


const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const getNewTableData = async (params, payload) => {
  const {tabKey, tabs2, currentPage, pageSize, filter} = params;
  const itemFrom = (currentPage - 1) * pageSize;
  const itemTo = itemFrom + pageSize;
  const options = {incomeTag: tabKey, ...filter};
  const list = getJsonResult(await search(URL_LIST, itemFrom, itemTo, options, false));
  const newTabs2 = deepCopy(tabs2).map(tab => {
    const item = list.tags.find(o => o.tag == tab.key);
    if (item) {
      tab.title = `${tab.title.split(' ')[0]} (${item.count})`;
    }
    return tab;
  });
  return {
    ...payload,
    tabs2: newTabs2,
    tableItems: list.data,
    maxRecords: list.returnTotalItem
  }
};

const buildOrderPageState = async (config, other={}) => {
  const searchData = other.home ? {queryGroup: 'todo'} : {};
  const {tabKey, tabs2} = config;
  const params = {
    tabKey,
    tabs2,
    currentPage: 1,
    pageSize: config.pageSize,
    filter: searchData
  };
  const newState = {
    currentPage: 1,
    searchData,
    searchDataBak: searchData,
    isRefresh: true
  };
  const payload = await getNewTableData(params, newState);
  return {
    ...config,
    ...newState,
    ...other,
    ...payload
  };
};

const assignPrivilege = (payload) => {
  const actions = helper.getActions('receiveSettlement', true);
  if (actions.length > 0) {
    payload.buttons = payload.buttons.filter(({key}) => actions.includes(key));
  }
};

const uniqueArrHanlder = (tableCols=[], customConfig=[]) => {
  const otherCols = customConfig.filter(o => !tableCols.map(k=>k.key).includes(o.key));
  const cols = tableCols.concat(otherCols);
  return cols.reduce((newCols, col) => {
    if(!newCols.map(o=>o.key).includes(col.key)){
      newCols.push(col);
    }
    return newCols
  }, []);
};

const initActionCreator = (home) => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const {activeKey, tabs, index, editConfig, names} = getJsonResult(await fetchJson(URL_CONFIG));
    // 添加备用字段
    const receive_customConfig = getJsonResult(await fetchJson(`${CUSTOM_CONFIG}/transport_order_income_property`));
    const pay_customConfig = getJsonResult(await fetchJson(`${CUSTOM_CONFIG}/transport_order_cost_property`));
    editConfig.receiveCols = uniqueArrHanlder(editConfig.receiveCols, receive_customConfig.controls);
    editConfig.payCols = uniqueArrHanlder(editConfig.payCols, pay_customConfig.controls);
    editConfig.receiveColsEdit = uniqueArrHanlder(editConfig.receiveColsEdit, receive_customConfig.controls);
    editConfig.payColsEdit = uniqueArrHanlder(editConfig.payColsEdit, pay_customConfig.controls);

    const payload = await buildOrderPageState(index, {home, tabs, activeKey, editConfig, status: 'page'});

    // 获取币种、状态，设置字典
    const currencyList = getJsonResult(await fetchJson(URL_CURRENCY, postOption({currencyTypeCode: '', maxNumber: 65536})));
    payload.editConfig.currencyList = currencyList;
    const dictionarys = getJsonResult(await fetchDictionary(names));
    dictionarys['status_type'] = getJsonResult(await getStatus("charge_detail_type"));
    dictionarys['currency'] = currencyList;
    setDictionary(payload.tableCols, dictionarys);
    setDictionary(payload.filters, dictionarys);
    setDictionary(payload.editConfig.receiveCols, dictionarys);
    setDictionary(payload.editConfig.payCols, dictionarys);
    setDictionary(payload.editConfig.receiveColsEdit, dictionarys);
    setDictionary(payload.editConfig.payColsEdit, dictionarys);

    // 初始化配置字段表格配置
    payload.tableCols = initTableCols('receiveSettlement', payload.tableCols);
    payload.editConfig.receiveCols = initTableCols('receiveSettlement_receiveCols', payload.editConfig.receiveCols);
    payload.editConfig.payCols = initTableCols('receiveSettlement_payCols', payload.editConfig.payCols);
    payload.editConfig.receiveColsEdit = initTableCols('receiveSettlement_receiveColsEdit', payload.editConfig.receiveColsEdit);

    assignPrivilege(payload);
    dispatch(action.create(payload));
  } catch (e) {
    showError(e.message);
    dispatch(action.assign({status: home ? 'retryForHome' : 'retry'}));
  }
};

const refreshForHomeActionCreator = () => async (dispatch, getState) => {
  const searchData = {queryGroup: 'todo', incomeTag: '0'};
  const {pageSize, tabKey, tabs2} = getSelfState(getState());
  const params = {
    tabKey,
    tabs2,
    currentPage: 1,
    pageSize,
    filter: convert(searchData)
  };
  const newState = {
    currentPage: 1,
    activeKey: 'index',
    searchData,
    searchDataBak: searchData,
    isRefresh: true
  };
  const payload = await getNewTableData(params, newState);
  dispatch(action.assign({...payload}));
};

const tabChangeActionCreator = (key) => action.assign({activeKey: key});

const tabCloseActionCreator = (key) => (dispatch, getState) => {
  const {activeKey, tabs} = getSelfState(getState());
  const newTabs = tabs.filter(tab => tab.key !== key);
  if (activeKey === key) {
    let index = tabs.findIndex(tab => tab.key === key);
    (newTabs.length === index) && (index--);
    dispatch(action.assign({tabs: newTabs, [activeKey]: undefined, activeKey: newTabs[index].key}));
  } else {
    dispatch(action.assign({tabs: newTabs, [key]: undefined}));
  }
};

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onInit: initActionCreator,
  onRefreshForHome: refreshForHomeActionCreator,
  onTabChange: tabChangeActionCreator,
  onTabClose: tabCloseActionCreator
};

const Component = EnhanceLoading(createCommonTabPage(OrderPageContainer, EditPageContainer));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
export {getNewTableData};
