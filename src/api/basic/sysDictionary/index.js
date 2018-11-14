import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const service = 'dictionary_service';
const URL_TREE = `${host}/${service}/dictionary/service/getTree`;             //获取树
const URL_LIST = `${host}/${service}/dictionary/service/selectByCode`;       //获取列表
const URL_ADD = `${host}/${service}/dictionary/service/insertDictionary`;     //新增保存
const URL_EDIT = `${host}/${service}/dictionary/service/updateDictionary`;    //编辑保存
const URL_ACTIVE = `${host}/${service}/dictionary/service/updateActive`;     //激活
const URL_DEL = `${host}/${service}/dictionary/service/deleteByCode`;        //删除


// 获取本地配置
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});


// 获取树数据  /dictionary/service/getTree
api.post('/tree', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_TREE, postOption(req.body)));
});

// 获取树数据列表
api.get('/tree_list', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${host}/${service}/dictionary/service/dictionaries`));
});

// 动态获取列表  /dictionary/service/getTree
api.post('/list', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(req.body)));
});

// 新增保存
api.post('/add', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ADD, postOption(req.body)));
});

// 编辑保存
api.put('/edit', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_EDIT, postOption(req.body, 'put')));
});

// 激活
api.put('/active', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ACTIVE, postOption(req.body, 'put')));
});


// 删除
api.post('/del', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_DEL, postOption(req.body)));
});





export default api;
