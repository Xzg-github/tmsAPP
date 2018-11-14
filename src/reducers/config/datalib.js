import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['config', 'datalib'];
const transformPrefix = ['config', 'datalib', 'transform'];
const transformEditPrefix = ['config', 'datalib', 'transform', 'edit'];
const standardPrefix = ['config', 'datalib', 'standard'];
const standardEditPrefix = ['config', 'datalib', 'standard', 'edit'];

const transformEdit = combineReducers({edit: createReducer(transformEditPrefix)});
const standardEdit = combineReducers({edit: createReducer(standardEditPrefix)});
const transform = createReducer(transformPrefix, transformEdit);
const standard = createReducer(standardPrefix, standardEdit);
const complex = combineReducers({transform, standard});
const datalib = createReducer(prefix, complex);

export default datalib;
