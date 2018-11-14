import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {host} from '../../globalConfig';
const service = `${host}/tenant_service`;
let api = express.Router();

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取机构部门树
api.get('/tree', async (req, res) => {
  //const module = await require('./data');
  //res.send(module.default);
  const url = `${service}/department/tree`;
  res.send(await fetchJsonByNode(req, url));
});

// 获取指定机构或部门下的直接部门
api.get('/children/:guid/:type', async (req, res) => {
  const url = `${service}/department/children/${req.params.guid}/${req.params.type}`;
  res.send(await fetchJsonByNode(req, url));
});

// 激活部门
api.put('/active/:guid', async (req, res) => {
  //res.send({returnCode: 0, result: {active: '1'}});
  const url = `${service}/department/active/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url, 'put'));
});

// 删除或失效(部门)
api.delete('/:guid', async (req, res) => {
  //res.send({returnCode: 0, result: {active: '2'}});
  const url = `${service}/department/delete/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url, 'delete'));
});

// 新增部门
api.post('/', async (req, res) => {
  //res.send({returnCode: 0});
  const url = `${service}/department/add`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 修改部门信息
api.put('/', async (req, res) => {
  //res.send({returnCode: 0});
  const url = `${service}/department/modify`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

export default api;
