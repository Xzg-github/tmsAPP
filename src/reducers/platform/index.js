import { combineReducers ,} from 'redux';
import {createReducer} from '../../action-reducer/reducer';
import jurisdiction from './jurisdiction.js';
import serviceManager from './serviceManager';
import controlManager from './controlManager';
import urlResourceLib from './urlResourceLib.js';
import urlResource from './urlResource';
import formStateConfiguration from './formStateConfiguration';
import excelOutputConfiguration from './excelOutputConfiguration';
import mouldMake from './mouldMake';
import importTemplate from './importTemplate';

const platformReducer = combineReducers({
  jurisdiction,
  serviceManager,
  controlManager,
  urlResourceLib,
  urlResource,
  formStateConfiguration,
  excelOutputConfiguration,
  mouldMake,
  importTemplate,
  messageTheme: createReducer(['platform', 'messageTheme'])
});

export default platformReducer;
