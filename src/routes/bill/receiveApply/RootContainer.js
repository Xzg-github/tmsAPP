import { connect } from 'react-redux';
import {createCommonTabPage} from '../../../standard-business/createTabPage';
import { EnhanceLoading } from '../../../components/Enhance';
import { Action } from '../../../action-reducer/action';
import { getPathValue } from '../../../action-reducer/helper';
import { buildOrderPageState } from '../../../common/state';
import helper, {fetchJson, getJsonResult, deepCopy} from '../../../common/common';
import { search } from '../../../common/search';
import { fetchDictionary, setDictionary } from '../../../common/dictionary';
import { dealActions } from '../../../common/check';
import { getStatus } from "../../../common/commonGetStatus";
import OrderPageContainer from './OrderPage/OrderPageContainer';
import EditPageContainer from './EditPage/EditPageContainer';

const STATE_PATH = ['receiveApply'];
const URL_CONFIG = '/api/bill/receiveApply/config';
const URL_LIST = '/api/bill/receiveApply/list';

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const {index, names, tabs, activeKey, editConfig, addDialogConfig} = getJsonResult(await fetchJson(URL_CONFIG));
    const list = getJsonResult(await search(URL_LIST, 0, index.pageSize, {}, false));
    const dictionary = getJsonResult(await fetchDictionary(names));
    const payload = buildOrderPageState(list, index, {tabs, activeKey, editConfig, addDialogConfig, isSort: true, status: 'page'});

    // 获取状态表单字典
    const dics = deepCopy(dictionary);
    dictionary['status_type'] = getJsonResult(await getStatus('receivable_invoice'));
    dics['status_type'] = getJsonResult(await getStatus('transport_order'));
    setDictionary(payload.addDialogConfig.cols, dics);
    setDictionary(payload.tableCols, dictionary);
    setDictionary(payload.filters, dictionary);
    setDictionary(payload.editConfig.controls[0].cols, dictionary);
    setDictionary(payload.editConfig.controls[1].cols, dictionary);
    setDictionary(payload.editConfig.invoiceInfoConfig.cols, dictionary);
    setDictionary(payload.editConfig.costInfoConfig.cols, dictionary);
    setDictionary(payload.editConfig.costInfoConfig.joinDialogConfig.cols, dictionary);

    payload.buttons = dealActions( payload.buttons, 'receiveApply');
    dispatch(action.create(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const tabChangeActionCreator = (key) => action.assign({ activeKey: key});

const tabCloseActionCreator = (key) => (dispatch, getState) => {
  const { tabs } = getSelfState(getState(), STATE_PATH);
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
