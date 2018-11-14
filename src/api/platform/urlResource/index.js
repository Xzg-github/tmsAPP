import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {searchAdapter} from '../../helper';
import {host} from '../../globalConfig';
const service = `${host}/auth-center-provider`;
let api = express.Router();


// 获取UI
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取列表数据
api.post('/list', async (req, res) => {
  const url = `${service}/publicUrlResource/pageBySearch`;
  res.send(await fetchJsonByNode(req, url, postOption(searchAdapter(req.body))));
});

export default api;
