import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';
const service = `${host}/report-service`;
const service1 = `${host}/report-service`;
let api = express.Router();

const URL_LIST = `${service}/often_output_template/list/search`;
const URL_SAVE = `${service}/often_output_template/batch/`;
const URL_REPORT = `${service1}/report/drop_list`;
const URL_CAR_TYPE = `${host}/archiver_service/car_mode/drop_list`;

// 获取界面信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取主列表数据
api.post('/list', async (req, res) => {
  const {filter, ...others} = req.body;
  let body = {...filter, ...others};
  res.send(await fetchJsonByNode(req, URL_LIST,  postOption(body)));
});


// 新增
api.post('/add',async (req, res)=>{
  res.send(await fetchJsonByNode(req, URL_SAVE, postOption(req.body)));
});


// 删除
api.delete('/del/:id',async (req, res)=>{
  const url= `${service}/often_output_template/batch/?ids=${req.params.id}`;
  res.send(await fetchJsonByNode(req, url, postOption(null, 'delete')));
});



// 获取模板名称
api.get('/reportName/:guid', async (req, res) => {
  const url = `${URL_REPORT}/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url));
});

export default api;
