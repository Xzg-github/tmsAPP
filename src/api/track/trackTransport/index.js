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
  res.send({returnCode: 0, result: {data:[], returnTotalItem: 0}});
  // const url = `${service}/transport_order/in_transport/list/search`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// //获取收发货地点
// api.get('/address/:id', async (req, res) => {
//   const url = `${service}/transport_order_address/${req.params.id}`;
//   res.send(await fetchJsonByNode(req, url));
// });
//
// //位置更新
// api.post('/update', async (req, res) => {
//   const url = `${service}/transport_order/position`;
//   res.send(await fetchJsonByNode(req, url, postOption(req.body)));
// });

export default api;
