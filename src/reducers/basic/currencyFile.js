import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['basic', 'currencyFile'];
const editPrefix = ['basic', 'currencyFile', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const currencyFile = createReducer(prefix, edit);

export default currencyFile;
