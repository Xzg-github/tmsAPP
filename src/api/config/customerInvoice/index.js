import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const service = 'archiver-service';

const URL_LIST = `${host}/${service}/CustomerInvoiceRequestDto/listByRelationId`;
const URL_DEL = `${host}/${service}/CustomerInvoiceRequestDto/delete`;

// 客户开票: 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 客户开票: 获取列表数据
api.post('/list', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(req.body)));
});

// 客户开票: 删除
api.delete('/', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_DEL, postOption(req.body)));
});

// 客户开票: 新增
api.post('/', async (req, res) => {
  const url = `${host}/${service}/CustomerInvoiceRequestDto/insert`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 客户开票: 编辑
api.put('/', async (req, res) => {
  const url = `${host}/${service}/CustomerInvoiceRequestDto/update`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

export default api;

