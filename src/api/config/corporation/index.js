import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const service = 'archiver-service';

const URL_LIST = `${host}/${service}/TenantCorporateInfoDto/listByRelationId`;
const URL_PERSON_INFO = `${host}/${service}/TenantCorporateInfoDto/selectById`;
const URL_DEL = `${host}/${service}/TenantCorporateInfoDto/delete`;

// 法人档案: 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

//获取法人主列表数据
api.post('/list', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(req.body)));
});

//获取单条法人详细信息
api.get('/info/:id', async (req, res) => {
  const id = req.params.id;
  res.send(await fetchJsonByNode(req, `${URL_PERSON_INFO}/${id}`));
});

// 法人档案: 删除
api.delete('/', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_DEL, postOption(req.body)));
});


// 法人档案: 新增
api.post('/', async (req, res) => {
  const url = `${host}/${service}/TenantCorporateInfoDto/insertTenantCorporateInfo`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 法人档案: 编辑
api.put('/', async (req, res) => {
  const url = `${host}/${service}/TenantCorporateInfoDto/updateTenantCorporateInfo`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//获取归属法人下拉列表
api.get('/options/corporations', async (req, res) => {
  const body = {
    institutionName: req.query.filter
  };
  const url = `${host}/tenant-service/institution/legal_person/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(body)));
});

export default api;
