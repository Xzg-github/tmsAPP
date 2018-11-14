import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {host} from '../../globalConfig';

const postUrl = `${host}/auth-center`;

let api = express.Router();

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({
    returnCode: 0,
    result: module.default
  });
});

// 获取公共权限列表
api.get('/tree', async (req, res) => {
  const url = `${postUrl}/public_resource/tree`;
  res.send(await fetchJsonByNode(req, url));
  // const module = await require('./data');
  // res.send({
  //   ...module.default
  // });
});

// 获取上级权限代码下拉列表
api.get('/drop_list', async (req, res) => {
  const url = `${postUrl}/public_resource/drop_list`;
  res.send(await fetchJsonByNode(req, url));
});

// 新增公共权限
api.post('/save', async (req, res) => {
  const url = `${postUrl}/public_resource/save`;
  const postData = {...req.body, resourceType: parseInt(req.body.resourceType)};
  delete postData.id;
  res.send(await fetchJsonByNode(req, url, postOption(postData)));
});

// 更新公共权限
api.post('/update', async (req, res) => {
  const url = `${postUrl}/public_resource/update`;
  const postData = {...req.body, pid: req.body.pid || 'root', resourceType: parseInt(req.body.resourceType)};
  res.send(await fetchJsonByNode(req, url, postOption(postData, 'put')));
});

// 删除公共权限
api.post('/remove', async (req, res) => {
  const url = `${postUrl}/public_resource/remove/${req.body.id}`;
  res.send(await fetchJsonByNode(req, url, 'delete'));
});


export default api;
