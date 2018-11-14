import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';
let api = express.Router();

const service = 'report-service';
const URL_LIST = `${host}/${service}/default_output_template/list/search`;
const URL_ADD_KEEP = `${host}/${service}/default_output_template/`;
const URL_EDIT_KEEP = `${host}/${service}/default_output_template/`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取UI标签
api.get('/reciversConfig', async (req, res) => {
  const module = await require('./reciversConfig');
  res.send({returnCode: 0, result: module.default});
});


// 获取单条信息
api.get('/tableItems/:id', async (req, res) => {
  const url= `${host}/${service}/default_output_template/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url, postOption(null, 'get')));
});

// 获取模板类别
api.get('/template/:id', async (req, res) => {
  const url= `${host}/${service}/output_type_config/drop_list/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url, postOption(null, 'get')));
});


// 查询数据
api.post('/list', async (req, res) => {
  const {filter, ...others} = req.body;
  let body = {...filter, ...others};
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(body)));
});

// 新增保存确定
api.post('/save', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ADD_KEEP, postOption(req.body)));
});


// 编辑保存确定
api.put('/save', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_EDIT_KEEP, postOption(req.body, 'put')));
});

// 删除
api.delete('/del/:id',async (req, res)=>{
  const url= `${host}/${service}/default_output_template/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url, postOption(null, 'delete')));
});



// 获取供应商类别下拉
api.get('/supplier/:type', async (req, res) => {
  const type = req.params.type;
  const url = `${host}/${service}/rule_field_library/drop_list/${type}`;
  res.send(await fetchJsonByNode(req, url, postOption(null, 'get')));
});


export default api;

