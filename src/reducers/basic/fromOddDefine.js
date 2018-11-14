import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['basic', 'fromOddDefine'];
const editPrefix = ['basic', 'fromOddDefine', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const car = createReducer(prefix, edit);

export default car;
