import express from 'express';
import waiting from './waiting';
import finish from './finish';
import supervisorManager from './supervisorManager';

let api = express.Router();
api.use('/waiting', waiting);
api.use('/finish', finish);
api.use('/supervisor_manager', supervisorManager);

export default api;
