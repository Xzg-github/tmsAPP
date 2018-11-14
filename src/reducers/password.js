import { combineReducers } from 'redux';
import {createReducer} from '../action-reducer/reducer';

const create = (key) => {
  const prefix = ['password', key];
  return createReducer(prefix);
};

const reducer = combineReducers({
  modify: create('modify'),
});

export default reducer;
