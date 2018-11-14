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

// 获取汇率列表
api.post('/list', async (req, res) => {
  const url = `${service}/currency_type_rate/search/rates`;
  const option = postOption(searchAdapter(req.body));
  res.send(await fetchJsonByNode(req, url, option));
});

// 新增汇率
api.post('/save', async (req, res) => {
  const url = `${service}/currency_type_rate/insert`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 编辑汇率
api.put('/save', async (req, res) => {
  const url = `${service}/currency_type_rate/update`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 激活汇率
api.put('/active/:guid', async (req, res) => {
  const url = `${service}/currency_type_rate/active/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 使汇率失效
api.put('/invalid/:guid', async (req, res) => {
  const url = `${service}/currency_type_rate/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url, 'delete'));
});

// 币种下拉
api.post('/currency_drop_list', async (req, res) => {
  const url = `${service}/charge/tenant_currency_type/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
