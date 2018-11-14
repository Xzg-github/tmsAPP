import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {search} from '../../helper';
import {host} from '../../globalConfig';
const service = `${host}/tenant_service`;
let api = express.Router();

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取列表数据
api.get('/tree', async (req, res) => {
  //const module = await require('./data');
  //res.send(module.default);
  const url = `${service}/department/tree`;
  res.send(await fetchJsonByNode(req, url));
});

// 获取指定机构或部门下的用户
api.get('/list/:guid/:type', async (req, res) => {
  const url = `${service}/user/list/${req.params.guid}/${req.params.type}`;
  res.send(await fetchJsonByNode(req, url));
});

// 查询用户的名称
api.post('/name', async (req, res) => {
  const url = `${service}/user/name/search`;
  res.send(await search(req, url, 'username', req.body.filter));
});

// 归属机构查询
api.post('/institution', async (req, res) => {
  const url = `${host}/tenant_service/institution/list`;
  const option = postOption(req.body);
  res.send(await fetchJsonByNode(req, url,option));
});

// 归属部门查询
api.post('/department', async (req, res) => {
  const url = `${host}/tenant_service/department/list`;
  const option = postOption(req.body);
  res.send(await fetchJsonByNode(req, url,option));
});

// 激活
api.put('/active/:guid', async (req, res) => {
  //res.send({returnCode: 0, result: {active: 1}});
  const url = `${service}/user/active/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url, 'put'));
});

// 删除
api.delete('/:guid', async (req, res) => {
  //res.send({returnCode: 0, result: {active: 2}});
  const url = `${service}/user/delete/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url, 'delete'));
});

// 新增用户
api.post('/', async (req, res) => {
  //res.send({returnCode: 0});
  const url = `${service}/user/add`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 编辑
api.put('/', async (req, res) => {
  //res.send({returnCode: 0});
  const url = `${service}/user/modify`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 搜索用户所在的部门
api.post('/search', async (req, res) => {
  const url = `${service}/user/username_or_code`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
