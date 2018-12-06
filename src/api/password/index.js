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

// 发送验证码
api.post('/send_code', async (req, res) => {
  const url = `${host}/auth-center-provider/password/resetting/sendSecurityCode/${req.body.type}?recipient=${req.body.account}`;
  res.send(await fetchJsonByNode(req, url));
});

// 重置密码
api.put('/reset', async (req, res) => {
  const url = `${host}/auth-center-provider/password/resetting/doReset/${req.body.type}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

export default api;
