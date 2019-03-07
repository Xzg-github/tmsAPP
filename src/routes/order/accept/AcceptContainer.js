import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildOrderTabPageState} from './OrderTabPageContainer';
import {updateTable} from '../../../standard-business/OrderTabPage/createOrderTabPageContainer';
import Accept from './Accept';

const prefix = ['accept'];
const action = new Action(prefix);

const getSelfState = (rootState) => {
  return getPathValue(rootState, prefix);
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const state = await buildOrderTabPageState();
  if (!state) {
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  dispatch(action.create(state));
};

const refreshForHomeActionCreator = (key) => async (dispatch, getState) => {
  dispatch(action.assign({activeKey: 'index', subActiveKey: key}));
  return updateTable(dispatch, action, getSelfState(getState()));
};

const tabChangeActionCreator = (key) => {
  return action.assign({activeKey: key});
};

const tabCloseActionCreator = (key) => (dispatch, getState) => {
  const {activeKey, tabs} = getSelfState(getState());
  const newTabs = tabs.filter(tab => tab.key !== key);
  if (activeKey === key) {
    let index = tabs.findIndex(tab => tab.key === key);
    (newTabs.length === index) && (index--);
    dispatch(action.assign({tabs: newTabs, [activeKey]: undefined, activeKey: newTabs[index].key}));
  } else {
    dispatch(action.assign({tabs: newTabs, [key]: undefined}));
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onRefreshForHome: refreshForHomeActionCreator,
  onTabChange: tabChangeActionCreator,
  onTabClose: tabCloseActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(Accept));
export default Container;
