import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['config', 'supplierCar'];
const editPrefix = ['config', 'supplierCar', 'edit'];
const edit = combineReducers({edit: createReducer(editPrefix)});
const supplierCar = createReducer(prefix, edit);

export default supplierCar;
