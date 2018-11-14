import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {host} from '../../globalConfig';
const service = `${host}/integration_service`;
const service1 = `${host}/tenant_service`;
let api = express.Router();

const URL_DEL = `${service}/email_model_manager`;
const URL_ACTIVE = `${service}/email_model_manager`;

// 获取UI
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取列表数据
api.post('/list', async (req, res) => {
  const url = `${service}/email_model_manager/list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 新增
api.post('/new', async (req, res) => {
  const url = `${service}/email_model_manager`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 编辑
api.put('/edit', async (req, res) => {
  const url = `${service}/email_model_manager`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//删除
api.delete('/del/:id', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${URL_DEL}/${req.params.id}`, postOption(null, 'delete')));
});

// 激活、失效
api.put('/:id/:isActive', async (req, res) => {
  const url = `${URL_ACTIVE}/${req.params.id}/${req.params.isActive}`;
  res.send(await fetchJsonByNode(req, url, 'put'));
});

//获取收件人/抄送人界面配置
api.get('/user_add_config', async (req, res) => {
  const module = await require('./userAddConfig');
  res.send({returnCode: 0, result: module.default});
});

// 获取用户数据
api.post('/user_list', async (req, res) => {
  const url = `${service1}/user/user_or_department/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
