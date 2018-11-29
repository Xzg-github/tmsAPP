import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();

const service = 'archiver-service';

const URL_LIST = `${host}/${service}/supplier_charge_item/list`;
const URL_ADD = `${host}/${service}/supplier_charge_item/insert`;
const URL_EDIT = `${host}/${service}/supplier_charge_item/update`;
const URL_DEL = `${host}/${service}/supplier_charge_item/delete`;

// 获取界面信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result:module.default});
});

//获取主列表数据
api.post('/list', async (req, res) => {
  const {filter, ...others} = req.body;
  const body = {
    ...filter,
    ...others
  };
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(body)));
});

//新增
api.post('/add',async (req, res)=>{
  res.send(await fetchJsonByNode(req, URL_ADD, postOption(req.body)));
});

//编辑
api.post('/edit',async (req, res)=>{
  res.send(await fetchJsonByNode(req, URL_EDIT, postOption(req.body)));
});


//删除
api.delete('/del', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${URL_DEL}`, postOption(req.body, 'delete')));
});


export default api;
