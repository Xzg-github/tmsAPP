import createOrderInfoPageContainer from '../../../../order/common/OrderInfoPage/createOrderInfoPageContainer';
import {getPathValue} from '../../../../../action-reducer/helper';
import {Action} from "../../../../../action-reducer/action";


const createOrderInfo = (path) => {
  const STATE_PATH = [path, 'edit', 'orderInfo'];
  const action = new Action(STATE_PATH);

  const getSelfState = (rootState) => {
    const parent = getPathValue(rootState, [path]);
    return parent[parent.activeKey]['orderInfo'];
  };

  return createOrderInfoPageContainer(action, getSelfState);
};

const OrderInfoContainer = createOrderInfo('receiveMake');

export default OrderInfoContainer;
export {createOrderInfo};


