import express from 'express';
import trackOrder from './trackOrder';

let api = express.Router();
api.use('/track_order', trackOrder);

export default api;
