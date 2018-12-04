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
  const url = `${service}/transport_order/pending_task_list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//删除
api.delete('/', async (req, res) => {
  const url = `${service}/transport_order/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

//任务派发
api.post('/send', async (req, res) => {
  const url = `${service}/transport_order/batch/send`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
