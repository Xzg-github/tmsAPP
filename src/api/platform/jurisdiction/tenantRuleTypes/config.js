import {pageSize, pageSizeType, description, searchConfig} from '../../../globalConfig';

const filters = [
  {key: 'tenantId', title: '租户', type: 'search'},
];

const buttons = [
  {key: 'choice', title: '选择', bsStyle: 'primary'},
  {key: 'del', title: '删除'},
];

const tableCols = [
  {key: 'ruleTypeName', title: '数据类型', align: 'center'},
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

const config = {
  index,
};

export default config;
