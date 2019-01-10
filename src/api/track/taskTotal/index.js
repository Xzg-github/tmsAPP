import express from 'express';
import {fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

const service = `${host}/tms-service`;
let api = express.Router();

// 获取界面配置
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

//获取列表数据
api.get('/data', async (req, res) => {
  const url = `${service}/transport_order/task_total`;
  res.send(await fetchJsonByNode(req, url));
});

export default api;
