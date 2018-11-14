import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['config', 'emailAccept'];
const emailPrefix = ['config', 'emailAccept', 'email'];
const emailEditPrefix = ['config', 'emailAccept', 'email', 'edit'];
const acceptPrefix = ['config', 'emailAccept', 'accept'];
const acceptEditPrefix = ['config', 'emailAccept', 'accept', 'edit'];
const logPrefix = ['config', 'emailAccept', 'log'];

const eamilEdit = combineReducers({edit: createReducer(emailEditPrefix)});
const acceptEdit = combineReducers({edit: createReducer(acceptEditPrefix)});
const email = createReducer(emailPrefix, eamilEdit);
const accept = createReducer(acceptPrefix, acceptEdit);
const log = createReducer(logPrefix);
const complex = combineReducers({email, accept, log});
const emailAccept = createReducer(prefix, complex);

export default emailAccept;
