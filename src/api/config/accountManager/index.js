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

api.get('/data_roles', async(req, res) => {
  const url = `${host}/auth-center-provider/data_roles`;
  res.send(await fetchJsonByNode(req, url , 'get'));
});


//  加入数据角色
api.post('/data_roles_ok', async (req, res) => {
  const url = `${host}/auth-center/userDataRoleRelation/user_data_role_relations`;
  res.send(await fetchJsonByNode(req, url , postOption(req.body.allChecked)));
});

// api.delete('/data_roles_delete/:id', async (req, res) => {
//   const id = req.params.id;
//   const url = `${host}/auth-center-provider/userDataRoleRelation/user_data_role_relations/${id}`;
//   res.send(await fetchJsonByNode(req, url , postOption(req.body, 'delete')));
// });

api.post('/data_roles_delete', async (req, res) => {
  const url = `${host}/auth-center-provider/userDataRoleRelation/user_data_role_relations/del/batch`;
  res.send(await fetchJsonByNode(req, url , postOption(req.body)));
});

api.post('/list', async (req, res) => {
  const url = `${postUrl}/account/list`;
  const {itemFrom, itemTo, filter} = req.body;
  const postData = {itemFrom, itemTo, ...filter};
  res.send(await fetchJsonByNode(req, url , postOption(postData)));
});

api.post('/search', async (req, res) => {
  const url = `${postUrl}/account/list`;
  res.send(await fetchJsonByNode(req, url , postOption(req.body)));
});

api.post('/role_list', async (req, res) => {
  const url = `${postUrl}/account/${req.body.id}/role`;
  res.send(await fetchJsonByNode(req, url , 'get'));
});

api.get('/roles_list', async (req, res) => {
  const url = `${postUrl}/account/roles`;
  res.send(await fetchJsonByNode(req, url));
});

api.post('/set_role', async (req, res) => {
  const url = `${postUrl}/account/userAndRoles`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

api.post('/del_role', async (req, res) => {
  const url = `${postUrl}/account/delUserAndRoles`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});


export default api;
