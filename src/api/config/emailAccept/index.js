import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {host} from '../../globalConfig';
const service = `${host}/integration_service`;
let api = express.Router();

const URL_EMAIL_LIST = `${service}/email_address_config/list/search`;
const URL_ACCEPT_LIST = `${service}/email_receive_template_config/list/search`;
const URL_EMAIL_DEL = `${service}/email_address_config`;
const URL_USER_LIST = `${host}/tenant-service/user/drop_list`;
const URL_LEAD_LIST = `${service}/import_template_config/drop_list`;
const URL_EMAIL_DROP = `${service}/email_address_config/drop_list`;
const URL_ACCEPT_DEL = `${service}/email_receive_template_config`;
const URL_EXCEL_LIST = `${service}/import_template_config/mode_drop_list`;
const URL_LOG_LIST =`${service}/email_import_log/list/search`;
const URL_LOG_ADDRESS = `${service}/email_import_log/receive`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send(module.default);
});

//获取邮箱配置主列表数据
api.post('/email_list', async (req, res) => {
  // const {filter, ...others} = req.body;
  // let body = {...filter, ...others};
  const data = await fetchJsonByNode(req, URL_EMAIL_LIST, postOption(req.body));
  res.send(data);
});

// 保存邮箱配置
api.post('/email_add', async (req, res) => {
  const url = `${service}/email_address_config`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 修改邮箱配置
api.put('/email_edit', async (req, res) => {
  const url = `${service}/email_address_config`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 激活、失效邮箱配置
api.put('/email_is_active', async (req, res) => {
  const url = `${service}/email_address_config/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//删除邮箱配置
api.delete('/email_del/:id', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${URL_EMAIL_DEL}/${req.params.id}`, postOption(null, 'delete')));
});

//获取用户下拉列表
api.post('/user_name', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_USER_LIST, postOption(req.body)));
});


//获取邮箱接收配置主列表数据
api.post('/accept_list', async (req, res) => {
  // const {filter, ...others} = req.body;
  // let body = {...filter, ...others};
  res.send(await fetchJsonByNode(req, URL_ACCEPT_LIST, postOption(req.body)));
});

//获取导入摸板
api.post('/lead_list', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_LEAD_LIST, postOption(req.body)));
});

//获取接收邮箱下拉列表
api.post('/email_drop/', async (req, res) => {
  res.send(await fetchJsonByNode(req, URL_EMAIL_DROP, postOption(req.body)));
});

// 新增邮箱接收配置
api.post('/accept_add', async (req, res) => {
  const url = `${service}/email_receive_template_config/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 更新邮箱接收配置
api.put('/accept_edit', async (req, res) => {
  const url = `${service}/email_receive_template_config`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 激活、失效邮箱接收配置
api.put('/accept_is_active', async (req, res) => {
  const url = `${service}/email_receive_template_config/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//删除邮箱接收配置
api.delete('/accept_del/:id', async (req, res) => {
  res.send(await fetchJsonByNode(req, `${URL_ACCEPT_DEL}/${req.params.id}`, postOption(null, 'delete')));
});

// 获取导入模式下拉
api.get('/excel/:id', async (req, res) => {
  const url = `${URL_EXCEL_LIST}/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

//获取接受日志主列表数据
api.post('/log_list', async (req, res) => {
  const {filter, ...others} = req.body;
  let body = {...filter, ...others};
  const data = await fetchJsonByNode(req, URL_LOG_LIST, postOption(body));
  res.send(data);
});

// 删除
api.delete('/log_del', async (req, res) => {
  const url = `${service}/email_import_log/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

// 获取
api.get('/log_accept/:email_address', async (req, res) => {
  const url = `${URL_LOG_ADDRESS}/${req.params.email_address}`;
  res.send(await fetchJsonByNode(req, url));
});

export default api;
