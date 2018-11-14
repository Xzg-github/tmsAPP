import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['config', 'dataSet'];
const editPrefix = ['config', 'dataSet', 'dataSet1'];
const dataSetEditPrefix =  ['config', 'dataSet', 'dataSet1','edit'];
const confirm =  ['config', 'dataSet', 'dataSet1','confirm'];

const dataEdit = combineReducers({edit: createReducer(dataSetEditPrefix),confirm: createReducer(confirm)});
const dataSet1 = createReducer(editPrefix, dataEdit);
const complex = combineReducers({dataSet1});
const dataSet = createReducer(prefix, complex);

export default dataSet;
