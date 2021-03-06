import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const service= `${host}/archiver-service`;

//获取UI
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

//获取tableItems
api.post('/list', async (req, res) => {
  const url = `${service}/supplier_tax/list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//新增 编辑
api.post('/add', async (req, res) => {
  const url = `${service}/supplier_tax`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//启用与禁用
api.put('/enable/:enabledType', async (req, res) => {
  const url = `${service}/supplier_tax/batch/${req.params.enabledType}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//删除
api.delete('/delete', async (req, res) => {
  const url = `${service}/supplier_tax/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

//获取所有供应商档案下拉
api.post('/allCustomer', async (req, res) => {
  const url = `${service}/supplier/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//获取已启用供应商档案
api.post('/customer', async (req, res) => {
  const url = `${service}/supplier/drop_list/enabled_type_enabled`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//获取所有费用项下拉
api.post('/allItems', async (req, res) => {
  const url = `${service}/charge_item/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//获取已激活费用项下拉
api.post('/Items', async (req, res) => {
  const url = `${service}/charge_item/drop_list/enabled_type_enabled`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//车主税率
api.post('/owner', async (req, res) => {
  const url = `${service}/supplier_tax/select_by_supplier_ids/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//车主税率保存
api.post('/ownerTax', async (req, res) => {
  const url = `${service}/supplier_tax`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
