import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const userPrefix = ['basic', 'user'];
const editPrefix = ['basic', 'user', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const user = createReducer(userPrefix, edit);

export default user;
