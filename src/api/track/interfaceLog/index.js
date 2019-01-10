import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

const service = `${host}/mq-service`;
let api = express.Router();

// 获取界面配置
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

//获取推送日志列表数据
api.post('/pushLogList', async (req, res) => {
  const url = `${service}/push_interface_log/list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//获取接收日志列表数据
api.post('/receivingLogList', async (req, res) => {
  const url = `${service}/receive_interface_log/list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//重新对接
api.post('/redock', async (req, res) => {
  const url = `${service}/push_interface_log/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

export default api;

