import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {host} from '../../globalConfig';
const service = `${host}/archiver-service`;
let api = express.Router();

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取列表数据
api.post('/list', async (req, res) => {
  const url = `${service}/table_extend_property_config/list/search`;
  const {filter= {}, ...other} = req.body;
  res.send(await fetchJsonByNode(req, url, postOption({...filter, ...other})));
});

// 新增
api.post('/', async (req, res) => {
  const url = `${service}/table_extend_property_config`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 设置扩展字段
api.put('/', async (req, res) => {
  const url = `${service}/table_extend_property_config`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 启用、禁用
api.put('/status/:id/:type', async (req, res) => {
  const url = `${service}/table_extend_property_config/${req.params.id}/${req.params.type}`;
  res.send(await fetchJsonByNode(req, url, 'put'));
});

// 获取单条记录信息
api.get('/info/:id', async (req, res) => {
  const url = `${service}/table_extend_property_config/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

// 根据表单编码获取所有可配置表单
api.get('/allProperties/:tableCode', async (req, res) => {
  const url = `${service}/property/library/${req.params.tableCode}`;
  res.send(await fetchJsonByNode(req, url));
});

export default api;
