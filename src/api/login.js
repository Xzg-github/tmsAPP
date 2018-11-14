import express from 'express';
import {fetchJson, fetchJsonByNode, postOption} from '../common/common';
import {host, privilege} from './globalConfig';
let api = express.Router();

const WEEK = 7 * 24 * 3600 * 1000;

api.post('/', async (req, res) => {
  if (privilege) {
    const url = `${host}/auth-center/authc/authenticate`;
    const json = await fetchJson(url, postOption(req.body));
    if (json.returnCode === 0) {
      res.cookie('token', json.result.token, {httpOnly: true});
      res.cookie('username', req.body.account, {maxAge: WEEK});
      res.send({returnCode: 0});
    } else {
      res.send(json);
    }
  } else {
    res.cookie('token', '20170803040015', {httpOnly: true});
    res.cookie('username', req.body.account, {maxAge: WEEK});
    res.send({returnCode: 0});
  }
});

api.put('/revoke', (req, res) => {
  res.cookie('token', '', {httpOnly: true, maxAge: 0});
  res.send({returnCode: 0});
});

api.get('/person', async (req, res) => {
  const url = `${host}/tenant-service/user`;
  res.send(await fetchJsonByNode(req, url));
});

api.get('/mode', async (req, res) => {
  const url = `${host}/integration_service/excelModelConfig/template/list`;
  res.send(await fetchJsonByNode(req, url));
});

export default api;
