import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import {createCommonTabPage} from '../../../standard-business/createTabPage';
import OrderPageContainer from './OrderPage/OrderPageContainer';
import EditPageContainer from './EditPage/EditPageContainer';
import helper, {fetchJson, getJsonResult, showError, initTableCols, postOption, deepCopy, convert} from '../../../common/common';
import {fetchDictionary, setDictionary} from '../../../common/dictionary';
import {search} from '../../../common/search';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {getStatus} from  "../../../common/commonGetStatus";

const STATE_PATH = ['receiveMake'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/bill/receiveMake/config';
const URL_LIST = '/api/bill/receiveMake/list';
const CUSTOM_CONFIG = '/api/bill/receiveMake/custom_config';
const URL_CURRENCY = '/api/bill/receiveMake/currency';


const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const computedCount = (tagArr, tag) => {
  const item = tagArr.find(o => o.tag == tag);
  return item ? item.count : 0;
};

const getNewTableData = async (params, payload, home=false) => {
  const {tabKey, tabs2, currentPage, pageSize, filter} = params;
  const itemFrom = (currentPage - 1) * pageSize;
  const itemTo = itemFrom + pageSize;
  const options = {incomeTag: home ? home : tabKey, ...filter};
  const list = getJsonResult(await search(URL_LIST, itemFrom, itemTo, options, false));
  const newTabs2 = deepCopy(tabs2).map(tab => {
    // 0:待明细整审,1:待整审,2:已整审
    // if (tab.key != '2') {
      const count = computedCount(list.tags, tab.key);
      tab.title = `${tab.title.split(' ')[0]} (${count})`;
    // }
    return tab;
  });
  return {
    ...payload,
    tabs2: newTabs2,
    tableItems: list.data,
    maxRecords: list.returnTotalItem
  }
};

const buildOrderPageState = async (config, other={}, home) => {
  const {tabKey, tabs2, btns} = config;
  const params = {
    tabKey,
    tabs2,
    currentPage: 1,
    pageSize: config.pageSize,
    filter: {}
  };
  const newState = {
    currentPage: 1,
    searchData: {},
    searchDataBak: {},
    isRefresh: true,
    buttons: btns.filter(o => o.showInTab.includes(tabKey)),
    tabKey: home ? home : tabKey
  };
  const payload = await getNewTableData(params, newState, home);
  return {
    ...config,
    ...other,
    ...payload
  }
};

const assignPrivilege = (payload) => {
  const actions = helper.getActions('receiveMake', true);
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

    const payload = await buildOrderPageState(index, {tabs, activeKey, editConfig, status: 'page'}, home);

    // 获取币种、状态，设置字典
    const currencyList = getJsonResult(await fetchJson(URL_CURRENCY, postOption({currencyTypeCode: '', maxNumber: 65536})));
    payload.editConfig.currencyList = currencyList;
    const dictionarys = getJsonResult(await fetchDictionary(names));
    dictionarys['status_type_01'] = getJsonResult(await getStatus("charge_detail_type"));
    dictionarys['currency'] = currencyList;
    setDictionary(payload.tableCols, dictionarys);
    setDictionary(payload.filters, dictionarys);
    setDictionary(payload.editConfig.receiveCols, dictionarys);
    setDictionary(payload.editConfig.payCols, dictionarys);
    setDictionary(payload.editConfig.receiveColsEdit, dictionarys);
    setDictionary(payload.editConfig.payColsEdit, dictionarys);

    // 初始化配置字段表格配置
    payload.tableCols = initTableCols('receiveMake', payload.tableCols);
    payload.editConfig.receiveCols = initTableCols('receiveMake_receiveCols', payload.editConfig.receiveCols);
    payload.editConfig.payCols = initTableCols('receiveMake_payCols', payload.editConfig.payCols);
    payload.editConfig.receiveColsEdit = initTableCols('receiveMake_receiveColsEdit', payload.editConfig.receiveColsEdit);

    assignPrivilege(payload);

    // 初始化搜索条件配置
    payload.filters = helper.initFilters('receive_make_sort', payload.filters);

    // 初始化按钮配置
    payload.btns = helper.setExportBtns('receive_make_export', payload.btns, payload.tableCols);

    dispatch(action.create(payload));
  } catch (e) {
    showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
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

const refreshForHomeActionCreator = (key) => async (dispatch, getState) => {
  const {searchData, currentPage, pageSize, tabs2} = getSelfState(getState());
  const params = {filter: convert(searchData), currentPage, pageSize, tabKey: key, tabs2};
  const payload = await getNewTableData(params, {searchDataBak: searchData, currentPage: 1, tabKey: key});
  dispatch(action.assign({...payload}));
};

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator,
  onTabClose: tabCloseActionCreator,
  onRefreshForHome: refreshForHomeActionCreator,
};

const Component = EnhanceLoading(createCommonTabPage(OrderPageContainer, EditPageContainer));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
export {getNewTableData};
