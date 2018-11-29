import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const maxSearchCount = 20;
const service = `${host}/archiver-service`;

// 获取界面信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取界面数据
api.post('/list',async(req,res) => {
  const url = `${service}/car_info/supplier_list/search`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

// 获取综合界面信息
api.get('/inside_config',async(req,res) => {
  const module = await require('../insideCar/config');
  res.send({returnCode: 0, result: module.default});
});

// 获取综合界面数据
api.post('/inside_list',async(req,res) => {
  const url = `${service}/car_info/list/search`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

// 新增或者编辑
api.post('/updateList',async(req,res) => {
  const url = `${service}/car_info`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

//启用禁用
api.put('/state/:type',async(req,res) => {
  const url = `${service}/car_info/batch/${req.params.type}`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body,'put')))
});

//删除
api.delete('/delete',async(req,res) => {
  const url = `${service}/car_info/batch`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body,'delete')))
});

//根据code获取拓展字段
api.get('/attr', async (req, res) => {
  const url = `${service}/table_extend_property_config/config/car_info_property`;
  res.send(await fetchJsonByNode(req, url));
});

//车型下拉
api.get('/search/car_mode',async(req,res) => {
  const url = `${host}/archiver-service/car_mode/drop_list`;
  const option = postOption({carMode:req.query.filter});
  res.send(await fetchJsonByNode(req, url,option));
});

//司机下拉
api.get('/search/driver',async(req,res) => {
  const url = `${service}/driver_info/drop_list/${req.query.filter}`;
  res.send(await fetchJsonByNode(req, url,postOption(null)));
});


export default api;
