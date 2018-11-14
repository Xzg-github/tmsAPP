import {createReducer} from '../../action-reducer/reducer';

const prefix = ['config', 'roleAuthorityDistribution'];
const roleAuthorityDistribution = createReducer(prefix);

export default roleAuthorityDistribution;

