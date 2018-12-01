import createOrderInfoPageContainer from '../common/OrderInfoPage/createOrderInfoPageContainer';
import {Action} from "../../../action-reducer/action";

const STATE_PATH = ['input'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return rootState.input || {};
};

const Container = createOrderInfoPageContainer(action, getSelfState);
export default Container;


