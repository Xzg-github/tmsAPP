import { connect } from 'react-redux';
import {createCommonTabPage} from '../../../standard-business/createTabPage';
import { EnhanceLoading } from '../../../components/Enhance';
import { Action } from '../../../action-reducer/action';
import { getPathValue } from '../../../action-reducer/helper';
import { buildOrderPageState } from '../../../common/state';
import helper, {fetchJson, getJsonResult} from '../../../common/common';
import { search } from '../../../common/search';
import { fetchDictionary, setDictionary } from '../../../common/dictionary';
import { dealActions } from '../../../common/check';
import { getStatus } from "../../../common/commonGetStatus";
import OrderPageContainer from './OrderPage/OrderPageContainer';
import EditPageContainer from './EditPage/EditPageContainer';

const STATE_PATH = ['payBill'];
const URL_CONFIG = '/api/bill/payBill/config';
const URL_LIST = '/api/bill/payBill/list';

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const {index, dicNames, tabs, activeKey, editConfig, addConfig} = getJsonResult(await fetchJson(URL_CONFIG));
    const list = getJsonResult(await search(URL_LIST, 0, index.pageSize, {}, false));
    const dictionary = getJsonResult(await fetchDictionary(dicNames));
    const payload = buildOrderPageState(list, index, {tabs, activeKey, editConfig, addConfig, isSort: true, status: 'page'});

    //获取状态表单字典 AddDialog运单状态取表单字典transport_order
    dictionary['status_type'] = getJsonResult(await getStatus('pay_bill'));
    dictionary['status_type_addDialog'] = getJsonResult(await getStatus('transport_order'));
    setDictionary(payload.tableCols, dictionary);
    setDictionary(payload.filters, dictionary);
    setDictionary(payload.editConfig.tables[0].cols, dictionary);
    setDictionary(payload.addConfig.filters, dictionary);
    setDictionary(payload.addConfig.cols, dictionary);
    setDictionary(payload.editConfig.joinDialogTableCols, dictionary);

    payload.buttons = dealActions( payload.buttons, 'payBill');

    // 初始化搜索条件配置
    payload.filters = helper.initFilters('pay_bill_sort', payload.filters);

    // 初始化按钮配置
    payload.buttons = helper.setExportBtns('pay_bill_export', payload.buttons, payload.tableCols);

    dispatch(action.create(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const tabChangeActionCreator = (key) => action.assign({ activeKey: key});

const tabCloseActionCreator = (key) => (dispatch, getState) => {
  const { tabs } = getSelfState(getState());
  const newTabs = tabs.filter(tab => tab.key !== key);
  let index = tabs.findIndex(tab => tab.key === key);
  // 如果tab刚好是最后一个，则直接减一，
  (newTabs.length === index) && (index--);
  if (key !== 'index') {
    dispatch(action.assign({ tabs: newTabs, activeKey: newTabs[index].key, [key]: undefined }));
  }
};

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator,
  onTabClose: tabCloseActionCreator
};

const UIComponent = EnhanceLoading(createCommonTabPage(OrderPageContainer, EditPageContainer));
const Container = connect(mapStateToProps, actionCreators)(UIComponent);
export default Container;
