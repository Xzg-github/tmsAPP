import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['basic', 'SMSmail'];
const editPrefix = ['basic', 'SMSmail', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const SMSmail = createReducer(prefix, edit);

export default SMSmail;
