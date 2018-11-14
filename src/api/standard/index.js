import express from 'express';
import {fetchSelect, fetchSelectBatch} from './select';
import {search} from './search';

const api = express.Router();

// 获取单个下拉列表
api.get('/select/:type', async (req, res) => {
  const result = await fetchSelect(req, req.params.type);
  res.send({result, returnCode: 0});
});

// 批量获取下拉列表
api.post('/select', async (req, res) => {
  const result = await fetchSelectBatch(req, req.body);
  res.send({result, returnCode: 0});
});

// 模糊搜索
api.get('/search/:type', async (req, res) => {
  res.send(await search(req, req.params.type, req.query.filter));
});

export default api;
