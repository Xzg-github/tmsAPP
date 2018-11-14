import express from 'express';
import {fetchJsonByNode} from '../../common/common';
import {host} from '../globalConfig';
const service = `${host}/report_service`;
let api = express.Router();

// 获取待办列表
api.get('/todo', async (req, res) => {
  const url = `${service}/indexPage/todo/total`;
  res.send(await fetchJsonByNode(req, url));
});

// 获取统计数组
api.get('/chart/:type/:date', async (req, res) => {
  const url = `${service}/indexPage/total/chart/everyday/${req.params.type}/${req.params.date}`;
  res.send(await fetchJsonByNode(req, url));
});

export default api;
