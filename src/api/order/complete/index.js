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
  const url = `${service}/transport_order/handled_task_list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//批量撤销
api.post('/revoke', async (req, res) => {
  const url = `${service}/transport_order/batch/undo`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//运单修改
api.put('/change', async (req, res) => {
  const url = `${service}/transport_order/change`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//取消
api.post('/cancel', async (req, res) => {
  const url = `${service}/transport_order/cancel`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
