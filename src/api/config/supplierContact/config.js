import {pageSize, pageSizeType, description, searchConfig} from "../../globalConfig";
import name from '../../dictionary/name';

//搜索栏配置
const filters = [
  {key: 'supplierId', title: '供应商标识', type: 'search'},
  {key: 'contactName', title: '联系人姓名', type: 'text'},
  {key: 'contactTelephone', title: '联系人电话', type: 'text'},
  {key: 'contactMobile', title: '联系人手机', type: 'text'},
  {key: 'enabledType', title: '状态', type: 'select', dictionary: name.ENABLED_TYPE}
];

//列表Item
const tableCols = [
  {key: 'enabledType', title: '状态',dictionary: name.ENABLED_TYPE},
  {key: 'supplierId', title: '供应商标识'},
  {key: 'contactName', title: '联系人姓名'},
  {key: 'contactEnglishName', title: '英文名'},
  {key: 'sexType', title: '性别',dictionary: name.SEX},
  {key: 'contactTelephone', title: '联系人电话', type: 'number'},
  {key: 'contactMobile', title: '手机', type: 'number'},
  {key: 'contactFax', title: '传真', type: 'number'},
  {key: 'contactEmail', title: '电子邮件'},
  {key: 'contactPosition', title: '职务'},
  {key: 'contactSpeciality', title: '特长'},
  {key: 'contactNativePlace', title: '籍贯'},
  {key: 'contactBirthday', title: '生日'},
  {key: 'remark', title: '备注'},
  {key: 'isDefault', title: '是否默认', dictionary: name.ZERO_ONE_TYPE},
  {key: 'insertTime', title: '创建时间'},
  {key: 'insertUser', title: '创建用户'},
  {key: 'updateTime', title: '更新时间'},
  {key: 'updateUser', title: '更新用户'}
];

//toolbar
const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'customerContact_add'},
  {key: 'edit', title: '编辑', sign: 'customerContact_edit'},
  {key: 'delete', title: '删除', sign: 'customerContact_delete', confirm: '确认删除选中记录'},
  {key: 'enable', title: '启用', sign: 'customerContact_enable'},
  {key: 'disable', title: '禁用', sign: 'customerContact_disable'},
  {key: 'import', title: '导入', sign: 'customerContact_import'},
  {key: 'export', title: '导出', sign: 'customerContact_export', menu: [
      { key: 'exportSearch', title: '查询导出'},
      { key: 'exportPage', title: '页面导出'},
      { key: 'templateManager', title: '模板管理'}
    ]}
];

const index = {
  filters,
  buttons,
  tableCols,
  pageSizeType,
  pageSize,
  description,
  searchConfig
};

//编辑界面表单
const controls = [
  {key: 'supplierId', title: '供应商标识', type: 'search', required: true},
  {key: 'contactName', title: '联系人姓名', type: 'text', required: true},
  {key: 'contactEnglishName', title: '英文名', type: 'text'},
  {key: 'sexType', title: '性别',type: 'select', dictionary: name.SEX, required: true},
  {key: 'contactTelephone', title: '联系人电话', type: 'text'},
  {key: 'contactMobile', title: '联系人手机', type: 'number', required: true},
  {key: 'contactFax', title: '传真', type: 'text'},
  {key: 'contactEmail', title: '电子邮件', type: 'text'},
  {key: 'contactPosition', title: '职务', type: 'text'},
  {key: 'contactSpeciality', title: '特长', type: 'text'},
  {key: 'contactNativePlace', title: '籍贯', type: 'text'},
  {key: 'contactBirthday', title: '生日', type: 'date'},
  {key: 'enabledType', title: '状态', type: 'select', dictionary: name.ENABLED_TYPE},
  {key: 'isDefault', title: '是否默认', type: 'radioGroup', dictionary: name.ZERO_ONE_TYPE, required: true}
];

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
  names: [name.ZERO_ONE_TYPE, name.SEX, name.ENABLED_TYPE]
};

export default config;
