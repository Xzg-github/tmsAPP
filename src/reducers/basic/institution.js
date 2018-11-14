import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['basic', 'institution'];
const editPrefix = ['basic', 'institution', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const institution = createReducer(prefix, edit);

export default institution;
