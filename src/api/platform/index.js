import express from 'express';
import apiJurisdiction from './jurisdiction';
import apiServiceManager from './serviceManager';
import apiControlManager from './controlManager';
import apiUrlResourceLib from './urlResourceLib';
import apiUrlResource from './urlResource';
import formStateConfiguration from './formStateConfiguration';
import excelOutputConfiguration from './excelOutputConfiguration';
import apiMouldMake from './mouldMake';
import apiImportTemplate from './importTemplate';
import messageTheme from './messageTheme';

let api = express.Router();
api.use('/jurisdiction', apiJurisdiction);
api.use('/serviceManager', apiServiceManager);
api.use('/controlManager', apiControlManager);
api.use('/urlResourceLib', apiUrlResourceLib);
api.use('/urlResource', apiUrlResource);
api.use('/formStateConfiguration', formStateConfiguration);
api.use('/excelOutputConfiguration', excelOutputConfiguration);
api.use('/mouldMake', apiMouldMake);
api.use('/importTemplate', apiImportTemplate);
api.use('/messageTheme', messageTheme);

export default api;
