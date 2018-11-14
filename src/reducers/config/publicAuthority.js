import {createReducer} from '../../action-reducer/reducer';

const prefix = ['config', 'publicAuthority'];
const publicAuthority = createReducer(prefix);

export default publicAuthority;

