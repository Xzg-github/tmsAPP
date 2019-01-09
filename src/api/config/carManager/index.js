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
  const url = `${service}/car_manager/list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//清空运单
api.post('/clear/:id', async (req, res) => {
  const url = `${service}/car_manager/clean/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url, 'post'));
});

//变更状态
api.post('/change', async (req, res) => {
  const url = `${service}/car_manager/change_state`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
