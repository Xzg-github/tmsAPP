import {createReducer} from '../../action-reducer/reducer';

const prefix = ['config', 'tenantAuthorityDistribution'];
const tenantAuthorityDistribution = createReducer(prefix);

export default tenantAuthorityDistribution;

