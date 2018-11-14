import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EditDialogContainer from './EditDialogContainer';
import {EnhanceLoading, EnhanceEditDialog} from '../../../../components/Enhance';
import {Action} from '../../../../action-reducer/action';
import {buildOrderPageState} from '../../../../common/state';
import helper, {fetchJson, getJsonResult} from '../../../../common/common';
import {getPathValue} from '../../../../action-reducer/helper';



const STATE_PATH = ['platform', 'jurisdiction', 'tenantRuleTypes'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/platform/jurisdiction/tenantRuleTypes/config';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};


const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const {index, edit} = getJsonResult(await fetchJson(URL_CONFIG));
    const list = {
      result: {
        data: [],
        returnTotalItem: 0
      }

    };
    const payload = buildOrderPageState(list.result, index, {editConfig: edit, status: 'page'});
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

