import express from 'express';
import {fetchJsonByNode, postOption} from "../../../common/common";
import {host} from '../../globalConfig';

let api = express.Router();
const service = `${host}/mq-service`;

// 获取界面信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result:module.default});
});

//获取消息订阅列表
api.get('/list', async (req, res) => {
  const url = `${service}/message_subscribe/list`;
  res.send(await fetchJsonByNode(req, url));
});

//取消消息订阅
api.delete('/delete/:guid', async(req,res) => {
  const url = `${service}/message_subscribe/batch`;
  res.send(await fetchJsonByNode(req, `${url}/${req.params.guid}`, postOption(req.body, 'delete')));
});

export default api;
