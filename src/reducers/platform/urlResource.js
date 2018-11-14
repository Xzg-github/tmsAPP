import {createReducer} from '../../action-reducer/reducer';

const prefix = ['platform', 'urlResource'];
const urlResource = createReducer(prefix);

export default urlResource;
