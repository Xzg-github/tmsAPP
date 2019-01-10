import express from 'express';
import trackOrder from './trackOrder';
import trackTransport from './trackTransport';
import fileManager from './fileManager';
import taskTotal from './taskTotal';
import interfaceLog from './interfaceLog';

let api = express.Router();
api.use('/track_order', trackOrder);
api.use('/track_transport', trackTransport);
api.use('/file_manager', fileManager);
api.use('/interface_log', interfaceLog);
api.use('/task_total', taskTotal);

export default api;
