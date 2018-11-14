import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['platform', 'controlManager'];
const editPrefix = ['platform', 'controlManager', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const controlManager = createReducer(prefix, edit);

export default controlManager;
