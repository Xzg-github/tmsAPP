import createOrderInfoPageContainer from '../../order/common/OrderInfoPage/createOrderInfoPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";

const STATE_PATH = ['done', 'edit'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  const state = getPathValue(rootState, ['done']);
  return state[state.activeKey];
};

const Container = createOrderInfoPageContainer(action, getSelfState);
export default Container;


