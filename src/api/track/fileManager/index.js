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
  const url = `${service}/file_task/list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//审核通过
api.post('/check', async (req, res) => {
  const url = `${service}/file_task/submit`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//上传、编辑
api.put('/upload', async (req, res) => {
  const url = `${service}/file_task`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 根据id获取图片链接
api.get('/download/:id', async (req, res) => {
  const { id } = req.params;
  res.send(await fetchJsonByNode(req, `${service}/file/url/documents?fileIds=${id}`));
});

// 删除上传数据
api.delete('/upload_del/:id',async (req, res)=>{
  const url= `${service}/file/delete?fileIds=${req.params.id}`;
  res.send(await fetchJsonByNode(req, url, postOption(null, 'delete')));
});

export default api;
