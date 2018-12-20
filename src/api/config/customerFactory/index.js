import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();

const service= `${host}/archiver-service`;

const URL_DISTRICT_OPTIONS = `${host}/archiver-service/archiver/district/drop_list`;
const URL_CHARGE_PLACE_OPTIONS = `${host}/archiver-service/archiver/district/drop_list`; //暂先改为所有行政区下拉列表

// 获取界面信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result:module.default});
});

//获取自定义配置信息
api.get('/cutomer_config/:code', async (req, res) => {
  const url = `${host}/archiver-service/table_extend_property_config/config/${req.params.code}`;
  const config = await fetchJsonByNode(req, url);
  config.result.controls = config.result.controls || [];
  res.send(config);
});

//获取tableItems
api.post('/list', async (req, res) => {
  const url = `${service}/consignee_consignor/customer_list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//新增 编辑
api.post('/add',async (req, res)=>{
  const url = `${service}/consignee_consignor`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//删除
api.delete('/delete', async (req, res) => {
  const url = `${service}/consignee_consignor/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

//启用与禁用
api.put('/enable/:enabledType', async (req, res) => {
  const url = `${service}/consignee_consignor/batch/${req.params.enabledType}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//获取所有客户档案下拉
api.post('/allCustomer', async (req, res) => {
  const url = `${service}/customer/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//获取已启用客户档案
api.post('/customer', async (req, res) => {
  const url = `${service}/customer/drop_list/enabled_type_enabled`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//获取行政区五级地址下拉列表
api.post('/district_options', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_DISTRICT_OPTIONS, postOption(req.body)));
});

//获取计费地点下拉列表
api.post('/charge_place_options', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_CHARGE_PLACE_OPTIONS, postOption(req.body)));
});

export default api;
