import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const service = 'tms-service';

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取列表数据
api.post('/list', async (req, res) => {
  const URL_LIST = `${host}/${service}/customer_information_config/list/search`;
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(req.body)));
});

// 新增
api.post('/', async (req, res) => {
  const url = `${host}/${service}/customer_information_config`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 编辑
api.put('/', async (req, res) => {
  const url = `${host}/${service}/customer_information_config`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 启用
api.put('/enable', async (req, res) => {
  const url = `${host}/${service}/customer_information_config/enabled_type_enabled/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 禁用
api.put('/disable', async (req, res) => {
  const url = `${host}/${service}/customer_information_config/enabled_type_disabled/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

export default api;

