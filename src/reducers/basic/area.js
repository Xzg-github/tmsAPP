import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const prefix = ['basic', 'area'];
const districtPrefix = ['basic', 'area', 'district'];
const districtEditPrefix = ['basic', 'area', 'district', 'edit'];
const sitePrefix = ['basic', 'area', 'site'];
const siteEditPrefix = ['basic', 'area', 'site', 'edit'];
const contactPrefix = ['basic', 'area', 'contact'];
const contactEditPrefix = ['basic', 'area', 'contact', 'edit'];
const district = createReducer(districtPrefix, combineReducers({edit: createReducer(districtEditPrefix)}) );
const site = createReducer(sitePrefix, combineReducers({edit: createReducer(siteEditPrefix)}) );
const contact = createReducer(contactPrefix, combineReducers({edit: createReducer(contactEditPrefix)}) );
const complex = combineReducers({district, site, contact});
const area = createReducer(prefix, complex);

export default area;
