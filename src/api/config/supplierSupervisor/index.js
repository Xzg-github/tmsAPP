import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const service = `${host}/archiver-service`;
const URL_LIST = `${service}/supervisor_info/supplier_list/search`;
const URL_DEL = `${service}/supervisor_info/batch`;
const URL_SAVE = `${service}/supervisor_info`;
const URL_ALL_DRIVER = `${service}/driver_info/drop_list`;
const URL_ALL_SITE = `${service}/consignee_consignor/drop_list`;

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

// 新增/ 编辑
api.post('/save', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_SAVE, postOption(req.body)));
});

// 激活,失效
api.put('/active_or_inactive/:type', async (req, res) => {
  const url = `${service}/supervisor_info/batch/${req.params.type}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//删除
api.delete('/delete', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_DEL, postOption(req.body, 'delete')));
});

//获取司机
api.post('/all_driver', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ALL_DRIVER, postOption(req.body)));
});

//获取站点
api.post('/all_site', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ALL_SITE, postOption(req.body)));
});

export default api;

