import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {searchAdapter} from '../../helper'
import {host} from '../../globalConfig';
const service = `${host}/auth-center-provider`;
let api = express.Router();

const URL_DEL = `${service}/controllerResource/delete`;

// 获取UI
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取列表数据
api.post('/list', async (req, res) => {
  const url = `${service}/controllerResource/listBySearch`;
  res.send(await fetchJsonByNode(req, url, postOption(searchAdapter(req.body))));
});

// 新增
api.post('/new', async (req, res) => {
  const url = `${service}/controllerResource/insert`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 编辑
api.post('/edit', async (req, res) => {
  const url = `${service}/controllerResource/update`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//删除
api.delete('/', async (req, res) => {
  const { ids } = req.query;
  res.send(await fetchJsonByNode(req, `${URL_DEL}?ids=${ids}`, 'delete'));
});

export default api;
