import express from 'express';
import {postOption, fetchJsonByNode} from '../../../../common/common';
import {host} from '../../../globalConfig';

let api = express.Router();
const service = 'auth-center-provider';
const URL_ADD = `${host}/${service}/public_rule_type`;
const URL_EDIT = `${host}/${service}/public_rule_type`;
const URL_DEL = `${host}/${service}/public_rule_type/`;
const URL_SEARCH = `${host}/${service}/public_rule_types/search`;

// 获取界面信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

api.post('/', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ADD, postOption(req.body)));
});

api.put('/', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_EDIT, postOption(req.body, 'put')));
});

api.delete('/del/:id', async (req, res) => {
  const id = req.params.id;
  res.send(await fetchJsonByNode(req, `${URL_DEL}${id}`, postOption(req.body, 'delete')));
});

api.post('/search', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_SEARCH, postOption(req.body)));
});

export default api;

