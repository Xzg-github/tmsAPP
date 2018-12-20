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
  const url = `${service}/transport_order/dispatch/task_list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//撤消派单
api.post('/revoke', async (req, res) => {
  const url = `${service}/transport_order/dispatch/cancel_order`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//变更车辆和司机
api.post('/change', async (req, res) => {
  const url = `${service}/transport_order/dispatch/car_info/update`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//车牌下拉
api.post('/car_drop_list', async (req, res) => {
  const url = `${host}/archiver-service/car_info/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//司机下拉
api.post('/driver_drop_list', async (req, res) => {
  const url = `${host}/archiver-service/driver_info/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 根据车牌ID获取车辆记录详细信息
api.get('/car_info/:id', async (req, res) => {
  const url = `${host}/archiver-service/car_info/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

// 根据司机ID获取司机记录详细信息
api.get('/driver_info/:id', async (req, res) => {
  const url = `${host}/archiver-service/driver_info/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

export default api;
