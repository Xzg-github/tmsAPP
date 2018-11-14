import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EditDialogContainer from './EditDialogContainer';
import {EnhanceLoading, EnhanceEditDialog} from '../../../components/Enhance';
import {getObject, fetchJson, getActions,  showError} from '../../../common/common';
import {buildOrderPageState} from '../../platform/currencyFile/common/state';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {fetchDictionary2, setDictionary,fetchDictionary} from '../../../common/dictionary';

const STATE_PATH = ['basic', 'fromOddDefine'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/basic/fromOddDefine/config';
const URL_LIST = '/api/basic/fromOddDefine/list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

// 提取表单类型字典valeu: table_ 之后的值组成新数组
const newNumberType = (array) => {
  const numberType = array.reduce((result, items) => {
    const newValue = items.value.match(/table_(\S*)/)[1];
    result.push({title: items.title, value: newValue});
    return result;
  }, []);
  return numberType
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const {result, returnCode, returnMsg} = await fetchJson(URL_CONFIG);
  if (returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    showError(returnMsg);
    return;
  }
  const {index, edit, batchEdit} = result;
  const list = await fetchJson(URL_LIST);
  if (list.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    showError(list.returnMsg);
    return;
  }
  const dictionary = await fetchDictionary2(edit.controls);
  let op = await fetchDictionary(['business_order_type']);
  const array = dictionary.result.table_number_type;
  dictionary.result.table_number_type = newNumberType(array);
  dictionary.result.table_number_type.push(...op.result.business_order_type);
  setDictionary(index.filters, dictionary.result);
  setDictionary(index.tableCols, dictionary.result);
  setDictionary(edit.controls, dictionary.result);

  const payload = buildOrderPageState(list.result, index, {editConfig: edit, batchEdit, status: 'page'});
  const newAction = getActions('fromOddDefine', true);
  payload.buttons = payload.buttons.filter(items => newAction.indexOf(items.key) !== -1);
  dispatch(action.create(payload));
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), ['status', 'edit']);
};

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(EnhanceEditDialog(OrderPageContainer, EditDialogContainer));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
