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
  const url = `${service}/transport_order/trace_order/list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//运输已开始
api.post('/started', async (req, res) => {
  const url = `${service}/transport_order/transport_start/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//运输已完成
api.post('/completed', async (req, res) => {
  const url = `${service}/transport_order/transport_end/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
