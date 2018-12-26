import express from 'express';
import trackOrder from './trackOrder';
import fileManager from './fileManager';

let api = express.Router();
api.use('/track_order', trackOrder);
api.use('/file_manager', fileManager);

export default api;
