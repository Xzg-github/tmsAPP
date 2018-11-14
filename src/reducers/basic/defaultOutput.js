import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['basic','defaultOutput'];
const editPrefix = ['basic','defaultOutput','edit'];
const addEditPrefix = ['basic', 'defaultOutput', 'edit','addEdit'];
const addEdit = combineReducers({addEdit: createReducer(addEditPrefix)});
const edit = combineReducers({edit: createReducer(editPrefix)});
const defaultOutput = createReducer(prefix, edit);

export default defaultOutput
