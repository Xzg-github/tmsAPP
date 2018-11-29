import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const service = `${host}/archiver-service`;
const URL_LIST = `${service}/supervisor_info/list/search`;

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

export default api;

