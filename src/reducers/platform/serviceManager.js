import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['platform', 'serviceManager'];
const editPrefix = ['platform', 'serviceManager', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const serviceManager = createReducer(prefix, edit);

export default serviceManager;
