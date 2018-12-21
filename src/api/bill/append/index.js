import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

const service = `${host}/tms-service`;
let api = express.Router();

// 获取界面配置
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

//获取列表数据
api.post('/list', async (req, res) => {
  res.send({returnCode: 0, result: {data:[{orderNumber: '001'}], returnTotalItem: 1, tags:[{tag:'status_draft', count:1}, {tag:'status_submit_completed', count:1}]}});
  // const url = `${service}/transport_order/supplement/search`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//新增保存
api.post('/', async (req, res) => {
  res.send({returnCode: 0});
  // const url = `${service}/transport_order/supplement`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//新增提交
api.post('/commit', async (req, res) => {
  res.send({returnCode: 0});
  // const url = `${service}/transport_order/supplement/submit`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//编辑保存
api.put('/', async (req, res) => {
  res.send({returnCode: 0});
  // const url = `${service}/transport_order/supplement`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//编辑提交
api.put('/commit', async (req, res) => {
  res.send({returnCode: 0});
  // const url = `${service}/transport_order/supplement/submit`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//批量提交
api.post('/commit_batch', async (req, res) => {
  res.send({returnCode: 0});
  // const url = `${service}/transport_order/submit/batch`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//批量删除
api.delete('/del', async (req, res) => {
  res.send({returnCode: 0});
  // const url = `${service}/transport_order/supplement`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

export default api;
