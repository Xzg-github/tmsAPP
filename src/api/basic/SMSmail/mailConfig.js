const filters = [ // 搜索条件
  {key: 'account', title: '帐号名',type: 'text'},
  {key: 'hostName', title: 'HostName',type: 'text'},
  {key: 'mailType', title: '邮箱后缀',type: 'text'},
];

const tableCols = [  // 新增页面表格字段
  {key: 'account', title: '帐号名'},
  {key: 'hostName', title: 'HostName'},
  {key: 'mailType', title: '邮箱后缀'},
  {key: 'port', title: '端口'},
  {key: 'priority', title: '优先级'},
  {key: 'sslPort', title: 'SSL端口'},
];

const controls = [
  {key: 'account', title: '帐号名',type:'text',required:true},
  {key: 'hostName', title: 'HostName',type:'text',required:true},
  {key: 'mailType', title: '邮箱后缀',type:'text',required:true},
  {key: 'password', title: '密码',type:'password',required:true},
  {key: 'againPassword', title: '再次输入密码',type:'password',required:true},
  {key: 'port', title: '端口',type:'text'},
  {key: 'priority', title: '优先级',type:'text'},
  {key: 'sslPort', title: 'SSL端口',type:'text',required:true},
];


const mailConfig = {
  filters,
  tableCols,
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

export default mailConfig;
