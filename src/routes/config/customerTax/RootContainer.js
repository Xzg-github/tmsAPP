import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildOrderPageState} from '../../../common/state';
import helper, {fetchJson, getJsonResult} from '../../../common/common';
import {search} from '../../../common/search';
import {fetchDictionary, setDictionary} from '../../../common/dictionary';
import {dealActions} from '../../../common/check';
import {dealExportButtons} from "../customerContact/RootContainer";

const STATE_PATH = ['customerTax'];
const URL_CONFIG = '/api/config/customer_tax/config';
const URL_LIST = '/api/config/customer_tax/list';
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const {index, edit, names} = getJsonResult(await fetchJson(URL_CONFIG));
    const list = getJsonResult(await search(URL_LIST, 0, index.pageSize, {}));
    const dictionary = getJsonResult(await fetchDictionary(names));
    const payload = buildOrderPageState(list, index, {editConfig: edit, status: 'page', isSort: true});
    setDictionary(payload.tableCols, dictionary);
    setDictionary(payload.filters, dictionary);
    setDictionary(payload.editConfig.controls, dictionary);
    //初始化列表配置
    payload.tableCols = helper.initTableCols(helper.getRouteKey(), payload.tableCols);
    payload.buttons = dealActions( payload.buttons, 'customerTax');
    payload.buttons = dealExportButtons(payload.buttons, payload.tableCols);
    dispatch(action.create(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const mapStateToProps = (state) => {
  return helper.getObject(getSelfState(state), ['status', 'edit']);
};

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(OrderPageContainer);
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
