import { combineReducers } from 'redux';
import {createReducer} from '../action-reducer/reducer';
import basic from './basic';
import config from './config';
import password from './password';
import platform from './platform';
import message from './message';

const rootReducer = combineReducers({
  layout: createReducer(['layout']),
  home: createReducer(['home']),
  temp: createReducer(['temp']),
  basic,
  config,
  password,
  platform,
  message,
});

export default rootReducer;
