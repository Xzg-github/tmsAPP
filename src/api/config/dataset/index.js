import express from 'express';
import {host} from '../../globalConfig';
import {fetchJsonByNode, postOption} from '../../../common/common';

const reportService = `${host}/report-service`;
const reportService1 = `${host}/report-service`;

let api = express.Router();
// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({
    returnCode: 0,
    result: module.default
  });
});

// 获取UI标签
api.get('/data', async (req, res) => {
  const module = await require('./dataSet1');
  res.send({
    returnCode: 0,
    result: module.default
  });
});

// 获取单条信息
api.get('/tableItems/:id', async (req, res) => {
  const url= `${reportService}/output_type_config/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url, postOption(null, 'get')));
});


// 获取数据集列表
api.post('/list', async (req, res) => {
  const url= `${reportService}/reportdataset/list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 删除数据集记录
api.post('/del', async (req, res) => {
  const url= `${reportService}/reportdataset/${req.body.id}`;
  res.send(await fetchJsonByNode(req, url, 'delete'));
});

// 提交数据集记录
api.post('/add' , async(req, res) => {
  const url= `${reportService}/reportdataset/`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取指定ID数据集记录
api.post('/get', async (req, res) => {
  const url= `${reportService}/reportdataset/${req.body.id}`;
  res.send(await fetchJsonByNode(req, url, 'get'));
});

// 获取输出类型列表
api.post('/outputList', async (req, res) => {
  const url= `${reportService}/output_type_config/list/search`;
  const {filter, ...others} = req.body;
  let body = {...filter, ...others};
  res.send(await fetchJsonByNode(req, url, postOption(body)));
});

//新增
api.post('/addOutput',async (req, res)=>{
  const url= `${reportService}/output_type_config/`;

  res.send(await fetchJsonByNode(req, url, postOption(req.body,'post')));
});

// 编辑
api.put('/addOutput', async (req, res) => {
  const url= `${reportService}/output_type_config/`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//删除
api.delete('/del/:id', async (req, res) => {
  const url= `${reportService}/output_type_config/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url, postOption(null, 'delete')));
});


//模板类型下拉
api.post('/reportType',async (req, res)=>{
  const url= `${reportService1}/reportconfig/dropList/reportType`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});



export default api;
