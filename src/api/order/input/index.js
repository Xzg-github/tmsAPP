import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host, maxSearchCount} from '../../globalConfig';

const service = `${host}/tms-service`;
let api = express.Router();

// 获取运单界面配置
api.get('/orderInfoConfig', async (req, res) => {
  const module = await require('./orderInfoConfig');
  const config = module.default;
  //运单其他信息配置
  let data = await fetchJsonByNode(req, `${host}/archiver-service/table_extend_property_config/config/transport_order_property`);
  if (data.returnCode !== 0) return res.send(data);
  if (data.result.controls && data.result.controls.length > 0) {
    config.formSections.otherInfo = {key: 'otherInfo', title: '其他信息', controls: data.result.controls};
  }
  //运单货物明细扩展信息配置
  data = await fetchJsonByNode(req, `${host}/archiver-service/table_extend_property_config/config/transport_order_goods_property`);
  if (data.returnCode !== 0) return res.send(data);
  let goodsTable = {...config.goodsTable};
  if (data.result.controls && data.result.controls.length > 0) {
    goodsTable.cols = config.goodsTable.cols.concat(data.result.controls);
  }
  res.send({returnCode: 0, result: {...config, goodsTable}});
});

//新增保存运单
api.post('/', async (req, res) => {
  const url = `${service}/transport_order`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//编辑保存运单
api.put('/', async (req, res) => {
  const url = `${service}/transport_order`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//新增提交运单
api.post('/commit', async (req, res) => {
  const url = `${service}/transport_order/submit`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//编辑提交运单
api.put('/commit', async (req, res) => {
  const url = `${service}/transport_order/submit`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//根据id获取运单信息
api.get('/info/:id', async (req, res) => {
  const url = `${service}/transport_order/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

//根据客户id获取客户联系人下拉
api.get('/options/customer_contacts', async (req, res) => {
  const url = `${host}/archiver-service/customer_contact/${req.query.filter}/drop_list/enabled_type_enabled`;
  res.send(await fetchJsonByNode(req, url, 'post'));
});

//根据供应商id获取供应商司机下拉
api.get('/options/supplier_drivers', async (req, res) => {
  const url = `${host}/archiver-service/driver_info/drop_list`;
  const body = {
    supplierId: req.query.filter,
    isOwner: req.query.isOwner,
    driverName: req.query.driverName,
    maxNumber: maxSearchCount,
    enabledType: 'enabled_type_enabled'
  };
  res.send(await fetchJsonByNode(req, url, postOption(body)));
});

//获取指定客户收发货人下拉列表
api.post('/customer_factory_drop_list', async (req, res) => {
  const url = `${host}/archiver-service/consignee_consignor/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//根据id获取客户收发货人信息
api.get('/customer_factory_info/:id', async (req, res) => {
  const url = `${host}/archiver-service/consignee_consignor/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

//根据客户id和运输类型获取客服
api.get('/customer_service_info/:customerId/:businessType', async (req, res) => {
  const url = `${host}/archiver-service/customer/care/${req.params.customerId}/${req.params.businessType}`;
  res.send(await fetchJsonByNode(req, url));
});

//根据客户id获取客户默认联系人信息
api.get('/customer_default_contact/:customerId', async (req, res) => {
  const url = `${host}/archiver-service/customer_contact/default/${req.params.customerId}`;
  res.send(await fetchJsonByNode(req, url));
});

//根据客户id获取客户信息
api.get('/customer_info/:customerId', async (req, res) => {
  const url = `${host}/archiver-service/customer/${req.params.customerId}`;
  res.send(await fetchJsonByNode(req, url));
});

//根据客户联系人id获取客户联系人信息
api.get('/customer_contact_info/:id', async (req, res) => {
  const url = `${host}/archiver-service/customer_contact/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

//计费地点下拉-暂使用所有行政区下拉接口
api.post('/charge_place_options', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${host}/archiver-service/archiver/district/drop_list`, postOption(req.body)));
});

export default api;
