import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';
let api = express.Router();

const service = 'archiver_service';
const URL_LIST = `${host}/${service}/from_type_status/list/search`;
const URL_ADD_KEEP = `${host}/${service}/from_type_status/insert`;
const URL_ADD_UPDATE = `${host}/${service}/from_type_status/update`;
const URL_DElETE = `${host}/${service}/from_type_status/delete`;

// 获取UI标签
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

// 新增保存确定
api.post('/save', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ADD_KEEP, postOption(req.body)));
});


// 编辑保存确定
api.put('/save', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ADD_UPDATE, postOption(req.body, 'put')));
});

// 删除
api.delete('/delete/:guid', async (req, res) => {
  const guid = req.params.guid;
  res.send(await fetchJsonByNode(req, `${URL_DElETE}/${guid}`, postOption(req.body, 'delete')));
});



export default api;

