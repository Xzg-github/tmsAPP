import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['basic', 'carType'];
const editPrefix = ['basic', 'carType', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const carType = createReducer(prefix, edit);

export default carType;

