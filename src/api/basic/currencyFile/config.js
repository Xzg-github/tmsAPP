import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'currencyName', title: '货币名称', type: 'text'},
  {key: 'currencyTypeCode', title: '货币编码', type: 'text'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'del', title: '删除'},
  {key: 'active', title: '激活'}
  //{key: 'input', title: '导入'},
  //{key: 'output', title: '导出'}
];

const tableCols = [
  {key: 'currencyTypeCode', title: '货币编码'},
  {key: 'active', title: '激活状态', dictionary: name.ACTIVE},
  {key: 'currencyName', title: '货币名称'},
 // {key: 'currencyName', title: '中文名称'},
  {key: 'currencyEnName', title: '英文名称'},
  {key: 'currencySymbol', title: '货币符号'}

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

const controls = [
  {key: 'currencyTypeCode', title: '货币编码', type: 'text', required: true},
  {key: 'currencyName', title: '货币名称', type: 'text', required: true},
  {key: 'currencyEnName', title: '英文名称', type: 'text'},
  {key: 'currencySymbol', title: '货币符号', type: 'text'}
];

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit
};

export default config;


