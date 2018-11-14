import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['basic', 'department'];
const editPrefix = ['basic', 'department', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const department = createReducer(prefix, edit);

export default department;
