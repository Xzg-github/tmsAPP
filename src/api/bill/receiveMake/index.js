import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {host} from '../../globalConfig';
import  {search} from "../../helper";
const tms_service = `${host}/tms-service`;
const archiver_service = `${host}/archiver-service`;
const tenant_service = `${host}/tenant_service`;
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
  const url = `${tms_service}/transport_order/income/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取币种下拉
api.post('/currency', async (req, res) => {
  const url = `${archiver_service}/charge/tenant_currency_type/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取主币种
api.get('/currencyTypeCode', async (req, res) => {
  const url = `${archiver_service}/charge/tenant_currency_type/main_currency`;
  res.send(await fetchJsonByNode(req, url));
});

// 根据委托客户获取结算单位币种
api.get('/customerCurrency/:id', async (req, res) => {
  const url = `${archiver_service}/customer/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

// 获取客户下拉
api.post('/customerId', async (req, res) => {
  const url = `${archiver_service}/customer/drop_list/enabled_type_enabled`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取客服人员下拉
api.post('/customerServiceId', async (req, res) => {
  const url = `${tenant_service}/user/name/search`;
  res.send(await search(req, url, 'username', req.body.filter));
});

// 获取车型下拉
api.post('/carModeId', async (req, res) => {
  const url = `${archiver_service}/car_mode/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取始发地、目的地下拉
api.post('/departureDestination', async (req, res) => {
  const url = `${archiver_service}/archiver/district/drop_list`;
  const params = {...req.body, districtName: req.body.filter};
  res.send(await fetchJsonByNode(req, url, postOption(params)));
});

// 获取单条记录的详细信息
api.get('/detail/:id', async (req, res) => {
  const url = `${tms_service}/transport_order/income_and_cost/details/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

// 获取汇总信息
api.get('/total/:id/:currency', async (req, res) => {
  const url = `${tms_service}/transport_order/income/count/amount/${req.params.id}/${req.params.currency}`;
  res.send(await fetchJsonByNode(req, url));
});

// 获取费用名称下拉
api.post('/chargeItemId', async (req, res) => {
  const url = `${archiver_service}/charge_item/drop_list/enabled_type_enabled`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 整审（批量）
api.post('/auditBatch', async (req, res) => {
  const url = `${tms_service}/transport_order/income/check/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 整审检查
api.post('/auditCheck', async (req, res) => {
  const url = `${tms_service}/transport_order/income/check/preparing`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 应收明细批量新增
api.post('/batchAdd', async (req, res) => {
  const url = `${tms_service}/transport_order/income/details/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 应收明细批量编辑
api.post('/batchEdit', async (req, res) => {
  const url = `${tms_service}/transport_order/income/details/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 应收明细表格批量删除
api.post('/batchDelete', async (req, res) => {
  const url = `${tms_service}/transport_order/income/details/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

// 应收明细表格批量审核
api.post('/batchAudit', async (req, res) => {
  const url = `${tms_service}/transport_order/income/details/check/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 应收明细表格冲账
api.post('/strikeBalance/:id', async (req, res) => {
  const url = `${tms_service}/transport_order/income/detail/cancel/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url, 'put'));
});

// 应收明细表格自动计费
api.post('/autoBilling/:id', async (req, res) => {
  const url = `${tms_service}/income/income_details/auto/${req.params.id}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: 'Success', returnMsg: '自动计费成功！'});
});

// 获取费用项
api.get('/getCost/:id', async (req, res) => {
  const url = `${archiver_service}/customer_charge_item/custom/charge_items/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});


export default api;
