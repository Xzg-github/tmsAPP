import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';

const sendStatus = [
  {value: 1, title: '发送成功'},
  {value: 0, title: '发送失败'}
];

const isPriority = [
  {value: 1, title: '是'},
  {value: 0, title: '否'}
];

const isSsl =[
  {value: 1, title: '是'},
  {value: 0, title: '否'}
];

const isSuccess = [
  {value: 1, title: '是'},
  {value: 0, title: '否'}
]
const filters =[
  {key: 'senderMail', title: '发送人邮件', type: 'text'},
  {key: 'senderName', title: '发送人姓名', type: 'text'},
  {key: 'recipientMail', title: '接收人邮箱', type: 'text'},
  {key: 'subject', title: '邮件主题', type: 'text'},
  {key: 'status', title: '发送状态' , type: 'select',options: sendStatus},
  {key: 'resendNum', title: '重试次数', type:'text'},
  {key: 'startTime', title: '开始时间' , type: 'date'},
  {key: 'endTime', title: '至', type:'date'}

];

const tableCols =[
  {key: 'senderMail', title: '发送人邮件'},
  {key: 'senderName', title: '发送人姓名'},
  {key: 'recipientName', title:'接受人姓名'},
  {key: 'recipientMail' ,title:'接收人邮箱'},
  {key: 'recipientCls', title: '抄送'},
  {key: 'subject', title: '邮件主题'},
  {key: 'mailFile', title: '附件名称'},
  {key: 'isPriority ', title: '是否加急邮件',options: isPriority},
  {key: 'isSsl', title: '是否使用SSL发送', options: isSsl},
  {key: 'sendDate', title: '发送时间'},
  {key: 'status', title: '发送状态', options: sendStatus},
  {key: 'resendNum', title: '重试次数'},
  {key: 'insertUser', title: '创建人'},
  {key: 'insertTime', title: '创建时间'}
];

const controls = [
  {key: 'num', title: '流水号'},
  {key: 'isSuccess', title: '是否发送成功'},
  {key: 'sendResult', title: '发送结果'},
  {key: 'isSuccess', title: '是否发送成功',options: isSuccess},
  {key: 'insertUser', title: '创建人'},
  {key: 'insertTime', title: '创建时间'}
]
const index ={
  filters,
  tableCols,
  pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig,
  buttons:[]
}

const edit ={
  controls,
  edit: '短信流水',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit,
  dicNames: []
};

export default config;
