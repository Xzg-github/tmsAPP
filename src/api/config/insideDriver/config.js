import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  // {key: 'supplierName', title: '所属供应商', type: 'text'},
  {key: 'institutionId', title: '归属机构',type:'search'},
  {key: 'driverName', title: '司机姓名', type: 'text'},
  {key: 'enabledType', title: '状态', type: 'select', dictionary: name.ENABLED_TYPE}
];

const tableCols = [
  {key: 'institutionId', title: '归属机构'},
  {key: 'enabledType', title: '状态', dictionary: name.ENABLED_TYPE},
  {key: 'driverName', title: '司机姓名'},
  {key: 'idCardNumber', title: '司机身份证'},
  {key: 'englishName', title: '英文名'},
  {key: 'driverMobilePhone', title: '手机号码'},
  {key: 'shortNumber', title: '短号'},
  {key: 'otherRemark', title: '其他说明'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'insideDriver_add'},
  {key: 'edit', title: '编辑', sign: 'insideDriver_edit'},
  {key: 'active', title: '启用', sign: 'insideDriver_active'},
  {key: 'inactive', title: '禁用', sign: 'insideDriver_inactive'},
  {key: 'del', title: '删除', sign: 'insideDriver_del', confirm:'是否确定删除'},
  {key: 'import', title: '导入', sign: 'insideDriver_import'},
  {key: 'insideDriver_export', title: '导出', menu:[
    { key: 'exportSearch', title: '查询导出'},
    { key: 'exportPage', title: '页面导出'},
  ]},
];

const controls = [
  {key: 'institutionId', title: '归属机构', type: 'search'},
  {key: 'driverName', title: '司机姓名', type: 'text', required: true},
  {key: 'idCardNumber', title: '司机身份证', type: 'text'},
  {key: 'englishName', title: '英文名', type: 'text'},
  {key: 'driverMobilePhone', title: '手机号码', type: 'text', required: true},
  {key: 'shortNumber', title: '短号', type: 'text', required: true},
  {key: 'otherRemark', title: '其他说明', type: 'text'},
  {key: 'enabledType', title: '状态', type: 'readonly', dictionary: name.ENABLED_TYPE}
];

const index = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  description,
  searchConfig
};

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit,
  names: [name.ENABLED_TYPE]
};

export default config;
