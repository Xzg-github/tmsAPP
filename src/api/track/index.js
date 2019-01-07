import express from 'express';
import trackOrder from './trackOrder';
import trackTransport from './trackTransport';
import fileManager from './fileManager';

let api = express.Router();
api.use('/track_order', trackOrder);
api.use('/track_transport', trackTransport);
api.use('/file_manager', fileManager);

export default api;
