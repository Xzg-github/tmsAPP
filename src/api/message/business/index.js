import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

let api = express.Router();
const service = `${host}/mq-service`;
const service1 = `${host}/tenant-service`;

// 获取配置信息
api.get('/msg_config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode:0, result:module.default});
});

// 获取所有未读消息
api.get('/msg_unread', async (req, res) => {
  const url = `${service}/msg/receiver/total`;
  res.send(await fetchJsonByNode(req, url));
});

// 获取消息列表--收信箱
api.post('/msg_list', async (req, res)=>{
  const url = `${service}/msg/receiver/list/search`;
  let result = await fetchJsonByNode(req, url, postOption(req.body));
  result.result.data.forEach(o=>{
    if(!o.result) o.result = '发送成功';
    if(o.state === undefined) o.state = 0;
  });
  res.send(result);
});

// 批量设为已读
api.put('/msg_setToRead',async (req, res)=>{
  const url = `${service}/msg/receiver/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

//批量删除
api.delete('/msg_delete', async (req, res) => {
  const url = `${service}/msg/receiver/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

// 获取消息列表--发信箱
api.post('/msg_send_list', async (req, res)=>{
  const url = `${service}/msg/produce/list/search`;
  let data = await fetchJsonByNode(req, url, postOption(req.body));
  if(data.result.data.length>0){
    data.result.data.forEach(item=>{
      item.recipientInfoSplicing = '';
      JSON.parse(item.recipientInfo) && JSON.parse(item.recipientInfo).map(obj=>{
        const {username='',userEmail='',userPhone=''} = obj;
        item.recipientInfoSplicing += `${username} ${userEmail} ${userPhone}`
      })
    });
  }
  res.send(data);
});

// 发送消息
api.post('/msg_send', async (req, res)=>{
  const url = `${service}/msg/produce`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取联系人列表(从通讯录查找)
api.post('/msg_fromMailBook_list', async (req, res)=>{
  const url = `${service}/my_contact/list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取联系人列表(从档案查找)
api.post('/msg_fromArchives_list', async (req, res)=>{
  const url = `${service1}/user/user_or_department`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 获取分组下拉
api.get('/msg_mygroup', async (req, res)=>{
  const url = `${service}/my_contact_group/list`;
  res.send(await fetchJsonByNode(req, url));
});

// 添加分组
api.post('/msg_add_group', async (req, res)=>{
  const url = `${service}/my_contact_group`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 添加联系人
api.post('/msg_add_contact', async (req, res)=>{
  const url = `${service}/my_contact/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 删除联系人
api.post('/msg_delete_contact', async (req, res)=>{
  const url = `${service}/my_contact`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body,'delete')));
});

// 获取通讯录列表
api.post('/mailBook_list', async (req, res)=>{
  const url = `${service}/msg/receiver/list/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
