import express from 'express';
import {host} from './globalConfig';
import {fetchJsonByNode} from '../common/common';
const api = express.Router();

// 根据id获取图片链接
api.get('/download/:id', async (req, res) => {
  const url = `${host}/trace-service/file/url/documents?fileIds=${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

// 获取所有激活的作业单元列表
api.get('/active_jobs', async (req, res) => {
  const url = `${host}/production_service/task_unit_type/active/list`;
  res.send(await fetchJsonByNode(req, url));
});

// 获取表单状态
api.get('/statusType/:type', async (req, res) => {
  const url = `${host}/dictionary_service/formTypeDictionaryCodeRelation/listStatusByFormType/${req.params.type}`;
  res.send(await fetchJsonByNode(req, url));
});

export default api;
