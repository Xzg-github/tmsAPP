import {createReducer} from '../../action-reducer/reducer';

const prefix = ['config', 'accountManager'];
const accountManager = createReducer(prefix);

export default accountManager;

