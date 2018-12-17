import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();

const service = `${host}/tms-service-yule`;
const archiver_service = `${host}/archiver-service`;

//获取页面配置信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

//获取OrderPage账单列表
api.post('/list', async (req, res) => {
  const url = `${service}/receivable_bill/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//获取AddDialog应收结算单列表
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

api.post('/delete', async(req, res) => {
  const url = `${service}/receivable_bill/batch`;
  res.send(await fetchJsonByNode((req, url, postOption(req.body, 'delete'))));
  // res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

api.post('/auditBatch', async(req, res) => {
  const url = `${service}/receivable_bill/check`;
  res.send(await fetchJsonByNode((req, url, postOption(req.body))));
  // res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

//Adddialog 创建账单
api.post('/createBill', async(req, res) => {
  const url = `${service}/receivable_bill/batch`;
  res.send(await fetchJsonByNode((req, url, postOption(req.body))));
  // res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

//EditPage 获取单条账单数据
api.get('/detail/:id', async (req, res) => {
  const url = `${service}/receivable_bill/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

// 获取指定客户联系人
api.post('/cunstomer_contacts', async(req, res) => {
  const url = `${archiver_service}/customer_contact/${req.body.customerId}/drop_list/enabled_type_enabled`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取指定客户抬头信息（收发货人）
api.post('/consignee_consignor', async(req, res) => {
  const url = `${archiver_service}/consignee_consignor/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//EditPage 获取未出账单的费用明细
api.get('/joinList/:id', async (req, res) => {
  const url = `${service}/receivable_bill/unbilled/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

//EditPage 加入费用明细
api.post('/joinDetail', async (req, res) => {
  const url = `${service}/receivable_bill_charge/batch/${req.body.id}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//EditPage 移除费用明细
api.post('/removeDetail', async (req, res) => {
  const url = `${service}/receivable_bill_charge/batch/${req.body.id}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

//EditPage 保存
api.post('/save', async (req, res) => {
  const url = `${service}/receivable_bill_charge/batch/${req.body.id}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

//EditPage 发送
api.post('/send', async (req, res) => {
  const url = `${service}/receivable_bill_charge/batch/${req.body.id}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});


export default api;
