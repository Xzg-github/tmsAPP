import createOrderInfoPageContainer from '../../order/common/OrderInfoPage/createOrderInfoPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";

const STATE_PATH = ['trackOrder', 'edit'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  const state = getPathValue(rootState, ['trackOrder']);
  return state[state.activeKey];
};

const Container = createOrderInfoPageContainer(action, getSelfState);
export default Container;


