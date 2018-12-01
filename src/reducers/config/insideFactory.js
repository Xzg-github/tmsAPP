import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['config', 'insideFactory'];
const editPrefix = ['config', 'insideFactory', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const insideFactory = createReducer(prefix, edit);

export default insideFactory;
