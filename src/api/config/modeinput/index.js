import express from 'express';
import { fetchJsonByNode, postOption } from '../../../common/common';
import { host } from '../../globalConfig';

const service = 'integration_service';
const URL_LIST = `${host}/${service}/excelModelConfig/listExcelModelByTenantIdModelTypeCode`;

const URL_UP = `${host}/${service}/excelModel/importExcelContent`;
const URL_DOWN = `${host}/${service}/excelModelConfig/getUrl`;

let api = express.Router();

// 根据模板代码返回报表列表
api.get('/list', async (req, res) => {
  const data = await fetchJsonByNode(req, `${URL_LIST}?modelTypeCode=${req.query.modelTypeCode}`);
  res.send(data);
});

// 上传
api.post('/up', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${URL_UP}?id=${req.body.id}`, postOption(req.body)));
});

// 下载
api.get('/down', async (req, res) => {
  const data = await fetchJsonByNode(req, `${URL_DOWN}?id=${req.query.id}`);
  res.send(data);
});

export default api;
