import express from 'express';
import todo from './todo';
import done from './done';

let api = express.Router();
api.use('/todo', todo);
api.use('/done', done);

export default api;
