import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {host} from '../../globalConfig';
import {search} from '../../helper';

const archiver_service = `${host}/archiver-service`;
const tenant_service = `${host}/tenant-service`;
let api = express.Router();

const arr = ['true_false_type_false', 'true_false_type_true'];

// 获取UI
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 自定义表单字段
api.get('/custom_config/:code', async (req, res) => {
  const url = `${archiver_service}/table_extend_property_config/config/${req.params.code}`;
  const config = await fetchJsonByNode(req, url);
  config.result.controls = config.result.controls || [];
  res.send(config);
});

// 获取列表
api.post('/list', async (req, res) => {
  const url = `${archiver_service}/customer/list/search`;
  const params = { ...req.body, needPaging: 1};
  const list = await fetchJsonByNode(req, url, postOption(params));
  list.result.data.forEach(obj => obj.isContract = arr[obj.isContract]);
  res.send(list);
});

// 获取销售人员
api.post('/salemen', async (req, res) => {
  const url = `${tenant_service}/user/name/search`;
  res.send(await search(req, url, 'username', req.body.filter));
});

// 获取币种
api.post('/currency', async (req, res) => {
  const url = `${archiver_service}/charge/tenant_currency_type/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取行政区五级地址下拉列表
api.post('/district_options', async (req, res) => {
  const url = `${archiver_service}/archiver/district/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取详细信息
api.get('/detail/:id', async (req, res) => {
  const url = `${archiver_service}/customer/${req.params.id}`;
  const list = await fetchJsonByNode(req, url);
  list.result.isContract = arr[list.result.isContract];
  res.send(list);
});

// 新增
api.post('/add', async (req, res) => {
  const url = `${archiver_service}/customer`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 编辑
api.post('/edit', async (req, res) => {
  const url = `${archiver_service}/customer`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 启用/禁用
api.post('/able', async (req, res) => {
  const url = `${archiver_service}/customer/batch/${req.body.type}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body.ids, 'put')));
});

// 删除
api.post('/delete', async (req, res) => {
  const url = `${archiver_service}/customer/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

// 导入
api.post('/import', async (req, res) => {
  const url = `${archiver_service}/customer/import`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
