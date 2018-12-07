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
  // const url = `${service}/transport_order/dispatch/pending_task_list/search`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: {data:[{id: '001'}], returnTotalItem: 1, tags:[{tag:'0', count: 1}, {tag:'1', count: 1}, {tag:'2', count: 1}, {tag:'3', count: 1}]}});
});

//智能派单
api.post('/auto_dispatch', async (req, res) => {
  // const url = `${service}/transport_order/dispatch/intelligence/batch`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0});
});

//确认计划
api.post('/confirm_plan', async (req, res) => {
  // const url = `${service}/transport_order/dispatch/plan_confirm/batch`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0});
});

//撤消计划
api.post('/revoke_plan', async (req, res) => {
  // const url = `${service}/transport_order/dispatch/plan_cancel/batch`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0});
});

//司机or供应商确认
api.post('/confirm_driver_or_supplier', async (req, res) => {
  // const url = `${service}/transport_order/dispatch/plan_cancel/batch`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0});
});

//撤消派单
api.post('/revoke_driver_or_supplier', async (req, res) => {
  // const url = `${service}/transport_order/dispatch/plan_cancel/batch`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0});
});

//获取供应商+自有司机档案下拉
api.post('/driver_drop_list', async (req, res) => {
  const url = `${host}/archiver-service/driver_info/select_drop_list_by_name`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//获取供应商+自有车辆档案下拉
api.post('/car_drop_list', async (req, res) => {
  const url = `${host}/archiver-service/car_info/select_drop_list_by_car_number`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
