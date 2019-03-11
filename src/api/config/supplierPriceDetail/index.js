import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';
import mockData from './mock';

const tms_service = `${host}/tms-service`;
const archiver_service = `${host}/archiver-service`;
const tenant_service = `${host}/tenant-service`;

let api = express.Router();

api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 主列表数据
api.post('/list', async (req, res) => {
  const url = `${tms_service}/supplier_price_master/list/search`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, returnMsg: 'Success', result: mockData.list})
});

// 客户下拉
api.post('/supplier', async (req, res) => {
  const url = `${archiver_service}/supplier/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 始发地、目的地下拉
api.post('/district', async (req, res) => {
  const url = `${archiver_service}/consignee_consignor/drop_list`;
  const params = {...req.body, name: req.body.filter};
  res.send(await fetchJsonByNode(req, url, postOption(params)));
});

// 收发货人下拉
api.post('/consignor', async (req, res) => {
  const url = `${archiver_service}/archiver/district/drop_list`;
  const params = {...req.body, districtName: req.body.filter};
  res.send(await fetchJsonByNode(req, url, postOption(params)));
});

// 车型下拉
api.post('/carMode', async (req, res) => {
  const url = `${archiver_service}/car_mode/drop_list`;
  const params = {...req.body, carMode: req.body.filter};
  res.send(await fetchJsonByNode(req, url, postOption(params)));
});

// 用户下拉
api.post('/user', async (req, res) => {
  const url = `${tenant_service}/user/drop_list`;
  const data = await fetchJsonByNode(req, url, postOption(req.body));
  if (data.returnCode === 0) {
    data.result = data.result.map(o => ({value: o.guid, title: o.username}));
  }
  res.send(data);
});

// 删除
api.post('/delete', async (req, res) => {
  const url = `${archiver_service}/supplier_price_master/batch`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
  res.send({returnCode: 0, returnMsg: 'Success', result: 'Success'});
});

// 启用/禁用
api.post('/able', async (req, res) => {
  const url = `${archiver_service}/supplier_price_master/batch/${req.body.enabledType}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
  res.send({returnCode: 0, returnMsg: 'Success', result: 'Success'});
});

// 获取编辑界面合同信息数据
api.get('/detail/:id', async (req, res) => {
  const url = `${archiver_service}/supplier_price/${req.params.id}`;
  // res.send(await fetchJsonByNode(req, url));
  res.send({returnCode: 0, returnMsg: 'Success', result: mockData.detail});
});

// 新增合同信息保存
api.post('/contractSave', async (req, res) => {
  const url = `${archiver_service}/supplier_price`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, returnMsg: 'Success', result: 'Success'});
});

// 编辑合同信息保存或提交
api.post('/contractCommit', async (req, res) => {
  const url = `${archiver_service}/supplier_price`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
  res.send({returnCode: 0, returnMsg: 'Success', result: 'Success'});
});

// 获取编辑界面运费信息数据
api.post('/freightDetail', async (req, res) => {
  const url = `${archiver_service}/supplier_price/${req.params.id}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, returnMsg: 'Success', result: mockData.freightDetail});
});

// 新增运费信息保存
api.post('/freightAdd', async (req, res) => {
  const url = `${archiver_service}/supplier_price_master`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, returnMsg: 'Success', result: 'Success'});
});

// 编辑运费信息保存
api.post('/freightEdit', async (req, res) => {
  const url = `${archiver_service}/supplier_price_master`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
  res.send({returnCode: 0, returnMsg: 'Success', result: 'Success'});
});

// 批量编辑运费信息保存
api.post('/freightBatchEdit', async (req, res) => {
  const url = `${archiver_service}/supplier_price_master`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
  res.send({returnCode: 0, returnMsg: 'Success', result: 'Success'});
});

// 车型下拉
api.post('/carMode', async (req, res) => {
  const url = `${archiver_service}/car_mode/drop_list`;
  const params = {...req.body, carMode: req.body.filter};
  res.send(await fetchJsonByNode(req, url, postOption(params)));
});

// 费用项下拉
api.post('/chargeItem', async (req, res) => {
  const url = `${archiver_service}/charge_item/drop_list`;
  const params = {...req.body, chargeName: req.body.filter};
  res.send(await fetchJsonByNode(req, url, postOption(params)));
});

// 获取币种下拉
api.post('/currency', async (req, res) => {
  const url = `${archiver_service}/charge/tenant_currency_type/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 删除运费
api.post('/freightEdit', async (req, res) => {
  const url = `${archiver_service}/supplier_price_master/batch`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
  res.send({returnCode: 0, returnMsg: 'Success', result: 'Success'});
});

// 启用/禁用运费
api.post('/freightAble', async (req, res) => {
  const url = `${archiver_service}/supplier_price_master/batch/${req.body.enabledType}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
  res.send({returnCode: 0, returnMsg: 'Success', result: 'Success'});
});

// 刷新
api.get('/freightRefresh/:id', async (req, res) => {
  const url = `${archiver_service}/supplier_price_master/${req.params.id}`;
  // res.send(await fetchJsonByNode(req, url));
  res.send({returnCode: 0, returnMsg: 'Success', result: []});
});


export default api;
