import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const service = 'auth-center-provider';
const URL_LIST = `${host}/${service}/urlResource/listBySearch`;
const TREE_LIST = `${host}/${service}/publicUrlResource/urlResource`;
const SAVE_TREE = `${host}/${service}/publicUrlResource/updateUrlResource`;
const URL_SAVE_SERVICE = `${host}/auth-center-provider/serviceResource/insert`;
const URL_SAVE_CONTROLLER = `${host}/auth-center-provider/controllerResource/insert`;
const URL_DEL = `${host}/${service}/urlResource/delete`;
const URL_SAVE = `${host}/${service}/urlResource/insert`;
const URL_UPDATE = `${host}/${service}/urlResource/update`;
const URL_SERVICE_RESOURCE_OPTIONS = `${host}/${service}/serviceResource/findList`;
const URL_CONTROLLER_RESOURCE_OPTIONS = `${host}/${service}/controllerResource/listByServiceId`;


// 获取界面信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取增加界面信息
api.get('/addConfig', async (req, res) => {
  const module = await require('./addConfig');
  res.send({returnCode: 0, result: module.default});
});

//获取控制层
api.get('/addController', async (req, res) => {
  const module = await require('./addController');
  res.send({returnCode: 0, result: module.default});
});

//获取主列表数据
api.post('/list', async (req, res) => {
  const {filter, ...others} = req.body;
  let body = {...filter, ...others};
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(body)));
});

//获取权限树
api.get('/tree_list', async (req, res) => {
  const data = await fetchJsonByNode(req, `${TREE_LIST}?urlResourceLibraryId=${req.query.urlResourceLibraryId}`);
  res.send(data);
});

// 更新权限树
api.post('/save', async (req, res) => {
  res.send(await fetchJsonByNode(req, SAVE_TREE, postOption(req.body)));
});

//删除
api.delete('/del/:id', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${URL_DEL}?ids=${req.params.id}`, postOption(null, 'delete')));
});

// 新增
api.post('/add', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_SAVE, postOption(req.body)));
});

// 新增服务
api.post('/addService', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_SAVE_SERVICE, postOption(req.body)));
});

// 新增控制层
api.post('/saveController', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_SAVE_CONTROLLER, postOption(req.body)));
});

// 编辑
api.post('/update', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_UPDATE, postOption(req.body)));
});

//获取所属服务名
api.get('/service_resource_options', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_SERVICE_RESOURCE_OPTIONS));
});

//获取所属服务名
api.get('/controller_resource_options/:id', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${URL_CONTROLLER_RESOURCE_OPTIONS}/${req.params.id}`));
});


export default api;
