import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import {createCommonTabPage} from '../../../standard-business/createTabPage';
import OrderPageContainer from './OrderPage/OrderPageContainer';
import EditPageContainer from './EditPage/EditPageContainer';
import helper, {fetchJson, getJsonResult, showError, postOption, deepCopy} from '../../../common/common';
import {dealActions} from '../../../common/check';
import {fetchDictionary, setDictionary} from '../../../common/dictionary';
import {search} from '../../../common/search';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {getStatus} from  "../../../common/commonGetStatus";

const STATE_PATH = ['extraApply'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/bill/extraApply/config';
const URL_LIST = '/api/bill/extraApply/list';
const CUSTOM_CONFIG = '/api/bill/extraApply/custom_config';
const URL_CURRENCY = '/api/bill/extraApply/currency';


const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildOrderPageState = async (config, other={}) => {
  const {pageSize} = config;
  const list = getJsonResult(await search(URL_LIST, 0, pageSize, {}, false));
  return {
    ...config,
    ...other,
    currentPage: 1,
    searchData: {},
    tableItems: list.data,
    maxRecords: list.returnTotalItem
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

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const {activeKey, tabs, index, editConfig, names} = getJsonResult(await fetchJson(URL_CONFIG));
    // 添加备用字段
    const pay_customConfig = getJsonResult(await fetchJson(`${CUSTOM_CONFIG}/transport_order_cost_property`));
    editConfig.tables[0].cols = uniqueArrHanlder(editConfig.tables[0].cols, pay_customConfig.controls);

    const payload = await buildOrderPageState(index, {tabs, activeKey, editConfig, isSort: true});

    // 获取币种、状态，设置字典
    const dictionarys = getJsonResult(await fetchDictionary(names));
    const dics = deepCopy(dictionarys);
    dics['status_type'] = getJsonResult(await getStatus("extra_charge"));
    setDictionary(payload.filters, dics);
    dictionarys['status_type'] = getJsonResult(await getStatus("extra_charge"));
    dictionarys['currency'] = getJsonResult(await fetchJson(URL_CURRENCY, postOption({currencyTypeCode: '', maxNumber: 65536})));
    setDictionary(payload.tableCols, dictionarys);
    setDictionary(payload.editConfig.controls[0].cols, dictionarys);
    setDictionary(payload.editConfig.tables[0].cols, dictionarys);
    setDictionary(payload.editConfig.tables[1].cols, dictionarys);
    setDictionary(payload.editConfig.resultForm.cols, dictionarys);

    payload.buttons = dealActions(payload.buttons, 'extraApply');
    dispatch(action.create({...payload, status: 'page'}));
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

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator,
  onTabClose: tabCloseActionCreator
};

const Component = EnhanceLoading(createCommonTabPage(OrderPageContainer, EditPageContainer));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
