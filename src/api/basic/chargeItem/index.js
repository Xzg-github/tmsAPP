import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {searchAdapter} from '../../helper';
import {host} from '../../globalConfig';
const service = `${host}/archiver-service`;
let api = express.Router();

// 获取UI
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取费用项列表
api.post('/list', async (req, res) => {
  const url = `${service}/charge_item/search/items`;
  const option = postOption(searchAdapter(req.body));
  res.send(await fetchJsonByNode(req, url, option));
});

// 新增费用项
api.post('/save', async (req, res) => {
  const url = `${service}/charge_item/insert`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 编辑费用项
api.put('/save', async (req, res) => {
  const url = `${service}/charge_item/update`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 激活费用项
api.put('/active/:guid', async (req, res) => {
  const url = `${service}/charge_item/active/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 使费用项失效
api.put('/invalid/:guid', async (req, res) => {
  const url = `${service}/charge_item/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url, 'delete'));
});

// 获取费用项列表
api.post('/appointment_rule', async (req, res) => {
  const url = `${service}/charge_item/appointment_rule`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
