import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EditDialogContainer from './EditDialogContainer';
import { EnhanceLoading, EnhanceEditDialog } from '../../../components/Enhance';
import { Action } from '../../../action-reducer/action';
import { getPathValue } from '../../../action-reducer/helper';
import { buildOrderPageState } from '../../../common/state';
import helper, { fetchJson, getJsonResult, postOption } from '../../../common/common';
import { search } from '../../../common/search';
import { fetchDictionary, setDictionary } from '../../../common/dictionary';
import { dealActions } from '../../../common/check';

const STATE_PATH = ['config', 'suppliersArchives'];
const URL_CONFIG = '/api/config/suppliersArchives/config';
const CUSTOM_CONFIG = '/api/config/customersArchives/custom_config';
const URL_LIST = '/api/config/suppliersArchives/list';
const URL_BUYERS = '/api/config/suppliersArchives/buyers';
const URL_DISTRICT = '/api/config/suppliersArchives/district_options';

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
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
    const {index, edit, names, finance} = getJsonResult(await fetchJson(URL_CONFIG));
    const customConfig = getJsonResult(await fetchJson(`${CUSTOM_CONFIG}/supplier_property`));
    index.tableCols = uniqueArrHanlder(index.tableCols, customConfig.controls);
    const list = getJsonResult(await search(URL_LIST, 0, index.pageSize, {}));
    const dictionary = getJsonResult(await fetchDictionary(names));
    const buyers = getJsonResult(await fetchJson(URL_BUYERS, postOption({maxNumber: 20, filter: ''})));
    const country = getJsonResult(await fetchJson(URL_DISTRICT, postOption({maxNumber: 300, districtType: 2})));
    const payload = buildOrderPageState(list, index, {editConfig: edit, customConfig, finance, status: 'page', isSort: true});
    helper.setOptions('country', payload.tableCols, country);
    helper.setOptions('country', payload.editConfig.controls[0].data, country);
    helper.setOptions('purchasePersonId', payload.tableCols, buyers.data);
    setDictionary(payload.tableCols, dictionary);
    setDictionary(payload.filters, dictionary);
    setDictionary(payload.editConfig.controls[0].data, dictionary);
    setDictionary(payload.editConfig.controls[1].data, dictionary);
    payload.buttons = dealActions( payload.buttons, 'suppliersArchives');
    dispatch(action.create(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(EnhanceEditDialog(OrderPageContainer, EditDialogContainer));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
