const options = [
  {value:0,title:'系统消息'},
  {value:1,title:'订单消息'},
  {value:2,title:'派单消息'},
  {value:3,title:'跟踪消息'},
  {value:4,title:'异常消息'},
];

const options1 = [
  {value:0,title:'否'},
  {value:1,title:'是'}
];

const filters = [

];

const tableCols = [
  {key:'id',title:'消息标题'},
  {key:'type',title:'消息类别',options},
/*  {key:'isProductType',title:'是否关联服务类型',options:options1},
  {key:'isTaskUnitType',title:'是否关联作业单元',options:options1},
  {key:'isLifecycle',title:'是否关联生命周期节点',options:options1},*/
  {key:'isCustomer',title:'是否关联客户',options:options1},
  {key:'isSupplier',title:'是否关联供应商',options:options1},
  {key:'isInstitution',title:'是否关联机构',options:options1},
  {key:'isDepartment',title:'是否关联部门',options:options1},
  {key:'remark',title:'说明'},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'del', title: '删除',confirm:'确认是否删除？'},
];

const controls = [
  {key:'id',title:'消息标题',type:'text',required:true},
  {key:'type',title:'消息类别',options,type:'select',required:true},
/*  {key:'isProductType',title:'是否关联服务类型',options:options1,type:'radioGroup'},
  {key:'isTaskUnitType',title:'是否关联作业单元',options:options1,type:'radioGroup'},
  {key:'isLifecycle',title:'是否关联生命周期节点',options:options1,type:'radioGroup'},*/
  {key:'isCustomer',title:'是否关联客户',options:options1,type:'radioGroup'},
  {key:'isSupplier',title:'是否关联供应商',options:options1,type:'radioGroup'},
  {key:'isInstitution',title:'是否关联机构',options:options1,type:'radioGroup'},
  {key:'isDepartment',title:'是否关联部门',options:options1,type:'radioGroup'},
  {key:'remark',title:'备注',type:'textArea',span:2},
];

const index = {
  filters,
  buttons,
  tableCols,
};

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  size: 'middle',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit,
};

export default config;
