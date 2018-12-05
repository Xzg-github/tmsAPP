import createOrderInfoPageContainer from '../common/OrderInfoPage/createOrderInfoPageContainer';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";

const STATE_PATH = ['all', 'edit'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  const state = getPathValue(rootState, ['all']);
  return state[state.activeKey];
};

const Container = createOrderInfoPageContainer(action, getSelfState);
export default Container;


