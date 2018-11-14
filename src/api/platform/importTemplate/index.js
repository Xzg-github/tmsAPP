import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {host} from '../../globalConfig';
const service = `${host}/integration_service`;
let api = express.Router();

const URL_DEL = `${service}/import_template_config`;

// 获取UI
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取列表数据
api.post('/list', async (req, res) => {
  const url = `${service}/import_template_config/list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 引入获取列表数据
api.post('/lead_list', async (req, res) => {
  const url = `${service}/import_template_config/introduce/excel`;
  res.send(await fetchJsonByNode(req, url, postOption()));
});

// 新增
api.post('/new', async (req, res) => {
  const url = `${service}/import_template_config`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 编辑
api.put('/edit', async (req, res) => {
  const url = `${service}/import_template_config`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 激活、失效
api.put('/is_active', async (req, res) => {
  const url = `${service}/import_template_config/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//删除
api.delete('/del/:id', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${URL_DEL}/${req.params.id}`, postOption(null, 'delete')));
});

// API下拉
api.post('/api_list', async (req, res) => {
  const url = `${service}/apiStandardLibrary/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
