import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();

const service = 'notify-center-service';

const URL_LIST = `${host}/${service}/sms/list/byUserId`;
const URL_GET = `${host}/${service}/sms/flow`;

// 获取界面信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result:module.default});
});

//获取主列表数据
api.post('/list', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(req.body)));
});

// 查询流水
api.get('/detail/:guid', async (req, res) => {
  const guid = req.params.guid;
  res.send(await fetchJsonByNode(req, `${URL_GET}/${guid}`, postOption(null, 'get')));
});

export default api;

