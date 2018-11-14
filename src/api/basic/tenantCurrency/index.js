import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const service = 'archiver-service';
const URL_LIST = `${host}/${service}/charge/tenant_currency_type/list`;
const URL_JOIN = `${host}/${service}/charge/tenant_currency_type/get_currency_type_code`;
const URL_SETUP = `${host}/${service}/charge/tenant_currency_type/update_main_currency/`;
const URL_KEEP = `${host}/${service}/charge/tenant_currency_type/insertList`;
const URL_DELETE = `${host}/${service}/charge/tenant_currency_type/delect_by_list`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取列表数据
api.post('/list', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(req.body)));
});

// 加入获取列表
api.get('/join', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_JOIN));
});

// 加入保存获取列表
api.post('/keep', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_KEEP, postOption(req.body)));
});


// 加入获取列表
api.post('/delete', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_DELETE, postOption(req.body)));
});

// 设置主币种获取列表
api.put('/set_up/:id', async (req, res) => {
  const id = req.params.id;
  res.send(await fetchJsonByNode(req, `${URL_SETUP}${id}`, postOption(req.body, 'put')));
});


export default api;
