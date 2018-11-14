import express from 'express';
import {host} from '../globalConfig';
import {fetchJsonByNode, postOption} from '../../common/common';
let api = express.Router();

const modifyConfig = {
  old: '请输入旧密码',
  new: '请输入新密码',
  confirm: '请确认新密码',
  title: '修改密码',
  ok: '确定'
};

api.get('/modify/config', (req, res) => {
  res.send({returnCode: 0, result: modifyConfig});
});

api.put('/modify', async (req, res) => {
  const url = `${host}/tenant_service/user/change/password`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 发送找回密码的邮件
api.put('/mail', async (req, res) => {
  const url = `${host}/auth-center-provider/account/findPasswordByEmail`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 重置密码
api.put('/reset', async (req, res) => {
  const url = `${host}/auth-center-provider/account/user/userResetByEmail`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

export default api;
