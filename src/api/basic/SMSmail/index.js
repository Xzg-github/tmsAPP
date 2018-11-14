import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';
let api = express.Router();

const service = `${host}/notify-center-service`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

//短信列表
api.post('/smsList',async(req,res) => {
  const url = `${service}/tenant_account/sms/list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//邮件列表
api.post('/mailList',async(req,res) => {
  const url = `${service}/tenant_account/email/list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//短信新增
api.post('/smsAdd',async(req,res) => {
  const url =`${service}/tenant_account/sms/insertEditSmsAccount`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

//短信删除
api.post('/smsDel',async(req,res) => {
  const url =`${service}/tenant_account/sms/deleteByIds`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

//短信设置密码
api.post('/smsPassword',async(req,res) => {
  const url =`${service}/tenant_account/email/setPassword`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

//邮件新增
api.post('/mailAdd',async(req,res) => {
  const url =`${service}/tenant_account/email/insertEditEmailAccount`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

//邮件删除
api.post('/mailDel',async(req,res) => {
  const url =`${service}/tenant_account/email/deleteByIds`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

//邮件设置密码
api.post('/mailPassword',async(req,res) => {
  const url =`${service}/tenant_account/email/setPassword`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});


export default api;
