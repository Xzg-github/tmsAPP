import { combineReducers } from 'redux';
import dataSet from './dataset';
import modeOutputDesign from './modeOutputDesign';
import publicAuthority from './publicAuthority';
import accountManager from './accountManager';
import tenantAuthorityDistribution from './tenantAuthorityDistribution';
import roleAuthorityDistribution from './roleAuthorityDistribution';
import datalib from './datalib';
import tenantapi from './tenantapi';
import emailAccept from './emailAccept';
import customersArchives from './customersArchives';
import suppliersArchives from './suppliersArchives';
import customerFactory from './customerFactory';
import insideFactory from './insideFactory';
import supplierCar from './supplierCar';

const configReducer = combineReducers({
  dataSet,
  modeOutputDesign,
  publicAuthority,
  accountManager,
  tenantAuthorityDistribution,
  roleAuthorityDistribution,
  datalib,
  tenantapi,
  emailAccept,
  customersArchives,
  suppliersArchives,
  customerFactory,
  insideFactory,
  supplierCar
});


export default configReducer;
