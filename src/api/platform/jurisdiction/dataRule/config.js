import {pageSize, pageSizeType, description, searchConfig} from '../../../globalConfig';
import name from '../../../dictionary/name';

const filters = [
  {key: 'ruleKey', title: '规则代码', type: 'text'},
  {key: 'ruleName', title: '规则名称', type: 'text'},
  {key: 'relationTable', title: '规则库关联表单', type: 'select', dictionary: name.RELATION_TABLE}
];


const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'del', title: '删除'},
];


const tableCols = [
  {key: 'ruleKey', title: '规则代码'},
  {key: 'ruleName', title: '规则名称'},
  {key: 'relationTable', title: '规则库关联表单', dictionary: name.RELATION_TABLE},
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
  {key: 'ruleKey', title: '规则代码', type: 'text', required: true},
  {key: 'ruleName', title: '规则库名称', type: 'text', required: true},
  {key: 'relationTable', title: '规则库关联表单', type: 'select', dictionary: name.RELATION_TABLE},
];

const edit = {
  controls,
  add: '新增',
  edit: '编辑',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit,
  names: [name.RELATION_TABLE]
};

export default config;
