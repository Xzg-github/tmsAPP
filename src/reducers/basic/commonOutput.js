import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['basic','commonOutput'];
const editPrefix = ['basic','commonOutput','edit'];
const edit = combineReducers({edit:createReducer(editPrefix)});
const commonOutput = createReducer(prefix,edit);

export default commonOutput
