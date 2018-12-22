import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host, maxSearchCount} from '../../globalConfig';

let api = express.Router();
const service = 'archiver-service';

const URL_LIST = `${host}/${service}/TenantBankDto/listByRelationId`;
const URL_DEL = `${host}/${service}/TenantBankDto/delete`;

// 银行档案: 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 银行档案: 获取列表数据
api.post('/list', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(req.body)));
});

// 银行档案: 删除
api.delete('/', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_DEL, postOption(req.body)));
});

// 银行档案: 新增
api.post('/', async (req, res) => {
  const url = `${host}/${service}/TenantBankDto/insert`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 银行档案: 编辑
api.put('/', async (req, res) => {
  const url = `${host}/${service}/TenantBankDto/update`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')))
});

api.get('/options/currency', async (req, res) => {
  const body = {
    currencyTypeCode: req.query.filter,
    maxNumber: maxSearchCount
  };
  const url = `${host}/${service}/charge/tenant_currency_type/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(body)));
});

export default api;
