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
  const url = `${service}/receivable_invoice/list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取可用新增开票列表
api.post('/income_list', async(req, res) => {
  const url = `${service}/receivable_invoice/open/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 新增
api.post('/addApply', async(req, res) => {
  const url = `${service}/receivable_invoice/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 删除
api.post('/delete', async(req, res) => {
  const url = `${service}/receivable_invoice/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

// 提交
api.post('/commit', async(req, res) => {
  const url = `${service}/receivable_invoice/submit/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 撤销
api.post('/revoke', async(req, res) => {
  const url = `${service}/receivable_invoice/cancel/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 受理
api.post('/accept', async(req, res) => {
  const url = `${service}/receivable_invoice/confirm/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 开票
api.post('/invoice', async(req, res) => {
  const url = `${service}/receivable_invoice/open_invoice/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 获取编辑界面详细信息
api.get('/detail/:id', async (req, res) => {
  const url = `${service}/receivable_invoice/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

// 开户行下拉
api.post('/receivable_openingBank', async(req, res) => {
  const url = `${archiver_service}/TenantBankDto/listByRelationId`;
  const {filter, maxNumber, institutionId} = req.body;
  const params = {
    accountNumber: filter,
    itemFrom: 0,
    itemTo: maxNumber
  };
  const data = getJsonResult(await fetchJsonByNode(req, url, postOption(params)));
  res.send({returnCode: 0, returnMsg: 'Success', result: data.data.filter(o => {
    // 根据法人主体做过滤
    const id = o.tenantInstitutionId;
    return typeof institutionId === 'object' ? id.value === institutionId.value : id.title === institutionId || id.value === institutionId;
  }).map(o => {
    o.title = o.openingBank || '';
    o.value = o.id;
    return o;
  })});
});

// 发票抬头下拉
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

// 获取折合币种及汇率
api.get('/currencyRate/:currency', async (req, res) => {
  const url = `${archiver_service}/currency_type_rate/exchange_currency_rates/${req.params.currency}`;
  res.send(await fetchJsonByNode(req, url));
});

// 获取费用信息可加入列表(加载弹框时的默认请求)
api.get('/joinListById/:id', async (req, res) => {
  const url = `${service}/receivable_invoice/can_join/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

// 获取费用信息可加入列表(点击搜索的请求)
api.post('/joinList', async (req, res) => {
  const url = `${service}/receivable_invoice/can_join/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 加入费用信息
api.post('/joinDetail', async (req, res) => {
  const url = `${service}/receivable_invoice/join/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 移除费用信息
api.post('/removeDetail', async (req, res) => {
  const url = `${service}/receivable_invoice/remove/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 变更汇率
api.post('/changeRate', async (req, res) => {
  const url = `${service}/receivable_invoice/change_rate/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 发票内容更新
api.post('/updateInvoice', async (req, res) => {
  const url = `${service}/receivable_invoice/change_content`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 保存
api.post('/save', async (req, res) => {
  const url = `${service}/receivable_invoice`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 提交
api.post('/submit', async (req, res) => {
  const url = `${service}/receivable_invoice/submit`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 获取法人主体下拉
api.post('/institutionId', async (req, res) => {
  const url = `${host}/tenant-service/institution/legal_person/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});


export default api;
