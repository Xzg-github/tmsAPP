import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';
let api = express.Router();

const service = 'integration_service';
const URL_LIST = `${host}/${service}/excel_reports_manager/listSearch`;
const URL_ADD_KEEP = `${host}/${service}/excel_reports_manager/insert`;
const URL_UPDATE_KEEP = `${host}/${service}/excel_reports_manager/update`;
const URL_DELETE = `${host}/${service}/excel_reports_manager/delete`;


// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 查询数据
api.post('/list', async (req, res) => {
  const {filter, ...others} = req.body;
  const body = {
    ...filter,
    ...others
  };
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(body)));
});

// 新增保存确定
api.post('/save', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_ADD_KEEP, postOption(req.body)));
});


// 编辑保存确定
api.post('/update', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_UPDATE_KEEP, postOption(req.body)));
});

api.delete('/delete/:guid', async (req, res) => {
  const url = `${URL_DELETE}/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url,postOption(null, 'delete')));
});


export default api;

