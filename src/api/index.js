import express from 'express';
import apiDictionary from './dictionary';
import apiHome from './home';
import apiBasic from './basic';
import permission from './permission';
import apiConfig from './config';
import apiLogin from './login';
import apiPassword from './password';
import apiProxy from './proxy';
import apiPlatform from './platform';
import apiMessage from './message';
import apiStandard from './standard';
import apiCommon from './common';
import apiOrder from './order';
import apiDispatch from './dispatch';
import apiBill from './bill';
import apiSupervisor from './supervisor';
import apiTrack from './track';

const api = express.Router();
api.use('/dictionary', apiDictionary);
api.use('/home', apiHome);
api.use('/basic', apiBasic);
api.use('/permission', permission);
api.use('/config', apiConfig);
api.use('/login', apiLogin);
api.use('/password', apiPassword);
api.use('/proxy', apiProxy);
api.use('/platform', apiPlatform);
api.use('/message', apiMessage);
api.use('/standard', apiStandard);
api.use('/common', apiCommon);
api.use('/order', apiOrder);
api.use('/dispatch', apiDispatch);
api.use('/bill', apiBill);
api.use('/supervisor', apiSupervisor);
api.use('/track', apiTrack);
api.use('*', (req, res) => {res.send({returnCode: 404, returnMsg: '接口不存在'})});
export default api;
