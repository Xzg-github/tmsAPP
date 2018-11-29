import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {host} from '../../globalConfig';
const service = `${host}/archiver-service`;
let api = express.Router();

// 获取UI
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取客服列表
api.post('/list', async (req, res) => {
  const url = `${service}/customer/care/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取客服详细信息
api.get('/detail/:guid', async (req, res) => {
  const url = `${service}/customer/care/${req.params.guid}`;
  const json = await fetchJsonByNode(req, url);
  res.send(json);
});

// 新增客服
api.post('/save', async (req, res) => {
  const url = `${service}/customer/care`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 编辑客服
api.put('/save', async (req, res) => {
  const url = `${service}/customer/care`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 激活客服
api.put('/active', async (req, res) => {
  const url = `${service}/customer/care/batch/active`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 使客服失效
api.put('/invalid', async (req, res) => {
  const url = `${service}/customer/care/batch/negative`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

export default api;
