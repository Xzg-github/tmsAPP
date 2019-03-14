import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const maxNumber = 20;


const service = `${host}/tms-service`;

// 获取界面信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});


/*-------------列表增删改查-------------*/


// 获取主列表数据
api.post('/list', async (req, res) => {
  const url  = `${service}/receivable_month_bill/list/search`;
  const {filter,...others} = req.body;
  const body = {
    ...filter,...others
  };
  res.send(await fetchJsonByNode(req,url,postOption(body)));
});

//获取单条信息
api.get('/one/:id', async (req, res) => {
  const url = `${service}/receivable_month_bill/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url));
});

// 新增保存or编辑
api.post('/add', async (req, res) => {
  const url = `${service}/receivable_month_bill`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});

//批量删除
api.post('/delete', async (req, res) => {
  const url = `${service}/receivable_month_bill/batch`;
  res.send(await fetchJsonByNode(req, url,postOption(req.body, 'delete')));
});


//批量发送
api.post('/send', async (req, res) => {
  const url = `${service}/receivable_month_bill/send`;
  res.send(await fetchJsonByNode(req, url,postOption(req.body)));
});

//批量对账
api.post('/check', async (req, res) => {
  const url = `${service}/receivable_month_bill/reconciliation`;
  res.send(await fetchJsonByNode(req, url,postOption(req.body)));
});

//批量撤销
api.post('/cancel', async (req, res) => {
  const url = `${service}/receivable_month_bill/cancel`;
  res.send(await fetchJsonByNode(req, url,postOption(req.body)));
});



/*-------------结算单位-------------*/

// 获取结算单位
api.post('/settlement', async (req, res) => {
  const url = `${service}/transport_order/month_bill/list/search`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});

//加入结算单位（批量）
api.post('/addSettlement', async (req, res) => {
  const url = `${service}/receivable_month_bill_charge/batch`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});

//根据结算单位ID获取单条信息拿到币种
api.get('/customerId/:id', async (req, res) => {
  const url = `${host}/archiver-service/customer/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

//移除明细
api.delete('/del', async (req, res) => {
  const url = `${service}/receivable_month_bill_charge`;
  res.send(await fetchJsonByNode(req, url,postOption(req.body,'delete')));
});

// 删除明细
api.delete('/delList', async (req, res) => {
  const url = `${service}/receivable_month_bill`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body,'delete')));
});

//根据月帐单标识及应收结算单标识返回列表信息
api.get('/monthId/:id', async (req, res) => {
  const url = `${service}/receivable_month_bill/${req.params.id}/${req.query.filter}`;
  res.send(await fetchJsonByNode(req, url));
});

//应收月帐单加入对账明细
api.post('/joinSettlement', async (req, res) => {
  const url = `${service}/receivable_month_bill_charge`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});


/*-------------下拉-------------*/

// 获取币种
api.get('/currency', async (req, res) => {
  const body = {
    currencyTypeCode:req.query.filter,
    maxNumber
  };
  const url = `${host}/archiver-service/charge/tenant_currency_type/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(body)));
});

// 获取结算单位下拉(客户下拉)
api.get('/customer', async (req, res) => {
  const url = `${host}/archiver-service/customer/drop_list/enabled_type_enabled`;
  const body = {
    filter:req.query.filter,
    maxNumber
  };
  res.send(await fetchJsonByNode(req, url, postOption(body)));
});
export default api;
