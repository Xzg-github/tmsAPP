import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {host} from '../../globalConfig';
const tms_service = `${host}/tms-service-he`;
const archiver_service = `${host}/archiver-service`;
let api = express.Router();

// 获取UI标签
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

// 获取列表
api.post('/list', async (req, res) => {
  const url = `${tms_service}/extra_charge/list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取币种下拉
api.post('/currency', async (req, res) => {
  const url = `${archiver_service}/charge/tenant_currency_type/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取费用名称下拉
api.post('/chargeItemId', async (req, res) => {
  const url = `${archiver_service}/charge_item/drop_list/enabled_type_enabled`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 运单号下拉(0:待审核)
api.post('/transportOrderId', async (req, res) => {
  const url = `${tms_service}/transport_order/income/drop_list/0`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 批量删除
api.post('/delete', async (req, res) => {
  const url = `${tms_service}/extra_charge/delete`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

// 获取单条记录的详细信息
api.get('/detail/:id', async (req, res) => {
  const url = `${tms_service}/extra_charge/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

// 保存
api.post('/save', async (req, res) => {
  let url = `${tms_service}/extra_charge`;
  let method = 'post';
  // type: 0:新增, 1:编辑, 2:编辑（费用来源不为空（外部系统接入））
  const {type=0, ...body} = req.body;
  switch (type) {
    case 1: {
      method = 'put';
      break;
    }
    case 2: {
      method = 'put';
      url = `${tms_service}/extra_charge/external`;
      break;
    }
  }
  res.send(await fetchJsonByNode(req, url, postOption(body, method)));
});

// 提交
api.post('/commit', async (req, res) => {
  let url = `${tms_service}/extra_charge/submit`;
  let method = 'put';
  // type: 0:新增、编辑（待提交） 1:编辑（应收待提交）, 2:编辑（费用来源不为空（外部系统接入））
  const {type=0, ...body} = req.body;
  switch (type) {
    case 1: {
      method = 'post';
      url = `${tms_service}/extra_charge/receive/submit`;
      break;
    }
    case 2: {
      method = 'post';
      url = `${tms_service}/extra_charge/external`;
      break;
    }
  }
  res.send(await fetchJsonByNode(req, url, postOption(body, method)));
});

// 审核/回退
api.post('/review', async (req, res) => {
  const url = `${tms_service}/extra_charge/approval`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 结案
api.post('/endCase', async (req, res) => {
  const url = `${tms_service}/extra_charge/settle_lawsuit`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});


export default api;
