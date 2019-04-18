import {pageSize, pageSizeType, description, searchConfig} from "../../globalConfig";
import name from '../../dictionary/name';

//搜索栏配置
const filters = [
  {key: 'supplierId', title: '供应商档案标识', type: 'search'},
  {key: 'businessType', title: '业务类型', type: 'select', dictionary: name.BUSINESS_TYPE},
  {key: 'chargeItemId', title: '费用标识', type: 'search'},
  {key: 'taxRate', title: '税率', type: 'number', props: {placeholder: '小于100的整数'}},
  {key: 'taxRateWay', title: '计税方式', type: 'select', dictionary: name.TAX_RATE_WAY},
  {key: 'enabledType', title: '状态', type: 'select', dictionary: name.ENABLED_TYPE}
];

//列表Item
const tableCols = [
  {key: 'enabledType', title: '状态',dictionary: name.ENABLED_TYPE},
  {key: 'supplierId', title: '供应商档案标识'},
  {key: 'businessType', title: '业务类型', dictionary: name.BUSINESS_TYPE},
  {key: 'chargeItemId', title: '费用标识'},
  {key: 'taxRate', title: '税率'},
  {key: 'taxRateWay', title: '计税方式', dictionary: name.TAX_RATE_WAY},
  {key: 'oilRatio', title: '油卡比例'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'insertUser', title: '创建用户'},
  {key: 'updateTime', title: '更新时间'},
  {key: 'updateUser', title: '更新用户'}
];

//toolbar
const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'customerTax_add'},
  {key: 'edit', title: '编辑', sign: 'customerTax_edit'},
  {key: 'delete', title: '删除', sign: 'customerTax_delete', confirm: '确认删除选中记录'},
  {key: 'enable', title: '启用', sign: 'customerTax_enable'},
  {key: 'disable', title: '禁用', sign: 'customerTax_disable'},
  {key: 'owner', title: '车主税率', sign: 'customerTax_owner'},
  {key: 'import', title: '导入', sign: 'customerTax_import'},
  {key: 'export', title: '导出', sign: 'customerTax_export'}
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
  {key: 'businessType', title: '业务类型',type: 'select', dictionary: name.BUSINESS_TYPE},
  {key: 'chargeItemId', title: '费用标识', type: 'search'},
  {key: 'taxRate', title: '税率', type: 'number', props: {placeholder: '小于100的整数'}, required:true},
  {key: 'taxRateWay', title: '计税方式', type: 'select', dictionary: name.TAX_RATE_WAY, required: true},
  {key: 'oilRatio', title: '油卡比例', type: 'number',  props: {placeholder: '小于100的整数'}},
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
  names: [name.BUSINESS_TYPE, name.ENABLED_TYPE, name.TAX_RATE_WAY]
};

export default config;
