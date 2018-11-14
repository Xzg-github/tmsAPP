import {createReducer} from '../../action-reducer/reducer';

const prefix = ['config', 'modeOutputDesign'];
const modeOutputDesign = createReducer(prefix);

export default modeOutputDesign;
