import express from 'express';
import input from './input';
import apiImport from './import';
import pending from './pending';
import complete from './complete';
import all from './all';

let api = express.Router();
api.use('/input', input);
api.use('/import', apiImport);
api.use('/pending', pending);
api.use('/complete', complete);
api.use('/all', all);

export default api;
