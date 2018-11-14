import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();

const localTest = false;
const service = 'archiver_service';

const URL_LIST = `${host}/${service}/search/car_mode`;
const URL_DEL = `${host}/${service}/car_mode`;
const URL_ACTIVE = `${host}/${service}/car_mode/active`;
const SAVE_URL = `${host}/${service}/car_mode`;

// 获取界面信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

//获取主列表数据
api.post('/list', async (req, res) => {
  if(localTest) {
    const module = await require('./data');
    res.send(module.default);
    return;
  }
  const {filter, ...others} = req.body;
  let body = {...filter, ...others};
  res.send(await fetchJsonByNode(req, URL_LIST, postOption(body)));
});

//新增
api.post('/',async (req, res)=>{
  if(localTest) {
    res.send({returnCode: 0, result:{guid: '201703262', active: 0, ...req.body}});
    return;
  }
  res.send(await fetchJsonByNode(req, SAVE_URL, postOption(req.body)));
});

//编辑
api.put('/',async (req, res)=>{
  if(localTest) {
    res.send({returnCode: 0, result:{...req.body} });
    return;
  }
  res.send(await fetchJsonByNode(req, SAVE_URL, postOption(req.body, 'put')));
});

//删除
api.delete('/:guid', async (req, res) => {
  if(localTest) {
    res.send({returnCode: 0, result:{active:4} });
    return;
  }
  const guid = req.params.guid;
  res.send(await fetchJsonByNode(req, `${URL_DEL}/${guid}`, postOption(null, 'delete')));
});

//激活
api.put('/active/:guid', async (req, res) => {
  if(localTest) {
    res.send({returnCode: 0, result:{active:2} });
    return;
  }
  const guid = req.params.guid;
  res.send(await fetchJsonByNode(req, `${URL_ACTIVE}/${guid}`, postOption(null, 'put')));
});

export default api;
