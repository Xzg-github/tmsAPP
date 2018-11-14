import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();

const service = 'archiver-service';
const URL_LIST = `${host}/${service}/currency_type/selectByRelationId`;
const URL_ADD_KEEP = `${host}/${service}/currency_type/insert`;
const URL_EDIT_KEEP = `${host}/${service}/currency_type/update`;
const URL_DELETE = `${host}/${service}/currency_type/deleteByIdList`;
const URL_ACTIVE = `${host}/${service}/currency_type/tenant_currency_type/`;


// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取列表数据
api.post('/list', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(req.body)));
});


// 新增
api.post('/save', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ADD_KEEP, postOption(req.body)));
});

// 编辑
api.put('/save', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_EDIT_KEEP, postOption(req.body, 'put')));
});

// 激活
api.put('/active/:currencyTypeCode', async (req, res) => {
  const currencyTypeCode = req.params.currencyTypeCode;
  res.send(await fetchJsonByNode(req,`${URL_ACTIVE}/${currencyTypeCode}`, postOption(req.body, 'put')));
});

// 档案：删除
api.post('/delete', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_DELETE, postOption(req.body)));
});

export default api;

