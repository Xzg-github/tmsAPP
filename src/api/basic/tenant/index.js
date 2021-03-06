import express from 'express';
import {host} from '../../globalConfig';
import {fetchJsonByNode, postOption} from '../../../common/common';
const service = `${host}/tenant-service`;
let api = express.Router();

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取主列表数据
api.post('/list', async (req, res) => {
  const url = `${service}/tenant/listBySearch`;
  const {filter, ...others} = req.body;
  res.send(await fetchJsonByNode(req, url, postOption({...filter, ...others})));
});

// 激活
api.put('/active/:guid', async (req, res) => {
  const url = `${service}/tenant/active/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url, 'put'));
});

// 删除(失效)
api.delete('/:guid', async (req, res) => {
  const url = `${service}/tenant/invalid/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url, 'delete'));
});

// 新增租户
api.post('/', async (req, res) => {
  const url = `${service}/tenant`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 编辑租户
api.put('/', async (req, res) => {
  const url = `${service}/tenant`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 租户角色下拉列表
api.post('/role_drop_list/:tenantId', async (req, res) => {
  const url = `${host}/auth-center-provider/role/list/${req.params.tenantId}`;
  res.send(await fetchJsonByNode(req, url, 'post'));
});

//用户管理-搜索用户
api.post('/user_list', async (req, res) => {
  const url = `${service}/users/tenant/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//用户管理-注销用户
api.post('/user_del', async (req, res) => {
  const url = `${service}/users/delete`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
