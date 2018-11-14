import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['config', 'tenantapi'];
const editPrefix = ['config', 'tenantapi', 'addDialog'];
const addDialog = combineReducers({addDialog: createReducer(editPrefix)});
const tenantapi = createReducer(prefix, addDialog);

export default tenantapi;
