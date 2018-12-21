import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
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

  }, returnMsg: 'Success'});
});












api.post('/cunstomer_contacts', async(req, res) => {
  const url = `${archiver_service}/customer_contact/${req.body.customerId}/drop_list/enabled_type_enabled`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

api.post('/consignee_consignor', async(req, res) => {
  const url = `${archiver_service}/consignee_consignor/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

api.get('/joinList/:id', async (req, res) => {
  const url = `${service}/receivable_bill/unbilled/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

api.post('/joinDetail', async (req, res) => {
  const url = `${service}/receivable_bill_charge/batch/${req.body.id}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

api.post('/removeDetail', async (req, res) => {
  const url = `${service}/receivable_bill_charge/batch/${req.body.id}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
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
