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

api.post('/tenant_list', async (req, res) => {
  const url = `${postUrl}/tenant_drop_List`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

api.post('/tenant_Authority_tree', async (req, res) => {
  const url = `${postUrl}/tenant_resource/${req.body.id}`;
  res.send(await fetchJsonByNode(req, url, 'get'));
});

api.post('/authority_move', async (req, res) => {
  const url = `${postUrl}/tenant_resource/${req.body.id}/move`;
  const postData = {
    moveMode: req.body.moveMode,
    nodeIds: req.body.nodeIds,
  };
  res.send(await fetchJsonByNode(req, url, postOption(postData, 'put')));
});


export default api;
