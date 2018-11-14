import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EditPageContainer from './EditPageContainer';
import {EnhanceLoading, EnhanceDialogs} from '../../../components/Enhance';
import {getObject, fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search} from '../../../common/search';
import {buildOrderPageState} from '../../../common/state';
import {setDictionary,fetchDictionary} from '../../../common/dictionary';
import {dealActions} from '../../../common/check';
import ConfirmDialogContainer from './ConfirmDialogContainer';

const STATE_PATH = ['platform', 'excelOutputConfiguration'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/platform/excelOutputConfiguration/config';
const URL_LIST = '/api/platform/excelOutputConfiguration/list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};


const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const config = await fetchJson(URL_CONFIG);
  if (config.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  const {index, edit} = config.result;
  const list = await search(URL_LIST, 0, index.pageSize, {});
  if (list.returnCode !== 0) {
    showError(list.returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  const {tableCols, filters} = config.result.index;
  const {controls} = config.result.edit;
  const tableCols2 = config.result.edit.tableCols;
  const dataTableCols = config.result.edit.data.edit.tableCols2;
  const dataControls = config.result.edit.data.edit.controls;
  let data = await fetchDictionary(config.result.dicNames);
  if(data.returnCode !=0){
    showError(data.returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  setDictionary(tableCols, data.result);
  setDictionary(filters, data.result);
  setDictionary(controls, data.result);
  setDictionary(tableCols2, data.result);
  setDictionary(dataTableCols, data.result);
  setDictionary(dataControls, data.result);

  const payload = buildOrderPageState(list.result, index, {editConfig: edit});
  payload.buttons = dealActions(payload.buttons, 'excelOutputConfiguration');
  payload.status = 'page';
  dispatch(action.create(payload));
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), ['status', 'edit','confirm']);
};

const actionCreators = {
  onInit: initActionCreator
};


const Component = EnhanceLoading(EnhanceDialogs(
  OrderPageContainer,
  ['edit', 'confirm'],
  [EditPageContainer, ConfirmDialogContainer]
));

const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;


