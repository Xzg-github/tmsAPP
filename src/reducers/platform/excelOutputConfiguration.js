import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['platform', 'excelOutputConfiguration'];
const editPrefix = ['platform', 'excelOutputConfiguration', 'edit'];
const addEditPrefix = ['platform', 'excelOutputConfiguration', 'edit','addEdit'];
const addEdit = combineReducers({addEdit: createReducer(addEditPrefix)});
const edit = combineReducers({edit: createReducer(editPrefix)});
const excelOutputConfiguration = createReducer(prefix, edit);

export default excelOutputConfiguration;
