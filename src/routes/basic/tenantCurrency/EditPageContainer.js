import { connect } from 'react-redux';
import EditPage from './components/EditPage/EditPage';
import {postOption, fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';

const STATE_PATH = ['basic', 'tenantCurrency', 'join'];
const action = new Action(STATE_PATH);
const actionParent = new Action(['basic', 'tenantCurrency']);
const CLOSE_ACTION = action.assignParent({join: undefined});

const URL_KEEP = '/api/basic/tenantCurrency/keep';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const getParentState = (rootState) => {
  return getPathValue(rootState, ['basic', 'tenantCurrency']);
};


const changeActionCreator = (checkedValues) => (dispatch, getState) => {
  dispatch(action.assign({checkedValues: checkedValues}))
};

const okActionCreator = () => async (dispatch, getState) => {
  const {checkedValues} = getSelfState(getState());
  const {tableItems} = getParentState(getState());
  const {returnCode, result} = await fetchJson(URL_KEEP, postOption(checkedValues));
  if(returnCode !== 0) {
    const msg = '加入失败';
    showError(msg);
  }
  const newItems = result.concat(tableItems)
  dispatch(action.assignParent({tableItems: newItems}));
  dispatch(CLOSE_ACTION);
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(CLOSE_ACTION);
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
  onChange: changeActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EditPage);
export default Container;
