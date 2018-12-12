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
  const url = `${service}/transport_order/dispatch/pending_task_list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//智能派单
api.post('/auto_dispatch', async (req, res) => {
  const url = `${service}/transport_order/dispatch/intelligence/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//确认计划
api.post('/confirm_plan', async (req, res) => {
  const url = `${service}/transport_order/dispatch/plan_confirm/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//撤消计划
api.post('/revoke_plan', async (req, res) => {
  const url = `${service}/transport_order/dispatch/plan_cancel/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//司机确认
api.post('/confirm_driver', async (req, res) => {
  const url = `${service}/transport_order/dispatch/confirm`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//供应商确认
api.post('/confirm_supplier', async (req, res) => {
  const url = `${service}/transport_order/dispatch/supplier_confirm/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//撤消派单
api.post('/revoke_driver_or_supplier', async (req, res) => {
  const url = `${service}/transport_order/dispatch/cancel_confirm`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//获取人工派车列表数据
api.post('/driver_list', async (req, res) => {
  const url = `${service}/car_manager/select_list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//人工派车
api.post('/dispatch_driver', async (req, res) => {
  const url = `${service}/transport_order/dispatch/car`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//获取人工派供应商列表数据
api.post('/supplier_list', async (req, res) => {
  const url = `${host}/archiver-service/supplier/trailer/select/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//人工派供应商
api.post('/dispatch_supplier', async (req, res) => {
  const url = `${service}/transport_order/dispatch/supplier`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
