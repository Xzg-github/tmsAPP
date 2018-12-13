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
  // res.send({returnCode: 0, result: {data: [
  //   {
  //     'statusType': 'status_check_awaiting',
  //     'billNumber': '00001',
  //     'orderNumber': '00001',
  //     'payCustomerId': {'value': 'b2b3f754-380e-4359-a45c-a803e00eb897', 'title': '云恋科技有限公司'},
  //     'customerId': {'value': 'aec3b495-4119-4d36-921a-1859159bd5dc', 'title': '深圳景田百岁山'},
  //     'customerServiceId': {'value': "06f3f9ef-b8a2-402d-81ca-774bbf35e867", 'title': "黄嘉军"},
  //     'customerDelegateCode': '00001',
  //     'customerDelegateTime': '2018-12-12',
  //     'customerHeaderInformation': '客户抬头',
  //     'currency': 'CNY',
  //     'customerContact': 'ycc',
  //     'customerContactPhone': '123456',
  //     'customerContactFax': '123456',
  //     'amount': '12',
  //     'taxAmount': '12',
  //     'fallbackReason': '描述不符，五星差评',
  //     'fallbackTime': '2018-12-12',
  //     'fallbackUser': {'value': '-1', 'title': '肖强'},
  //     'insertTime': '2018-12-12',
  //     'insertUser': {'value': '-1', 'title': '肖强'},
  //     'updateTime': '2018-12-12',
  //     'updateUser': {'value': '-1', 'title': '肖强'}
  //   }
  // ], returnTotalItem: 100}, returnMsg: 'Success'});
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
  const url = `${service}/receivable_bill/delete`;
  // res.send(await fetchJsonByNode((req, url, postOption(req.body))));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

api.post('/auditBatch', async(req, res) => {
  const url = `${service}/receivable_bill/auditBatch`;
  // res.send(await fetchJsonByNode((req, url, postOption(req.body))));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

//Adddialog 创建账单
api.post('/createBill', async(req, res) => {
  const url = `${service}/receivable_bill/createBill`;
  // res.send(await fetchJsonByNode((req, url, postOption(req.body))));
  res.send({returnCode: 0, result: 'Success', returnMsg: 'Success'});
});

//EditPage 获取单条账单数据
api.get('/detail/:id', async (req, res) => {
  const url = `${service}/receivable_bill/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

//EditPage 获取付款单位下拉
api.get('/customerName/:customer_id', async (req, res) => {

});

//EditPage 获取未出账单的费用明细
api.get('/unbilled/:receivable_bill_id', async (req, res) => {

});

//EditPage 移除费用明细
api.delete('/deleteDetail', async (req, res) => {
  const url = `${service}/receivable_bill_charge/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
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


export default api;
