import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const tenantPrefix = ['basic', 'tenant'];
const editPrefix = ['basic', 'tenant', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const tenant = createReducer(tenantPrefix, edit);

export default tenant;
