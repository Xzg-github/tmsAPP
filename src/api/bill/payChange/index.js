import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';
import {search} from "../../helper";

const service = `${host}/tms-service`;
const archiver_service = `${host}/archiver-service`;
const tenant_service = `${host}/tenant_service`;
const charge_direction = 1;

let api = express.Router();

//获取Config信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 自定义表单字段
api.get('/custom_config/:code', async (req, res) => {
  const url = `${archiver_service}/table_extend_property_config/config/${req.params.code}`;
  const config = await fetchJsonByNode(req, url);
  config.result.controls = config.result.controls || [];
  res.send(config);
});


//获取列表
api.post('/list', async (req, res) => {
  const url = `${service}/renewal/${charge_direction}/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//获取单条记录的详细信息
api.get('/detail/:id', async (req, res) => {
  const url = `${service}/renewal/${charge_direction}/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

// 获取币种下拉
api.post('/currency', async (req, res) => {
  const url = `${archiver_service}/charge/tenant_currency_type/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取客户下拉
api.post('/customerId', async (req, res) => {
  const url = `${archiver_service}/customer/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取供应商下拉
api.post('/supplierId', async (req, res) => {
  const url = `${archiver_service}/supplier/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取客服人员下拉
api.post('/customerServiceId', async (req, res) => {
  const url = `${tenant_service}/user/name/search`;
  res.send(await search(req, url, 'username', req.body.filter));
});

//批量撤销提交
api.post('/revoke', async (req, res) => {
  const url = `${service}/renewal/${charge_direction}/cancel/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//批量删除待提交
api.post('/delete', async (req, res) => {
  const url = `${service}/renewal/${charge_direction}/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

//获取运单号
api.post('/searchTransportOrderNum', async (req, res) => {
  const url = `${service}/transport_order/cost/drop_list/2`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//根据运单号获取EditPage onChange事件联动需要的信息
api.get('/transportInfo/:id', async (req, res) => {
  const url = `${service}/renewal/${charge_direction}/transport_order/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

//新增 保存
api.post('/addSave', async (req, res) => {
  const url = `${service}/renewal/${charge_direction}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//编辑 保存
api.put('editSave', async (req, res) => {
  const url = `${service}/renewal/${charge_direction}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//提交
api.post('/commit', async (req, res) => {
  const url = `${service}/renewal/${charge_direction}/submit`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//审核查看
api.get('/check/:id', async (req, res) => {
  const url = `${service}/renewal/${charge_direction}/check/view/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

//审核
api.put('/audit/:id', async (req, res) => {
  const url = `${service}/renewal/${charge_direction}/check/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url, 'put'));
});

//审核不通过
api.put('/reject', async (req, res) => {
  const url = `${service}/renewal/${charge_direction}/check/disagree`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//根据客户ID获取币种
api.get('/mainCurrency/:id', async (req, res) => {
  const url = `${archiver_service}/supplier/${req.params.id}`;
  const data = await fetchJsonByNode(req, url);
  if (data.returnCode === 0) {
    data.result = data.result['balanceCurrency'];
  }
  res.send(data);
});

export default api;
