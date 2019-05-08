import {createReducer} from '../../action-reducer/reducer';

const tenantPrefix = ['basic', 'tenant'];
const tenant = createReducer(tenantPrefix);

export default tenant;
