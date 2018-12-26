import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();

const service = 'archiver-service';

const URL_TREE = `${host}/${service}/archiver/district/tree`;

const URL_DISTRICT_LIST = `${host}/${service}/archiver/district/direct_child_list`;
const URL_DISTRICT_INFO = `${host}/${service}/archiver/district`;
const URL_DISTRICT_SAVE = `${host}/${service}/archiver/district`;
const URL_DISTRICT_DROP_LIST = `${host}/${service}/archiver/district/update/drop_list`;

const URL_SEARCH = `${host}/${service}/archiver/district_id`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode:0, result:module.default});
});

// 获取树
api.get('/tree', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_TREE));
});

// 获取树列表格式数据
api.get('/tree_list', async (req, res) => {
  res.send({returnCode: 0, result: []});
  // res.send(await fetchJsonByNode(req, URL_TREE_LIST));
});

// 获取行政区档案列表
api.get('/district_list/:guid', async (req, res) => {
  const guid = req.params.guid;
  res.send(await fetchJsonByNode(req, `${URL_DISTRICT_LIST}/${guid}`));
});

// 获取一条行政区档案记录详细信息
api.get('/district_info/:guid', async (req, res) => {
  const guid = req.params.guid;
  res.send(await fetchJsonByNode(req, `${URL_DISTRICT_INFO}/${guid}`));
});

//新增行政区档案
api.post('/district',async (req, res)=>{
  res.send(await fetchJsonByNode(req, URL_DISTRICT_SAVE, postOption(req.body)));
});

//编辑行政区档案
api.put('/district',async (req, res)=>{
  res.send(await fetchJsonByNode(req, URL_DISTRICT_SAVE, postOption(req.body, 'put')));
});

//获取行政区下拉列表（上级）
api.post('/district_drop_list', async (req, res)=>{
  res.send(await fetchJsonByNode(req, URL_DISTRICT_DROP_LIST, postOption(req.body)));
});

//获取行政区下拉列表（所有）
api.post('/district_drop_list_all', async (req, res)=>{
  res.send(await fetchJsonByNode(req, `${host}/${service}/archiver/district/drop_list`, postOption(req.body)));
});

//搜索
api.post('/search', async(req, res) => {
  res.send(await fetchJsonByNode(req, URL_SEARCH, postOption(req.body)));
});

export default api;
