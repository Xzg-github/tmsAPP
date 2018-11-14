import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['platform', 'importTemplate'];
const editPrefix = ['platform', 'importTemplate', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const importTemplate = createReducer(prefix, edit);

export default importTemplate;
