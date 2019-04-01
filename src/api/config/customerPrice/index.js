import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

const archiver_service = `${host}/archiver-service-djh`;
const tenant_service = `${host}/tenant-service`;

let api = express.Router();

api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 主列表数据
api.post('/list', async (req, res) => {
  const url = `${archiver_service}/customer_price/list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 客户下拉
api.post('/customer', async (req, res) => {
  const url = `${archiver_service}/customer/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
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
  const url = `${archiver_service}/customer_price/batch/delete`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

// 启用/禁用
api.post('/able', async (req, res) => {
  const url = `${archiver_service}/customer_price/batch/${req.body.enabledType}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body.ids, 'put')));
});

// 获取编辑界面合同信息数据
api.get('/detail/:id', async (req, res) => {
  const url = `${archiver_service}/customer_price/search/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

// 新增合同信息保存
api.post('/contractAdd', async (req, res) => {
  const url = `${archiver_service}/customer_price/add`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 编辑合同信息保存
api.post('/contractSave', async (req, res) => {
  const url = `${archiver_service}/customer_price/save`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 编辑合同信息提交
api.post('/contractCommit', async (req, res) => {
  const url = `${archiver_service}/customer_price/submit`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
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

// 获取起运地、目的地下拉（行政区域）
api.post('/district', async (req, res) => {
  const url = `${archiver_service}/archiver/district/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取起运地、目的地下拉（收发货人）
api.post('/consignor', async (req, res) => {
  const url = `${archiver_service}/consignee_consignor/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取编辑界面运费列表数据
api.post('/freightDetail', async (req, res) => {
  const url = `${archiver_service}/customer_price_master/list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 新增运费信息保存
api.post('/freightAdd', async (req, res) => {
  const url = `${archiver_service}/customer_price_master/add`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 编辑运费信息保存
api.post('/freightEdit', async (req, res) => {
  const url = `${archiver_service}/customer_price_master/save`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 批量编辑运费信息保存
api.post('/freightBatchEdit', async (req, res) => {
  const url = `${archiver_service}/customer_price_master/batch/update`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 批量删除运费
api.post('/freightDelete', async (req, res) => {
  const url = `${archiver_service}/customer_price_master/batch/delete`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

// 批量启用/禁用运费
api.post('/freightAble', async (req, res) => {
  const url = `${archiver_service}/customer_price_master/batch/${req.body.type}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body.ids, 'put')));
});

// 获取编辑界面附加费列表数据
api.post('/extraChargeDetail', async (req, res) => {
  const url = `${archiver_service}/customer_price_additional/list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 新增附加费信息保存
api.post('/extraChargeAdd', async (req, res) => {
  const url = `${archiver_service}/customer_price_additional/insert`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 编辑附加费信息保存
api.post('/extraChargeEdit', async (req, res) => {
  const url = `${archiver_service}/customer_price_additional/save`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 批量编辑附加费信息保存
api.post('/extraChargeBatchEdit', async (req, res) => {
  const url = `${archiver_service}/customer_price_additional/batch/update`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 批量删除附加费
api.post('/extraChargeDelete', async (req, res) => {
  const url = `${archiver_service}/customer_price_additional/batch/delete`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

// 批量启用/禁用附加费
api.post('/extraChargeAble', async (req, res) => {
  const url = `${archiver_service}/customer_price_additional/batch/${req.body.type}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body.ids, 'put')));
});


export default api;
