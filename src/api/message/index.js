import express from 'express';
import businessApi from './business';
import sendMessageByShortMes from './sendMessageByShortMes';
import sendMessageByEmail from './sendMessageByEmail';
import messageSubscribe from './messageSubscribe';

let api = express.Router();

api.use('/business',businessApi);

api.use('/sendMessageByShortMes',sendMessageByShortMes);

api.use('/sendMessageByEmail',sendMessageByEmail);

api.use('/messageSubscribe', messageSubscribe);

export default api;
