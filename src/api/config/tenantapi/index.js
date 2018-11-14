import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const service = 'integration_service';
const URL_LIST = `${host}/${service}/tenantApiStandardLibrary/selectByCondition`;

const URL_ALL_NAME = `${host}/${service}/tenantApiStandardLibrary/listUnallocatedApi`;
const URL_DEL = `${host}/${service}/tenantApiStandardLibrary/deleteBatchApiStandardLibraryIds`;
const URL_SAVE = `${host}/${service}/tenantApiStandardLibrary/insertBatchUnallocatedApi`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send(module.default);
});

//获取主列表数据
api.post('/list', async (req, res) => {
  const data = await fetchJsonByNode(req, URL_LIST, postOption(req.body));
  res.send(data);
});

//获取选择数据
api.get('/all_name', async (req, res) => {
  const data = await fetchJsonByNode(req, `${URL_ALL_NAME}?tenantId=${req.query.tenantId}`);
  res.send(data);
});

// //获取租户下拉列表  =>改成用志鹏页面的借口
// api.post('/tenant_name', async (req, res) => {
//   const {filter, ...others} = req.body;
//   let body = {...filter, ...others};
//   res.send(await fetchJsonByNode(req, URL_TENANT_NAME, postOption(body)));
// });

//删除
api.delete('/', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_DEL, postOption(req.body.ids, 'delete')));
});

//保存
api.post('/save', async(req, res) => {
  const tenantId = req.query.tenantId;
  res.send(await fetchJsonByNode(req, `${URL_SAVE}?tenantId=${tenantId}`, postOption(req.body)));
});

export default api;
