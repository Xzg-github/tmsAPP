import express from 'express';
import {host} from '../../globalConfig';
import {fetchJsonByNode, postOption, fetchGetObj} from '../../../common/common';

const reportService = `${host}/report-service`;

let api = express.Router();


// 根据模板代码返回报表列表
api.post('/getModeList', async (req, res) => {
  const url= `${reportService}/report/list/output`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

api.post('/sendmail', async (req, res) => {
  const url= `${reportService}/report/sendmail`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
