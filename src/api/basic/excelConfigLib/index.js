import express from 'express';
import { postOption, fetchJsonByNode } from '../../../common/common';
import { host } from '../../globalConfig';

const PORT = `${host}/integration_service/excelModelConfig/`;
const URL_MODEL_TYPE = `${host}/integration_service/excelModelConfig/listStandardApiByCurrentTenentId`;
const URL_ADD = `${host}/integration_service/apiStandardLibrary/selectById?id=`;
const URL_OPTIONS = `${host}/integration_service/apiStandardLibrary/listFieldTitle`;
const api = express.Router();

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({ returnCode: 0, result: module.default });
});

// 1.获取列表
api.post('/list', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${PORT}listByCondition`, postOption(req.body, 'POST')));
});

// 2.新增--获取类型
api.get('/tenantModelType', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_MODEL_TYPE));
});

// 3.新增-- 初始化数据
api.get('/add/:api_standard_library_id', async (req, res) => {
  const api_standard_library_id = req.params.api_standard_library_id;
  res.send(await fetchJsonByNode(req, `${URL_ADD}${api_standard_library_id}`));
});

// 4.编辑保存
api.post('/edit', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${PORT}editExcelModel`, postOption(req.body, 'POST')));
});

// 5.新增保存
api.post('/insertExcelModel', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${PORT}insertExcelModel`, postOption(req.body, 'POST')));
});

// 6.编缉获取
api.get('/selectExcelModel/:id', async (req, res) => {
  const id = req.params.id;
  res.send(await fetchJsonByNode(req, `${PORT}selectExcelModelByExcelModelConfigId?id=${id}`));
});

// 7. 删除
api.delete('/excelModelConfig/:id', async (req, res) => {
  const id = req.params.id;
  res.send(await fetchJsonByNode(req, `${PORT}?id=${id}`, postOption(req.body, 'DELETE')));
});

// 8. 生成模板
api.get('/generateExcelModel/:id', async (req, res) => {
  const id = req.params.id;
  res.send(await fetchJsonByNode(req, `${PORT}generateExcelModel?id=${id}`));
});

// 'Content-type' : 'multipart/form-data, boundary=AaB03x'
// 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
// 9.上传
api.post('/uploadExcelModel', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${PORT}uploadExcelModel`, { method: 'post', body: req.body }));
});

//获取唯一字段下拉选项
api.get('/options/:api_standard_library_id', async (req, res) => {
  const api_standard_library_id = req.params.api_standard_library_id;
  res.send(await fetchJsonByNode(req, `${URL_OPTIONS}/${api_standard_library_id}`));
});

export default api;
