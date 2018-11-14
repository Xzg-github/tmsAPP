import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';
const service = `${host}/mq-service`;
let api = express.Router();

const URL_LIST = `${service}/message_title_config/list`;
const URL_ADD = `${service}/message_title_config`;

// 获取界面信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取主列表数据
api.post('/list', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_LIST,postOption(null)));
});

// 新增
api.post('/add', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ADD, postOption(req.body)));
});

// 编辑
api.put('/add', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ADD, postOption(req.body,'put')));
});

// 删除
api.delete('/del/:id', async (req, res) => {
  const url = `${URL_ADD}/delete/id`;
  res.send(await fetchJsonByNode(req, url, postOption(req.params.id)));
});




export default api;
