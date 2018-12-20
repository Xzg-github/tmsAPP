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
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: {data: [
    {
      id: 1,
      'statusType': 'status_settle_lawsuit_awaiting',
      'extraChargeNumber': '000000001',
      'orderNumber': '001',
      'customerId': {value: 'aaa', title: 'aaa'},
      'supplierId': {value: 'bbb', title: 'bbb'},
      'customerServiceId': {value: 'aaa', title: 'aaa'},
      'customerDelegateCode': 'aaaaaaaaaaa',
      'customerDelegateTime': '2018-12-19',
      // 'chargeFrom': 'charge_from_edi',
      'occurrenceClass': 'occurrence_class_001',
      'responsibleParty': 'responsible_party_customer',
      'customerPayIntention': 'customer_pay_intention_001',
      'description': '11212',
      'actualOccurrenceClass': 'occurrence_class_002',
      'actualResponsibleParty': 'responsible_party_customer_service',
      'settleLawsuitUser': {value: 'aaa', title: 'aaa'},
      'settleLawsuitTime': '2018-12-19',
      'receiveAmount': 100,
      'payAmount': 20,
      'profitAmount': 80,
      'payCheckUser': {value: 'aaa', title: 'aaa'},
      'receiveCheckTime': '2018-12-19',
      'approvalUser': {value: 'bbb', title: 'bbb'},
      'approvalTime': '2018-12-19',
      'fallbackRemark': 'sahsaihsoia',
      'waitCheckUser': {value: 'aaa', title: 'aaa'},
      'insertUser': {value: 'bbb', title: 'bbb'},
      'insertTime': '2018-12-19',
      'updateUser': {value: 'aaa', title: 'aaa'},
      'updateTime': '2018-12-19',
    }
  ], returnTotalItem: 100}});
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

// 获取单条记录的详细信息
api.get('/detail/:id', async (req, res) => {
  const url = `${tms_service}/extra_charge/${req.params.id}`;
  // res.send(await fetchJsonByNode(req, url));
  res.send({returnCode: 0, result: {
    'transportOrderId': '001',
    'occurrenceClass': 'occurrence_class_001',
    'responsibleParty': 'responsible_party_customer',
    'customerPayIntention': 'customer_pay_intention_001',
    'description': '11212',
    'payChargeList': [{
      'supplierId': {value: 'aaa', title: 'aaa'},
      'chargeItemId': {value: 'aaa', title: 'aaa'},
      'chargeUnit': {value: 'aaa', title: 'aaa'},
      'price': 1,
      'number': 2,
      'amount': 3,
      'currency': {value: "EUR", title: "EUR"},
      'exchangeRate': 4,
      'tax': 5,
      'statusType': 'status_submit_awaiting',
    }],
    'receiveChargeList': [{
      'supplierId': {value: 'aaa', title: 'aaa'},
      'chargeItemId': {value: 'aaa', title: 'aaa'},
      'chargeUnit': {value: 'aaa', title: 'aaa'},
      'price': 1,
      'number': 2,
      'amount': 3,
      'currency': {value: "EUR", title: "EUR"},
      'exchangeRate': 4,
      'tax': 5,
      'statusType': 'status_submit_awaiting',
    }]
  }});
});

// 保存
api.post('/save', async (req, res) => {
  const url = `${tms_service}/receivable_bill`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

// 提交
api.post('/commit', async (req, res) => {
  const url = `${tms_service}/receivable_bill_charge/batch/${req.body.id}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

// 回退
api.post('/fallback', async (req, res) => {
  const url = `${tms_service}/receivable_bill_charge/batch/${req.body.id}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

// 审核
api.post('/review', async (req, res) => {
  const url = `${tms_service}/receivable_bill_charge/batch/${req.body.id}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

// 结案
api.post('/endCase', async (req, res) => {
  const url = `${tms_service}/receivable_bill_charge/batch/${req.body.id}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});


export default api;
