import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['basic', 'tenantCurrency'];
const joinPrefix = ['basic', 'tenantCurrency', 'join'];
const join = combineReducers({join: createReducer(joinPrefix)});
const tenantCurrency = createReducer(prefix, join);

export default tenantCurrency;

