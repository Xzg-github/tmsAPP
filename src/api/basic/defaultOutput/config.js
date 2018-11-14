import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';


const filters = [
  {key: 'outputType', title: '输出类型',type: 'select',from:'dictionary', position:name.REPORT_OUTPUT_TYPE},
  {key: 'reportTypeConfigId', title: '模板类型',type: 'search'},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'defaultOutput_add'},
  {key: 'edit', title: '编辑', sign: 'defaultOutput_edit'},
  {key: 'del', title: '删除', sign: 'defaultOutput_del'},
];

const tableCols = [
  {key: 'outputType', title: '输出类型',type: 'select',from:'dictionary', position:name.REPORT_OUTPUT_TYPE},
  {key: 'reportTypeConfig', title: '模板类型'},
  {key: 'customer', title: '客户'},
  {key: 'supplier', title: '供应商'},
  {key: 'taskUnitCode', title: '作业单元'},
  {key: 'emialMode', title: '邮件模板名称'},
  {key: 'email', title: '接收邮箱'},
  {key: 'smsMode', title: '短信模板'},
  {key: 'iphone', title: '手机号码'},
  {key: 'institution', title: '操作机构'}
];


const controls = [
  {key: 'outputType', title: '输出类型',type: 'select',from:'dictionary', position:name.REPORT_OUTPUT_TYPE,required:true},
  {key: 'reportTypeConfigId', title: '模板类型',type: 'search',required:true},
  {key: 'customerId', title: '客户',type: 'search'},
  {key: 'supplierId', title: '供应商',type: 'search'},
  {key: 'taskUnitCode', title: '作业单元',type: 'search'},
  {key: 'institutionId', title: '操作机构',type: 'search'},
];


const index = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig
};


const edit = {
  controls,
  buttons: [
    {key: 'add', title: '新增'},
    {key: 'delete', title: '删除'},
    {key: 'addRecivers', title: '设置接收信息'},
  ],

  tableCols : [
    {key: 'checked', title: '', type: 'checkbox'},
    {key: 'index', title: '序号', type: 'index'},
    {key: 'reciverType', title: '类别',type: 'select',from:'dictionary', position:name.NOTIFY_TYPE,required:true},
    {key: 'reportConfigId', title: '模板名称', type: 'search',required:true},
    {key: 'recivers', title: '接受信息', type: 'readonly',required:true},
    {key: 'remark', title: '其他', type: 'text'},
  ],
  tableItems: [],
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit,
  dicNames: [name.REPORT_OUTPUT_TYPE,name.NOTIFY_TYPE]
};

export default config;



