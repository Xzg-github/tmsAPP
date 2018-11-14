import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const service = 'archiver-service';

// 获取树数据列表
api.get('/data', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${host}/${service}/system_settings`));
});

// 编辑保存
api.post('/save', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${host}/${service}/system_settings`, postOption(req.body)));
});

export default api;
