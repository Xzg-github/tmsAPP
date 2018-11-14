
export default {
  list:{
    "returnCode": 0,
    "returnMsg": "成功",
    "result": {
      "returnTotalItem": 0,
      "data": [
        {
          "id": "索引",
          "content": "消息体",
          "level": "消息级别",
          "type": "消息类别",
          "title": "消息标题",
          "recipientInfo": "接收人信息",
          "sendMethod": "发送方式",
          "senderInfo": "发送人信息",
          "senderId": "发送人标识",
          "state": "状态",
          "receiverId": "接收人标识",
          "callback": "回调url",
          "result": "发送结果"
        }
      ]
    }
  },
  unreadList:[{
    title:'消息名称',
    type:'msg_order',
    total:1
  },{
    title:'消息名称',
    type:'msg_dispatch',
    total:2
  },{
    title:'消息名称',
    type:'msg_track',
    total:3
  },{
    title:'消息名称',
    type:'msg_abnormal',
    total:4
  },{
    title:'消息名称',
    type:'msg_system',
    total:5
  }],
  sendList:{
    "returnCode": 0,
    "returnMsg": "成功",
    "result": {
      "returnTotalItem": 0,
      "data": [
        {
          "id": "1",
          "content": "2",
          "level": "3",
          "type": "4",
          "title": "5",
          "recipientInfo": "6",
          "sendMethod": "7",
          "senderInfo": "8",
          "senderId": "9",
          "state": "状态",
          "receiverId": "10",
          "callback": "11",
          "result": "12"
        }
      ]
    }
  },
  mailBookList:{
    "returnCode": 0,
    "returnMsg": "成功",
    "result": {
      "returnTotalItem": 0,
      "data": [
        {
          "id": "1",
          "content": "2",
          "level": "3",
          "type": "4",
          "title": "5",
          "recipientInfo": "6",
          "sendMethod": "7",
          "senderInfo": "8",
          "senderId": "9",
          "state": "状态",
          "receiverId": "10",
          "callback": "11",
          "result": "12"
        }
      ]
    }
  },
  fromMailBook:{
    "returnCode": 0,
    "returnMsg": "成功",
    "result": [
      {
        "contactName": "姓名",
        "mobile": "手机号",
        "email": "邮箱",
        "post": "职务",
        "groupName": "组名"
      }
    ]
  }
};
