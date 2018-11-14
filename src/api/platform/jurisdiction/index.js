import express from 'express';
import apiDataRule from './dataRule';
import apiDataType from './dataType';
import apiTenantRuleTypes from './tenantRuleTypes';

let api = express.Router();
api.use('/dataRule', apiDataRule);
api.use('/dataType', apiDataType);
api.use('/tenantRuleTypes', apiTenantRuleTypes);

export default api;
