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

// 查询机构列表
api.post('/legal_person', async (req, res) => {
  //const module = await require('./data');
  //res.send(module.default);
  const url = `${service}/institution/legal_person/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
})

// 查询机构列表
api.post('/list', async (req, res) => {
  //const module = await require('./data');
  //res.send(module.default);
  const url = `${service}/institution/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 激活机构
api.put('/active/:guid', async (req, res) => {
  //res.send({returnCode: 0, result: {active: '1'}});
  const url = `${service}/institution/active/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url, 'put'));
});

// 删除(失效)机构
api.delete('/:guid', async (req, res) => {
  //res.send({returnCode: 0, result: {active: '2'}});
  const url = `${service}/institution/delete/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url, 'delete'));
});

// 新增机构
api.post('/', async (req, res) => {
  //res.send({returnCode: 0});
  const url = `${service}/institution/add`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 修改机构
api.put('/', async (req, res) => {
  //res.send({returnCode: 0});
  const url = `${service}/institution/modify`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

export default api;
