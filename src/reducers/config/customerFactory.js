import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['config', 'customerFactory'];
const editPrefix = ['config', 'customerFactory', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const customerFactory = createReducer(prefix, edit);

export default customerFactory;
