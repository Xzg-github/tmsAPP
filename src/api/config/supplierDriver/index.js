import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const service = `${host}/archiver-service`;
const URL_LIST = `${service}/driver_info/supplier_list/search`;
const URL_DEL = `${service}/driver_info/batch`;
const URL_SAVE = `${service}/driver_info`;
const URL_ALL_SUPPLIER = `${service}/supplier/drop_list`;
const URL_ACTIVE_SUPPLIER = `${service}/supplier/drop_list/enabled_type_enabled`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send(module.default);
});

//获取主列表数据
api.post('/list', async (req, res) => {
  const data = await fetchJsonByNode(req, URL_LIST, postOption(req.body));
  res.send(data);
});

//获取所有供应商
api.post('/all_supplier', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ALL_SUPPLIER, postOption(req.body)));
});

//获取激活供应商
api.post('/active_supplier', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ACTIVE_SUPPLIER, postOption(req.body)));
});

// 新增/ 编辑
api.post('/save', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_SAVE, postOption(req.body)));
});

// 激活,失效
api.put('/active_or_inactive/:type', async (req, res) => {
  const url = `${service}/driver_info/batch/${req.params.type}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//删除
api.delete('/delete', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_DEL, postOption(req.body, 'delete')));
});

export default api;

