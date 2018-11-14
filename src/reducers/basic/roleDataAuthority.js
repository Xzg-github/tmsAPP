import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['basic', 'roleDataAuthority'];
const editPrefix = ['basic', 'roleDataAuthority', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const reducer = createReducer(prefix, edit);
export default reducer;
