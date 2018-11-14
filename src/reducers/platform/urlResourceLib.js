import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['platform', 'urlResourceLib'];
const editPrefix = ['platform', 'urlResourceLib', 'edit'];
const distributionPrefix = ['platform', 'urlResourceLib', 'distribution'];
const edit = combineReducers({edit: createReducer(editPrefix), distribution: createReducer(distributionPrefix)});
const urlResourceLib = createReducer(prefix, edit);

export default urlResourceLib;
