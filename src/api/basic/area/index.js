import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();

const service = 'archiver_service';

const URL_TREE = `${host}/${service}/archiver/district/tree`;
const URL_TREE_LIST = `${host}/${service}/archiver/districts`;

const URL_DISTRICT_LIST = `${host}/${service}/archiver/district/direct_child_list`;
const URL_DISTRICT_INFO = `${host}/${service}/archiver/district`;
const URL_DISTRICT_SAVE = `${host}/${service}/archiver/district`;
const URL_DISTRICT_DROP_LIST = `${host}/${service}/archiver/district/update/drop_list`;

const URL_SITE_LIST = `${host}/${service}/archiver/transport_place/list`;
const URL_SITE_INFO = `${host}/${service}/archiver/transport_place`;
const URL_SITE_SAVE = `${host}/${service}/archiver/transport_place`;

const URL_CONTACT_LIST = `${host}/${service}/archiver/location/list`;
const URL_CONTACT_INFO = `${host}/${service}/archiver/location`;
const URL_CONTACT_SAVE = `${host}/${service}/archiver/location`;
const URL_CONTACT_DEL = `${host}/${service}/archiver/location`;
const URL_CONTACT_ACTIVE = `${host}/${service}/archiver/location/active`;
const URL_PLACE_DROP_LIST = `${host}/${service}/archiver/transport_place/drop_list`;
const URL_PLACE_DROP_LIST_EN = `${host}/${service}/archiver/transport_place/drop_list_english`;
const URL_LOCATION_DROP_LIST = `${host}/${service}/archiver/location/drop_list`;
const URL_SEARCH = `${host}/${service}/archiver/district_id`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode:0, result:module.default});
});

// 获取树
api.get('/tree', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_TREE));
});

// 获取树列表格式数据
api.get('/tree_list', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_TREE_LIST));
});

// 获取行政区档案列表
api.get('/district_list/:guid', async (req, res) => {
  const guid = req.params.guid;
  res.send(await fetchJsonByNode(req, `${URL_DISTRICT_LIST}/${guid}`));
});

// 获取一条行政区档案记录详细信息
api.get('/district_info/:guid', async (req, res) => {
  const guid = req.params.guid;
  res.send(await fetchJsonByNode(req, `${URL_DISTRICT_INFO}/${guid}`));
});

//新增行政区档案
api.post('/district',async (req, res)=>{
  res.send(await fetchJsonByNode(req, URL_DISTRICT_SAVE, postOption(req.body)));
});

//编辑行政区档案
api.put('/district',async (req, res)=>{
  res.send(await fetchJsonByNode(req, URL_DISTRICT_SAVE, postOption(req.body, 'put')));
});

//获取行政区下拉列表（上级）
api.post('/district_drop_list', async (req, res)=>{
  res.send(await fetchJsonByNode(req, URL_DISTRICT_DROP_LIST, postOption(req.body)));
});

const toServer = ({baseInfo, list}) => {
  const placeType = baseInfo.placeType || [];
  delete baseInfo.placeType;
  return {placeType, baseInfo, list};
};

const toBrowserInfo = ({baseInfo, list=[], placeType=[]}) => {
  return {baseInfo: Object.assign({}, baseInfo, {placeType}), list};
};

// 获取运输地点档案列表
api.get('/site_list/:guid', async (req, res) => {
  const guid = req.params.guid;
  res.send(await fetchJsonByNode(req, `${URL_SITE_LIST}/${guid}`));
});

// 获取一条运输地点档案记录详细信息
api.get('/site_info/:guid', async (req, res) => {
  const guid = req.params.guid;
  let data = await fetchJsonByNode(req, `${URL_SITE_INFO}/${guid}`);
  (data.returnCode === 0) && (data.result = toBrowserInfo(data.result));
  res.send(data);
});

//新增运输地点档案
api.post('/site',async (req, res)=>{
  res.send(await fetchJsonByNode(req, URL_SITE_SAVE, postOption(toServer(req.body))));
});

//编辑运输地点档案
api.put('/site',async (req, res)=>{
  res.send(await fetchJsonByNode(req, URL_SITE_SAVE, postOption(toServer(req.body), 'put')));
});

// 获取地点联系人档案列表
api.get('/contact_list/:guid', async (req, res) => {
  const guid = req.params.guid;
  res.send(await fetchJsonByNode(req, `${URL_CONTACT_LIST}/${guid}`));
});

// 获取一条地点联系人档案记录详细信息
api.get('/contact_info/:guid', async (req, res) => {
  const guid = req.params.guid;
  res.send(await fetchJsonByNode(req, `${URL_CONTACT_INFO}/${guid}`));
});

//删除一条地点联系人档案记录
api.delete('/contact/:guid', async (req, res) => {
  const guid = req.params.guid;
  res.send(await fetchJsonByNode(req, `${URL_CONTACT_DEL}/${guid}`, postOption(null, 'delete')));
});

//激活一条地点联系人档案记录
api.put('/contact_active/:guid', async (req, res) => {
  const guid = req.params.guid;
  res.send(await fetchJsonByNode(req, `${URL_CONTACT_ACTIVE}/${guid}`, postOption(null, 'put')));
});

//新增地点联系人档案
api.post('/contact',async (req, res)=>{
  res.send(await fetchJsonByNode(req, URL_CONTACT_SAVE, postOption(req.body)));
});

//编辑地点联系人档案
api.put('/contact',async (req, res)=>{
  res.send(await fetchJsonByNode(req, URL_CONTACT_SAVE, postOption(req.body, 'put')));
});

//获取运输地点下拉列表
api.post('/place_drop_list', async(req, res) => {
  res.send(await fetchJsonByNode(req, URL_PLACE_DROP_LIST, postOption(req.body)));
});

//获取运输地点下拉列表--英文版
api.post('/place_drop_list_english', async(req, res) => {
  res.send(await fetchJsonByNode(req, URL_PLACE_DROP_LIST_EN, postOption(req.body)));
});

//获取地点联系人下拉列表
api.post('/location_drop_list', async(req, res) => {
  res.send(await fetchJsonByNode(req, URL_LOCATION_DROP_LIST, postOption(req.body)));
});

//搜索
api.post('/search', async(req, res) => {
  res.send(await fetchJsonByNode(req, URL_SEARCH, postOption(req.body)));
});

export default api;
