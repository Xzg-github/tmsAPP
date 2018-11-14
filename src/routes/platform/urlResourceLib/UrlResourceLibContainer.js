import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EditDialogContainer from './EditDialogContainer';
import {EnhanceLoading, EnhanceDialogs} from '../../../components/Enhance';
import DistributionDialogContainer from './DistributionDialogContainer';
import {getObject} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildUrlsourceLib} from './OrderPageContainer';
import ConfirmDialogContainer from './ConfirmDialogContainer';

const STATE_PATH = ['platform', 'urlResourceLib'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const payload = await buildUrlsourceLib();
  if(!payload) {
    dispatch(action.assign({status: 'retry'}));
  } else {
    payload.status = 'page';
    dispatch(action.create(payload));
  }
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), ['status', 'edit','confirm', 'distribution']);
};

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(EnhanceDialogs(
  OrderPageContainer,
  ['edit', 'confirm', 'distribution'],
  [EditDialogContainer, ConfirmDialogContainer,  DistributionDialogContainer]
));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
