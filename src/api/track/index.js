import express from 'express';
import trackOrder from './trackOrder';
import fileManager from './fileManager';
import interfaceLog from './interfaceLog';

let api = express.Router();
api.use('/track_order', trackOrder);
api.use('/file_manager', fileManager);
api.use('/interface_log', interfaceLog);

export default api;
