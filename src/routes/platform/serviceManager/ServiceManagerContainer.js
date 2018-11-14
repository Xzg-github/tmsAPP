import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EditDialogContainer from './EditDialogContainer';
import {EnhanceLoading, EnhanceDialogs} from '../../../components/Enhance';
import {getObject} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildUserApiState} from './OrderPageContainer';
import ConfirmDialogContainer from './ConfirmDialogContainer';

const STATE_PATH = ['platform',  'serviceManager'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const payload = await buildUserApiState();
  if(!payload) {
    dispatch(action.assign({status: 'retry'}));
  } else {
    payload.status = 'page';
    dispatch(action.create(payload));
  }
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), ['status', 'edit', 'confirm']);
};

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(EnhanceDialogs(
  OrderPageContainer,
  ['edit', 'confirm'],
  [EditDialogContainer, ConfirmDialogContainer]
));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
