import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['config', 'customersArchives'];
const editPrefix = ['config', 'customersArchives', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const customersArchives = createReducer(prefix, edit);

export default customersArchives;

