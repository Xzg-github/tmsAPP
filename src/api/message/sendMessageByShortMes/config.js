import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
const options1 = [
  {value:1,title:'是'},
  {value:0,title:'否'}
]
const filters =[
  {key: 'sendType', title: '发送方式', type: 'select', options:[{value:0,title:'及时发送'},{value:1,title:'队列发送'},{value:2,title:'定时发送'}]},
  {key: 'mobile', title: '手机号', type: 'text'},
  {key: 'status', title: '发送状态', type: 'select', options:[{value:-1,title:'发送失败'},{value:0,title:'未发送'},{value:1,title:'已发送'},{value:2,title:'部分发送成功'}]},
  {key: 'batchSend', title: '是否群发', type: 'select', options:[{value:0,title:'否'},{value:1,title:'是'}]},
  {key: 'startTime', title: '开始时间' , type: 'date'},
  {key: 'endTime', title: '至', type:'date'}
];

const tableCols =[
  {key: 'mobile', title: '手机号'},
  {key: 'content', title: '发送内容'},
  {key: 'sendType', title:'发送方式',options:[{value:0,title:'及时发送'},{value:1,title:'队列发送'},{value:2,title:'定时发送'}]},
  {key: 'sendDate' ,title:'发送时间'},
  {key: 'status', title: '发送状态', options:[{value:-1,title:'发送失败'},{value:0,title:'未发送'},{value:1,title:'已发送'},{value:2,title:'部分发送成功'}]},
  {key: 'resendNum', title: '重试次数'},
  {key: 'batchSend', title: '是否群发',options:[{value:1,title:'是'},{value:0,title:'否'}]},
  {key: 'insertUser', title: '创建人'},
  {key: 'insertTime', title: '创建时间'}
];

const controls = [
  {key: 'num', title: '流水号'},
  {key: 'mobile', title: '手机号'},
  {key: 'smsAccountId', title: '发送短信账号'},
  {key: 'isSuccess', title: '是否发送成功',options: options1},
  {key: 'sendResult', title: '发送结果'},
  {key: 'isReceive', title: '是否接受成功',options: options1},
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
