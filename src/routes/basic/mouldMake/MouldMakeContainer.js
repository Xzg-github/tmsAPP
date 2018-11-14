import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EmailDialogContainer from './EmailDialogContainer';
import SignatureDialogContainer from './SignatureDialogContainer';
import {EnhanceLoading, EnhanceDialogs} from '../../../components/Enhance';
import {getObject} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildState} from './OrderPageContainer';

const STATE_PATH = ['platform', 'mouldMake'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const payload = await buildState();
  if(!payload) {
    dispatch(action.assign({status: 'retry'}));
  } else {
    payload.status = 'page';
    dispatch(action.create(payload));
  }
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), ['status', 'init', 'emailDialog', 'signatureDialog']);
};

const actionCreators = {
  onInit: initActionCreator
};

// const Component = EnhanceLoading(EnhanceDialogs(
//   OrderPageContainer,
//   ['emailDialog', 'signatureDialog'],
//   [EmailDialogContainer, SignatureDialogContainer]
// ));
//const Component = EnhanceLoading(OrderPageContainer);
const Component = EnhanceLoading(EnhanceDialogs(
  OrderPageContainer,
  ['emailDialog', 'signatureDialog'],
  [EmailDialogContainer, SignatureDialogContainer]
));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
