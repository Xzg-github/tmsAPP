import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';

let api = express.Router();

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send(module.default);
});
//删除用户
api.post('/delete', async(req, res)=> {
  res.send({returnCode: 0})
});
//添加用户
api.post('/add', async(req, res)=> {
  res.send({returnCode: 0})
});
// 获取角色树
api.get('/list', async (req, res) => {
  res.send({
    returnCode: 0,
    result: [
      {title: '超级管理员', value: {guid: '20170402'}},
      {title: '管理员', value: {guid: '20170402'}},
      {title: '普通角色', value: {guid: '20170403'}}
    ]
  });
});

// 依据角色guid获取用户信息
api.get('/users', async (req, res) => {
  res.send(users);
});

//请求用户or部门
api.post('/search', async (req, res) => {
  if (req.body.name === "departmentName") {
    //部门名称
    res.send(obj);
  } else if (req.body.name === "username") {
    //用户名称
    res.send(obj);
  }

});

// 修改权限
api.post('/change', async (req, res) => {
  res.send({returnCode: 0});
});

const users = {
  "returnCode": "返回码int",
  "returnMsg": "返回信息",
  "result": {
    "tenantRoleUserRelation": [
      {
        'guid': 'sdkafjk-545',
        "departmentName": {
          "value": "部门Guid",
          "title": "部门"
        },
        "username": {
          "value": "用户Guid",
          "title": "用户名称"
        },
        "userPosition": "岗位（来自字典user_position）"
      }
    ],
    "tenantRoleConfigRelation": [
      {
        "title": "订单中心",
        "type": "order",
        "value": {"guid": "标sdffs识"},
        "children": [
          {
            "title": "订单录入",
            "type": "input",
            "value": {"guid": "标sgds识", "isAuthorized": 0},
            "children": [
              {
                "title": "新增",
                "type": "new",
                "value": {"guid": "标sdsdsg识", "isAuthorized": 0}
              }, {
                "title": "复制新增",
                "type": "copy",
                "value": {"guid": "标swffg识", "isAuthorized": 1}
              }, {
                "title": "编辑",
                "type": "edit",
                "value": {"guid": "标xfsdfcv识", "isAuthorized": 0}
              }
            ]
          }
        ]
      }
    ]
  }
};

let obj = {
  returnCode: 0,
  returnMsg: "返回消息--int",
  result: {
    returnTotalItem: "返回查询总条数",
    data: [
      {
        guid: "用户GUIDccs",
        departmentName: "用户名称"
      },
      {
        guid: "用户GUIDcc",
        departmentName: "用户名称222"
      }
    ]
  }
};
export default api;
