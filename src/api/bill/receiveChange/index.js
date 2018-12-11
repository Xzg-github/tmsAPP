import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

const service = `${host}/tms-service`;
const archiver_service = `${host}/archiver-service`;

let api = express.Router();

//获取Config信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

//获取列表
api.post('/list', async (req, res) => {
  const url = `${service}/renewal_income/page`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)))
});

//获取单条记录的详细信息
api.get('/detail/:id', async (req, res) => {
  const url = `${service}/renewal_income/income/edit/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

//审核查看
api.get('/checkView/:id', async (req, res) => {
  const url = `${service}/renewal_income/check/view/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url, 'get'));
});

// 获取币种下拉
api.post('/currency', async (req, res) => {
  const url = `${archiver_service}/charge/tenant_currency_type/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
