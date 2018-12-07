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
  // const url = `${service}/transport_order/dispatch/task_list/search`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: {data:[{id: '001'}], returnTotalItem: 1}});
});

//撤消派单
api.post('/revoke', async (req, res) => {
  // const url = `${service}/transport_order/dispatch//batch`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0});
});

//变更车辆和司机
api.post('/change', async (req, res) => {
  // const url = `${service}/transport_order/dispatch//batch`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0});
});

export default api;
