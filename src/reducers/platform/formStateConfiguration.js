import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['platform', 'formStateConfiguration'];
const editPrefix = ['platform', 'formStateConfiguration', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const formStateConfiguration = createReducer(prefix, edit);

export default formStateConfiguration;
