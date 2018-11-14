import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const service = 'archiver_service';
const URL_LIST = `${host}/${service}/archiver/tableNumber/getTableNumberAll`;
const URL_ADD_KEEP = `${host}/${service}/archiver/tableNumber/addTableNumber`;
const URL_EDIT_KEEP = `${host}/${service}/archiver/tableNumber/updateTableNumber`;
const URL_DELETE = `${host}/${service}/archiver/tableNumber/deleteDistrict/`;
const URL_SEARCH = `${host}/${service}/archiver/tableNumber/selectByRelationId`;
const URL_SETDEFAULT = `${host}/${service}/archiver/tablenumber/set_default`;
const URL_BATCH_EDIT = `${host}/${service}/archiver/tablenumber/batch`;

// 获取本地配置
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});


//查询数据
api.get('/list', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(req.body, 'get')));
});

// 新增确定保存
api.post('/save', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ADD_KEEP, postOption(req.body)));
});

// 编辑确定保存
api.put('/save', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_EDIT_KEEP, postOption(req.body, 'put')));
});

// 编辑确定保存
api.delete('/delete/:tableNumberId', async (req, res) => {
  const tableNumberId = req.params.tableNumberId;
  res.send(await fetchJsonByNode(req, `${URL_DELETE}/${tableNumberId}`, postOption(req.body, 'delete')));
});
// /archiver/TableNumber/archiver/tablenumber/AddTableNumber
api.post('/search', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_SEARCH, postOption(req.body)));
});

// 默认设置
api.get('/setDefault', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_SETDEFAULT));
});

// 批量编辑
api.post('/batchEdit', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_BATCH_EDIT, postOption(req.body, 'put')));
});


export default api;
