import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {host} from '../../globalConfig';

const postUrl = `${host}/auth-center`;

let api = express.Router();

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({
    returnCode: 0,
    result: module.default
  });
});

api.post('/save', async (req, res) => {
  const url = `${postUrl}/role/save`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

api.post('/update', async (req, res) => {
  const url = `${postUrl}/role/update`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

api.get('/list', async (req, res) => {
  const url = `${postUrl}/role/list`;
  res.send(await fetchJsonByNode(req, url, 'get'));
});

api.post('/active', async (req, res) => {
  const url = `${postUrl}/role/${req.body.id}/active`;
  res.send(await fetchJsonByNode(req, url, 'put'));
});

api.post('/invalid', async (req, res) => {
  const url = `${postUrl}/role/${req.body.id}/invalid`;
  res.send(await fetchJsonByNode(req, url, 'put'));
});

api.post('/tree', async (req, res) => {
  const url = `${postUrl}/role_relation/${req.body.id}/tree`;
  res.send(await fetchJsonByNode(req, url, 'get'));
});

api.post('/move', async (req, res) => {
  const url = `${postUrl}/role_relation/${req.body.id}/move`;
  const postData = {
    moveMode: req.body.moveMode,
    nodeIds: req.body.nodeIds,
  };
  res.send(await fetchJsonByNode(req, url, postOption(postData, 'put')));
});


export default api;
