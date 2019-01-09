import express from 'express';
import trackOrder from './trackOrder';
import trackTransport from './trackTransport';
import fileManager from './fileManager';
import taskTotal from './taskTotal';

let api = express.Router();
api.use('/track_order', trackOrder);
api.use('/track_transport', trackTransport);
api.use('/file_manager', fileManager);
api.use('/task_total', taskTotal);

export default api;
