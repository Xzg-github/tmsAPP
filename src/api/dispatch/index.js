import express from 'express';
import todo from './todo';
import done from './done';
import carManager from './carManager';

let api = express.Router();
api.use('/todo', todo);
api.use('/done', done);
api.use('/car_manager', carManager);

export default api;
