import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();

const service = `${host}/tms-service`;

//获取页面配置信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

//获取OrderPage账单列表
api.post('/list', async (req, res) => {
  const url = `${service}/receivable_bill/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//获取AddDialog应收结算单列表
api.post('/income_list', async(req, res) => {
  const url = `${service}/receivable_bill/can_bill/search`;
  res.send(await fetchJsonByNode((req, url, postOption(req.body))));
});

//Adddialog 创建账单
api.post('/add', async(req, res) => {

});

//EditPage 获取单条账单数据
api.get('edit/:id', async (req, res) => {
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



export default api;
