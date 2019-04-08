import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

const service = `${host}/tms-service`;
let api = express.Router();

// 获取界面配置
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

//获取列表数据
api.post('/list', async (req, res) => {
  const url = `${service}/transport_order/finish_list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//设为模板
api.post('/template', async (req, res) => {
  const url = `${service}/transport_order/template/insert`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//模板下拉
api.get('/template_list', async (req, res) => {
  const url = `${service}/transport_order/template/search`;
  res.send(await fetchJsonByNode(req, url, postOption({})));
});

//删除模板
api.delete('/template_delete/:id', async (req, res) => {
  const url = `${service}/transport_order/template/delete/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url, 'delete'));
});

export default api;
