import express from 'express';
import {postOption, fetchJsonByNode, getJsonResult} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();

const service = `${host}/tms-service`;
const archiver_service = `${host}/archiver-service`;

api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

api.post('/list', async (req, res) => {
  const url = `${service}/receivable_bill/search`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: {data: [{
    id: 1,
    'receivableInvoiceSysnumber': '000001',
    'orderNumber': '1111111',
    'customerDelegateCode': '222222',
    'customerId': {'value': 'b2b3f754-380e-4359-a45c-a803e00eb897', 'title': '云恋科技有限公司'},
    'incomeTag': 0,
    'statusType': 'status_draft',
    'receivableBillAmount': 100,
    'planPickupTime': '2018-12-12',
    'customerDelegateTime': '2018-12-12'
  },{
    'receivableInvoiceSysnumber': '000002',
    'orderNumber': '333333',
    'customerDelegateCode': '44444',
    'customerId': {'value': 'b2b3f754-380e-4359-a45c-a803e00eb897', 'title': '云恋科技有限公司'},
    'incomeTag': 0,
    'statusType': 'status_handling_awaiting',
    'receivableBillAmount': 100,
    'planPickupTime': '2018-12-12',
    'customerDelegateTime': '2018-12-12'
  },{
    'receivableInvoiceSysnumber': '000003',
    'orderNumber': '55555',
    'customerDelegateCode': '6666',
    'customerId': {'value': 'b2b3f754-380e-4359-a45c-a803e00eb897', 'title': '云恋科技有限公司'},
    'incomeTag': 0,
    'statusType': 'status_handling_completed',
    'receivableBillAmount': 100,
    'planPickupTime': '2018-12-12',
    'customerDelegateTime': '2018-12-12'
  }], returnTotalItem: 100}, returnMsg: 'Success'});
});

api.post('/income_list', async(req, res) => {
  const url = `${service}/receivable_bill/can_bill/search`;
  // res.send(await fetchJsonByNode((req, url, postOption(req.body))));
  res.send({returnCode: 0, result: {data: [{
    'orderNumber': '1111111',
    'customerDelegateCode': '222222',
    'customerId': {'value': 'b2b3f754-380e-4359-a45c-a803e00eb897', 'title': '云恋科技有限公司'},
    'incomeTag': 0,
    'statusType': 'status_customer_order_completed',
    'receivableBillAmount': 100,
    'planPickupTime': '2018-12-12',
    'customerDelegateTime': '2018-12-12'
  }], returnTotalItem: 100}, returnMsg: 'Success'});
});

api.post('/addApply', async(req, res) => {
  const url = `${service}/receivable_bill/batch`;
  // res.send(await fetchJsonByNode((req, url, postOption(req.body))));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

api.post('/delete', async(req, res) => {
  const url = `${service}/receivable_bill/batch`;
  // res.send(await fetchJsonByNode((req, url, postOption(req.body, 'delete'))));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

api.post('/commit', async(req, res) => {
  const url = `${service}/receivable_bill/check`;
  // res.send(await fetchJsonByNode((req, url, postOption(req.body))));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

api.post('/revoke', async(req, res) => {
  const url = `${service}/receivable_bill/check`;
  // res.send(await fetchJsonByNode((req, url, postOption(req.body))));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

api.post('/accept', async(req, res) => {
  const url = `${service}/receivable_bill/check`;
  // res.send(await fetchJsonByNode((req, url, postOption(req.body))));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

api.post('/invoice', async(req, res) => {
  const url = `${service}/receivable_bill/check`;
  // res.send(await fetchJsonByNode((req, url, postOption(req.body))));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

api.get('/detail/:id', async (req, res) => {
  const url = `${service}/receivable_bill/${req.params.id}`;
  // res.send(await fetchJsonByNode(req, url));
  res.send({returnCode: 0, result: {
    invoiceInfo:  [{
      goodsName: 'aaaa',
      chargeName: 'aaaaa',
      price: 1,
      itemCount: 1,
      tax: 1,
      taxAmount: 1.11,
      netAmount: 1.11,
      currency: 'ERP',
      exchangeCurrency: 'ERP',
      exchangeAmount: 1.11,
      remark: 'asas'
    }],
    currencyList: [
      {title: 'ERP', value: 'ERP'},
      {title: 'USD', value: 'USD'},
      {title: 'CAD', value: 'CAD'}
    ]
  }, returnMsg: 'Success'});
});

// 开户行下拉
api.post('/receivable_openingBank', async(req, res) => {
  const url = `${archiver_service}/TenantCorporateInfoDto/listByRelationId`;
  const params = {
    corporateName: req.body.filter,
    itemFrom: 0,
    itemTo: req.body.maxNumber
  };
  const data = getJsonResult(await fetchJsonByNode(req, url, postOption(params)));
  res.send({returnCode: 0, returnMsg: 'Success', result: data.data.map(o => {
    o.title = o.corporateName;
    o.value = o.id;
    return o;
  })});
});

api.post('/invoiceHeaderInfo', async(req, res) => {
  const url = `${archiver_service}/CustomerInvoiceRequestDto/listByRelationId`;
  const params = {
    invoiceHeaderInformation: req.body.filter,
    itemFrom: 0,
    itemTo: req.body.maxNumber
  };
  const data = getJsonResult(await fetchJsonByNode(req, url, postOption(params)));
  res.send({returnCode: 0, returnMsg: 'Success', result: data.data.map(o => {
    o.title = o.invoiceHeaderInformation;
    o.value = o.id;
    return o;
  })});
});

// 获取费用信息可加入列表
api.post('/joinList', async (req, res) => {
  const url = `${service}/receivable_invoice/can_join/search`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({"returnCode":0,"errorCode":"0","returnMsg":"操作成功","result": {
    data: [{"id":741,"incomeCode":"org-R-171206-0008","customerId":{"value":"0f4bc6df-9ddd-47c9-8580-bc9cfb8edfd2","title":"沃尔玛"},"billNumber":"org-RDB-180628-0002","logisticsOrderNumber":"org-LO-171206-0011","chargeGuid":{"value":"f76ebd547c41464b9b979a223ae7515f","title":"运费test"},"price":234,"chargeMeasureUnitGuid":"charge_unit_158","chargeNum":234,"amount":54756,"currencyTypeCode":"CNY","exchangeRate":1,"tax":7,"taxAmount":3582.17,"netAmount":51173.83}], returnTotalItem: 100
  }});
});

// 加入费用信息
api.post('/joinDetail', async (req, res) => {
  const url = `${service}/receivable_bill_charge/batch/${req.body.id}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

// 移除费用信息
api.post('/removeDetail', async (req, res) => {
  const url = `${service}/receivable_bill_charge/batch/${req.body.id}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

api.post('/save', async (req, res) => {
  const url = `${service}/receivable_bill_charge/batch/${req.body.id}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

api.post('/send', async (req, res) => {
  const url = `${service}/receivable_bill_charge/batch/${req.body.id}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});


export default api;
