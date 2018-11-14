import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['config', 'suppliersArchives'];
const editPrefix = ['config', 'suppliersArchives', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const customersArchives = createReducer(prefix, edit);

export default customersArchives;

