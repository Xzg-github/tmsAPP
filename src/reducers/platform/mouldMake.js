import {createReducer} from '../../action-reducer/reducer';
import {combineReducers} from '../../action-reducer/combine';

const defaultState = {init: true};
const prefix = ['platform', 'mouldMake'];

const emailPrefix = ['platform', 'mouldMake', 'emailDialog'];
const signaturePrefix = ['platform', 'mouldMake', 'signatureDialog'];

const edit = combineReducers({emailDialog: createReducer(emailPrefix), signatureDialog: createReducer(signaturePrefix)});
const mouldMake = createReducer(prefix, edit, defaultState);

export default mouldMake;
