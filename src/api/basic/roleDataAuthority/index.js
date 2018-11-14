import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig'

let api = express.Router();
const service = 'auth-center-provider';
const service1 = `${host}/archiver-service`;
const service3= `${host}/tenant_service`;

const URL_SERVICE_PRODUCT = `${host}/production_service/productType/service/select_current_product_type`; // 服务类型
const URL_ALL_DATA = `${host}/${service}/tenant_rule_types`;
const URL_SEARCH = `${host}/${service}/data_roles/search`;
const URL_ADD = `${host}/${service}/data_role`;
const URL_ONE = `${host}/${service}/data_role/`;
const URL_EDIT = `${host}/${service}/data_role`;
const URL_DEL = `${host}/${service}/data_role/`;

const convert = (arr, key) => {
  return arr.map(obj => ({value: obj.guid, title: obj[key]}));
};

const search = async (req, url, key, filter) => {
  const body = {itemFrom: 0, itemTo: 65536, filter: {[key]: filter}};
  let json = await fetchJsonByNode(req, url, postOption(body));
  if (json.returnCode === 0) {
    json.result.data = convert(json.result.data, key);
  }
  return json;
};


// 获取界面信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});


// 获取类型, 规则数据
api.get('/all_data', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ALL_DATA));
});

// 主列表
api.post('/search', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_SEARCH, postOption(req.body)));
});

// 新增
api.post('/', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ADD, postOption(req.body)));
});

// 获取编辑数据
api.get('/one/:id', async (req, res) => {
  const id = req.params.id;
  res.send(await fetchJsonByNode(req, `${URL_ONE}${id}`, postOption(req.body, 'get')));
});


// 编辑
api.put('/', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_EDIT, postOption(req.body, 'put')));
});

// 删除
api.delete('/del/:id', async (req, res) => {
  const id = req.params.id;
  res.send(await fetchJsonByNode(req, `${URL_DEL}${id}`, postOption(req.body, 'delete')));
});


// 查询所有部门
api.post('/branch', async (req, res) => {
  const url = `${host}/tenant_service/department/list`;
  res.send(await search(req, url, 'departmentName', req.body.filter));
});


// 获取客户名称列表
api.post('/name', async (req, res) => {
  const url = `${service1}/customer/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'post')));
});


// 获取供应商名称列表
api.post('/search/name', async (req, res) => {
  const url = `${service1}/supplier/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'post')));
});


// 查询用户的名称
api.post('/user', async (req, res) => {
  const url = `${service3}/user/name/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'post')));
});

export default api;
