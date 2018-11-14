import express from 'express';
import { postOption, fetchJsonByNode } from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const service = 'integration_service';
const URL_TRANS_LIST = `${host}/${service}/apiGetLibrary/selectApiGetLibraries`;
const URL_STAN_LIST = `${host}/${service}/apiStandardLibrary/selectByCondition`;
const URL_TRANS_INSERT = `${host}/${service}/apiGetLibrary/insertApiGetLibrary`;
const URL_TRANS_UPDATE = `${host}/${service}/apiGetLibrary/updateApiGetLibrary`;
const URL_TRANS_DEL = `${host}/${service}/apiGetLibrary/deleteApiGetLibrary`;
const URL_STAN_INSERT = `${host}/${service}/apiStandardLibrary/insert`;
const URL_STAN_UPDATE = `${host}/${service}/apiStandardLibrary/update`;
const URL_STAN_DEL = `${host}/${service}/apiStandardLibrary/delete`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send(module.default);
});

//获取转换库主列表数据
api.post('/trans_list', async (req, res) => {
  const { filter, ...others } = req.body;
  let body = { ...filter, ...others };
  const data = await fetchJsonByNode(req, URL_TRANS_LIST, postOption(body));
  res.send(data);
});

//获取标准库主列表数据
api.post('/stan_list', async (req, res) => {
  const { filter, ...others } = req.body;
  let body = { ...filter, ...others };
  res.send(await fetchJsonByNode(req, URL_STAN_LIST, postOption(body)));
});

//新增转换库
api.post('/trans_insert', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_TRANS_INSERT, postOption(req.body)));
});

//编辑转换库
api.put('/trans_update', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_TRANS_UPDATE, postOption(req.body, 'put')));
});

//删除转换库
api.delete('/trans_del', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${URL_TRANS_DEL}?id=${req.query.id}`, postOption(null, 'delete')));
});

//新增标准库
api.post('/stan_insert', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_STAN_INSERT, postOption(req.body)));
});

//编辑标准库
api.put('/stan_update', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_STAN_UPDATE, postOption(req.body, 'put')));
});

//删除标准库
api.delete('/stan_del', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${URL_STAN_DEL}?id=${req.query.id}`, postOption(null, 'delete')));
});

export default api;
