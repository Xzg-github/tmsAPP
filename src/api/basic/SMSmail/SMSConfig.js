const filters = [ // 搜索条件
  {key: 'account', title: '帐号名',type: 'text'},
  {key: 'supplierType', title: '供应商类型',type: 'select', dictionary: 'supplierType'},
];

const tableCols = [  // 新增页面表格字段
  {key: 'account', title: '帐号名'},
  {key: 'priority', title: '优先级'},
  {key: 'supplierType', title: '供应商类型', dictionary: 'supplierType'},
  {key: 'url', title: 'HOST'},
];

const controls = [
  {key: 'account', title: '帐号名',type:'text',required:true},
  {key: 'password', title: '密码',type:'password',required:true},
  {key: 'againPassword', title: '再次输入密码',type:'password',required:true},
  {key: 'priority', title: '优先级',type:'text'},
  {key: 'supplierType', title: '供应商类型',type:'select',dictionary: 'supplierType',required:true},
  {key: 'url', title: 'HOST',type:'text',required:true
  },
];

const SMSConfig = {
  filters,
  tableCols,
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

export default SMSConfig;
