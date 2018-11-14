import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';
const service = `${host}/mq-service`;
let api = express.Router();

const URL_LIST = `${service}/message_subscribe/list/search`;
const URL_ADD = `${service}/message_subscribe`;

// 获取界面信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 查询数据
api.post('/list', async (req, res) => {
  const {filter, ...others} = req.body;
  let body = {...filter, ...others};
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(body)));
});

// 查询服务类型code
api.get('/service', async (req, res) => {
  const url = `${host}/production-service/productType/service/select_current_product_type`;
  const json = await fetchJsonByNode(req, url);
  const convert = (item) => ({value: item.serviceTypeCode, title: item.productTypeName});
  res.send(json.returnCode === 0 ? {result:json.result.map(convert),returnCode:0} : json)
});

// 作业单元code与服务类型联动
api.post('/task', async (req, res) => {
  const url = `${host}/production_service/productType/service/task_unit_list`;
  res.send(await fetchJsonByNode(req, url,postOption(req.body)));
});

// 任务单生命周期查询主列表
api.get('/lifecyclelist/:taskUnitId', async (req, res) => {
  const url = `${host}/trace-service/tenantLifecycle/delivery/lifecyclelist/${req.params.taskUnitId}`;
  const json = await fetchJsonByNode(req, url);
  const convert = (item) => ({value: item.lifecycleGuid, title: item.lifecycleName});
  res.send(json.returnCode === 0 ? {result:json.result.map(convert),returnCode:0} : json)
});


// 新增
api.post('/add', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ADD, postOption(req.body)));
});


// 编辑
api.put('/add', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ADD, postOption(req.body,'put')));
});


//删除
api.delete('/del/:id', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${URL_ADD}/${req.params.id}`, postOption(null, 'delete')));
});

// 部门与机构联动下拉
api.get('/department/:guid', async (req, res) => {
  const url = `${host}/tenant-service/department/children/${req.params.guid}/institution`;
  const json = await fetchJsonByNode(req, url);
  const convert = (item) => ({value: item.guid, title: item.departmentName});
  res.send(json.returnCode === 0 ? {result:json.result.map(convert),returnCode:0} : json)
});




export default api;
