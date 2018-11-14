import express from 'express';
import {postOption, fetchJsonByNode} from '../../../../common/common';
import {host} from '../../../globalConfig';

let api = express.Router();
const service = 'auth-center-provider';
const URL_LIST = `${host}/${service}/tenant_rule_types/`;
const URL_JOIN = `${host}/${service}/tenant_rule_types/join/`;
const URL_OK = `${host}/${service}/tenant_rule_types/batch`;
const URL_DEL = `${host}/${service}/tenant_rule_types`;

// 获取界面信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

api.get('/list/:tenantId', async (req, res) => {
  const tenantId = req.params.tenantId;
  res.send(await fetchJsonByNode(req, `${URL_LIST}${tenantId}`, postOption(req.body, 'get')));
});

api.get('/join/:tenantId', async (req, res) => {
  const tenantId = req.params.tenantId;
  res.send(await fetchJsonByNode(req, `${URL_JOIN}${tenantId}`, postOption(req.body, 'get')));
});

api.delete('/del', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_DEL, postOption(req.body, 'delete')));
});

api.post('/ok', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_OK, postOption(req.body)));
});

export default api;
