import createOrderInfoPageContainer from '../../../../order/common/OrderInfoPage/createOrderInfoPageContainer';
import {getPathValue} from '../../../../../action-reducer/helper';
import {Action} from "../../../../../action-reducer/action";


const createOrderInfo = (path) => {
  const STATE_PATH = [path];
  const action = new Action(STATE_PATH);

  const getSelfState = (rootState) => {
    const state = getPathValue(rootState, STATE_PATH);
    const parent = state[state.activeKey];
    return parent[parent.activeKey];
  };

  return createOrderInfoPageContainer(action, getSelfState);
};

const OrderInfoContainer = createOrderInfo('receiveMake');

export default OrderInfoContainer;
export {createOrderInfo};


