import { combineReducers } from 'redux';
import {createReducer} from '../../action-reducer/reducer';
import user from './user';
import institution from './institution';
import department from './department';
import area from './area';
import rate from './rate';
import chargeItem from './chargeItem';
import fromOddDefine from './fromOddDefine';
import currencyFile from './currencyFile';
import tenantCurrency from './tenantCurrency';
import sysDictionary from './sysDictionary';
import roleDataAuthority from './roleDataAuthority';
import commonOutput from './commonOutput';
import defaultOutput from './defaultOutput';
import SMSmail from './SMSmail';
import excelConfigLib from './excelConfigLib';
import tenant from './tenant';

const basicReducer = combineReducers({
  user,
  institution,
  department,
  area,
  rate,
  chargeItem,
  fromOddDefine,
  currencyFile,
  tenantCurrency,
  sysDictionary,
  roleDataAuthority,
  commonOutput,
  defaultOutput,
  SMSmail,
  excelConfigLib,
  tenant,
  messageSetting: createReducer(['basic', 'messageSetting']),
  formExpand: createReducer(['basic', 'formExpand']),
  systemConfig: createReducer(['basic', 'systemConfig'])
});

export default basicReducer;
