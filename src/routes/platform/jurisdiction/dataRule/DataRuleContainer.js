import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EditDialogContainer from './EditDialogContainer';
import {EnhanceLoading, EnhanceEditDialog} from '../../../../components/Enhance';
import {Action} from '../../../../action-reducer/action';
import {buildOrderPageState} from '../../../../common/state';
import helper, {fetchJson, getJsonResult} from '../../../../common/common';
import {getPathValue} from '../../../../action-reducer/helper';
import {fetchDictionary, setDictionary} from '../../../../common/dictionary';

const STATE_PATH = ['platform', 'jurisdiction', 'dataRule'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/platform/jurisdiction/dataRule/config';
const URL_LIST = '/api/platform/jurisdiction/dataRule/list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const {index, edit, names} = getJsonResult(await fetchJson(URL_CONFIG));
    const dictionary = helper.getJsonResult(await fetchDictionary(names));
    const result = getJsonResult(await fetchJson(URL_LIST));
    const list = {
      result: {
        data: result,
        returnTotalItem: result.length
      }
    };
    const payload = buildOrderPageState(list.result, index, {editConfig: edit, status: 'page'});
    setDictionary(payload.filters, dictionary);
    setDictionary(payload.tableCols, dictionary);
    setDictionary(payload.editConfig.controls, dictionary);
    dispatch(action.create(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(EnhanceEditDialog(OrderPageContainer, EditDialogContainer));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
