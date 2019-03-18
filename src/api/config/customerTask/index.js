import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host, maxSearchCount} from '../../globalConfig';

let api = express.Router();
const service = 'tms-service';

const URL_LIST = `${host}/${service}/customer_task/search`;
const URL_DEL = `${host}/${service}/customer_task/delete/batch`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取列表数据
api.post('/list', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(req.body)));
});

//  删除
api.post('/del', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_DEL, postOption(req.body)));
});

// 新增
api.post('/', async (req, res) => {
  const url = `${host}/${service}/customer_task/insert`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 编辑
api.put('/', async (req, res) => {
  const url = `${host}/${service}/customer_task/update`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取部门下拉
api.get('/options/departments', async (req, res) => {
  const url = `${host}/tenant_service/department/drop_list`;
  const body = {
    departmentName: req.query.filter,
    maxNumber: maxSearchCount
  };
  res.send(await fetchJsonByNode(req, url, postOption(body)));
});

export default api;

