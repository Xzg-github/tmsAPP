import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const sysDictionaryPrefix = ['basic', 'sysDictionary'];
const editPrefix = ['basic', 'sysDictionary', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const sysDictionary = createReducer(sysDictionaryPrefix, edit);

export default sysDictionary;
