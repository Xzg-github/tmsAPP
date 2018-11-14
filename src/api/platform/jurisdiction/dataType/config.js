import {pageSize, pageSizeType, description, searchConfig} from '../../../globalConfig';

const filters = [
  {key: 'defaultRuleKeyId', title: '默认数据标识', type: 'select'},
  {key: 'primaryField', title: '主键字段', type: 'text'},
  {key: 'ruleTypeKey', title: '数据类型代码', type: 'text'},
  {key: 'ruleTypeName', title: '数据类型名称', type: 'text'},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'del', title: '删除'},
];

const tableCols = [
  {key: 'defaultRuleKeyId', title: '默认数据标识'},
  {key: 'primaryField', title: '主键字段'},
  {key: 'ruleTypeKey', title: '数据类型代码'},
  {key: 'ruleTypeName', title: '数据类型名称'},
  {key: 'relationS', title: '关联规则'},
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

const controls = [
  {key: 'defaultRuleKeyId', title: '默认数据标识', type: 'select'},
  {key: 'primaryField', title: '主键字段', type: 'text'},
  {key: 'ruleTypeKey', title: '数据类型代码', type: 'text'},
  {key: 'ruleTypeName', title: '数据类型名称', type: 'text'},
  {key: 'relationList', title: '关联规则', type: 'select', props: {mode: 'multiple'}, span: 2},
];

const edit = {
  controls,
  add: '新增',
  edit: '编辑',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit
};

export default config;
