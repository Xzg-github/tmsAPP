import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import TaskTotal from './TaskTotal';
import helper from "../../../common/common";

const prefix = ['taskTotal'];
const action = new Action(prefix);

const getSelfState = (rootState) => {
  return getPathValue(rootState, prefix);
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  try {
    const config = helper.getJsonResult(await helper.fetchJson(`/api/track/task_total/config`));
    const count = helper.getJsonResult(await helper.fetchJson(`/api/track/task_total/data`));
    const state = {
      ...config,
      count,
      status: 'page'
    };
    dispatch(action.create(state));
  }catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const updateActionCreator = () => async (dispatch) => {
  const {returnCode, result, returnMsg} = await helper.fetchJson(`/api/track/task_total/data`);
  if (returnCode !== 0) return helper.showError(returnMsg);
  dispatch(action.assign({count: result}));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onUpdate: updateActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(TaskTotal));
export default Container;
