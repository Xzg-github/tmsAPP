import express from 'express';
import {host} from '../../globalConfig';
import {fetchJsonByNode, postOption} from '../../../common/common';

const reportService = `${host}/report_service`;

let api = express.Router();

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({
    returnCode: 0,
    result: module.default
  });
});

// 输出列表
api.get('/getModeTree', async (req, res) => {
  const url= `${reportService}/reportconfig/tree`;
  res.send(await fetchJsonByNode(req, url, 'get'));
});


// 获取数据源
api.post('/getDataSet', async (req, res) => {
  const url= `${reportService}/reportconfig/${req.body.type}/${req.body.id}`;
  res.send(await fetchJsonByNode(req, url, 'get'));
});

// 新增
api.post('/addData', async (req, res) => {
  const url= `${reportService}/reportconfig`;
  const {modeName, reportName, isOnlyMail,  outputType, reportTypeConfigId, content} = req.body;
  res.send(await fetchJsonByNode(req, url, postOption({modeName, reportName, isOnlyMail,  outputType, reportTypeConfigId, content})));
});

// 编辑
api.post('/saveData', async (req, res) => {
  const url= `${reportService}/reportconfig`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

api.post('/delData', async (req, res) => {
  const url= `${reportService}/reportconfig/${req.body.id}`;
  res.send(await fetchJsonByNode(req, url, 'delete'));
});

export default api;
