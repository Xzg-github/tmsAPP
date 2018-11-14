import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['basic', 'rate'];
const editPrefix = ['basic', 'rate', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const reducer = createReducer(prefix, edit);
export default reducer;
