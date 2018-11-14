import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EditDialogContainer from './EditDialogContainer';
import {EnhanceLoading, EnhanceEditDialog} from '../../../../components/Enhance';
import {Action} from '../../../../action-reducer/action';
import {buildOrderPageState} from '../../../../common/state';
import helper, {fetchJson, getJsonResult, postOption} from '../../../../common/common';
import {getPathValue} from '../../../../action-reducer/helper';

const STATE_PATH = ['platform', 'jurisdiction', 'dataType'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/platform/jurisdiction/dataType/config';
const URL_SEARCH = '/api/platform/jurisdiction/dataType/search';
const URL_LIST = '/api/platform/jurisdiction/dataRule/list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const setPerson = (controls, person) => {
  controls.some((control) => {
    if (control.key === 'relationList' || control.key === 'defaultRuleKeyId') {
      control.options = person;
    }
  });
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const {index, edit} = getJsonResult(await fetchJson(URL_CONFIG));
    const result = getJsonResult(await fetchJson(URL_SEARCH, postOption({})));
    const list= {
      result: {
        data: result,
      }
    };
    const payload = buildOrderPageState(list.result, index, {editConfig: edit, status: 'page'});
    const res = getJsonResult(await fetchJson(URL_LIST));
    let person = [];
    res.map((item) => {
      person.push({
        value: item.id,
        title: `${item.ruleKey}(${item.ruleName})`
      })
    });
    setPerson(payload.filters, person);
    setPerson(payload.tableCols, person);
    setPerson(payload.editConfig.controls, person);
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
