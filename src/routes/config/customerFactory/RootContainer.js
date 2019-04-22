import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EditDialogContainer from './EditDialogContainer';
import {EnhanceLoading, EnhanceEditDialog} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildOrderPageState} from '../../../common/state';
import helper, {fetchJson, getJsonResult, postOption, showError} from '../../../common/common';
import {search} from '../../../common/search';
import {fetchDictionary, setDictionary} from '../../../common/dictionary';
import {dealActions} from '../../../common/check';
import {dealExportButtons} from "../customerContact/RootContainer";

const STATE_PATH = ['config','customerFactory'];
const action = new Action(STATE_PATH);

const URL_CONFIG = '/api/config/customer_factory/config';
const URL_CUSTOMERCONFIG = '/api/config/customer_factory/cutomer_config';
const URL_LIST = '/api/config/customer_factory/list';
const URL_DISTRICT_OPTIONS = '/api/config/customer_factory/district_options';


const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

//合并自定义配置并去重
const uniqueArrHandler = (tableCols = [], customerConfig = []) => {
  const tableItemsKey = tableCols.map(item => item.key);
  const otherCols = customerConfig.filter(customerConfigItem => !tableItemsKey.includes(customerConfigItem.key));
  const validCols = tableCols.concat(otherCols);
  return validCols.reduce((newCols, col) => {
    if (!newCols.map(i => i.key).includes(col.key)) {
      newCols.push(col);
    }
    return newCols;
  }, []);
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const {index, edit, names} = getJsonResult(await fetchJson(URL_CONFIG));
    const customerConfig = getJsonResult(await fetchJson(`${URL_CUSTOMERCONFIG}/consignee_consignor_property`));
    index.tableCols = uniqueArrHandler(index.tableCols, customerConfig.controls);
    edit.controls = uniqueArrHandler(edit.controls, customerConfig.controls);
    const list = getJsonResult(await search(URL_LIST, 0, index.pageSize, {}));
    const dictionary = getJsonResult(await fetchDictionary(names));
    const body ={ maxNumber: 300, districtType: 2};
    const country = getJsonResult(await fetchJson(URL_DISTRICT_OPTIONS, postOption(body)));
    const payload = buildOrderPageState(list, index, {editConfig: edit, customerConfig, status: 'page', isSort: true});
    helper.setOptions('country', payload.editConfig.controls, country);
    setDictionary(payload.tableCols, dictionary);
    setDictionary(payload.filters, dictionary);
    setDictionary(payload.editConfig.controls, dictionary);
    //初始化列表配置
    payload.tableCols = helper.initTableCols(helper.getRouteKey(), payload.tableCols);
    payload.buttons = dealActions( payload.buttons, 'customerFactory');
    payload.buttons = dealExportButtons(payload.buttons, payload.tableCols);

    dispatch(action.create(payload));
  } catch (e) {
    showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const mapStateToProps = (state) => {
  return helper.getObject(getSelfState(state), ['status', 'edit']);
};

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(EnhanceEditDialog(OrderPageContainer, EditDialogContainer));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
