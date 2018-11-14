import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const dataOptions= [
  {value: 'yyyyMMdd', title: 'yyyyMMdd'},
  {value: 'yyMMdd', title: 'yyMMdd'},
  {value: 'yyMM', title: 'yyMM'},
  {value: 'yyyyMM', title: 'yyyyMM'}
];

const flowNumberOptions = [
  {value: '2', title: '2'},
  {value: '3', title: '3'},
  {value: '4', title: '4'},
  {value: '5', title: '5'},
  {value: '6', title: '6'}
];

const filters = [
  {key: 'tableNumberName', title: '表单类型', type: 'select', dictionary: name.TABLE_NUMBER_TYPE},
  {key: 'tableNumberCode', title: '表单编码', type: 'text'},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'setDefault', title: '默认设置'},
  {key: 'edit', title: '编辑'},
  {key: 'batchEdit', title: '批量编辑'},
  {key: 'del', title: '删除'}
];

const tableCols = [
  {key: 'tableNumberName', title: '表单类型', dictionary: name.TABLE_NUMBER_TYPE},
  {key: 'tableNumberCode', title: '表单编码' },
  {key: 'flowNumber', title: '流水位数'},
  {key: 'dateType', title: '日期类型'},
  {key: 'insertUser', title: '创建用户'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateUser', title: '更新用户'},
  {key: 'updateTime', title: '更新时间'}
];


const controls = [
  {key: 'tableNumberName', title: '表单类型', type: 'select', dictionary: name.TABLE_NUMBER_TYPE},  //TABLE_NUMBER_TYPE
  {key: 'tableNumberCode', title: '表单编码', type: 'text', required: true},
  {key: 'dateType', title: '日期类型', type: 'select', options: dataOptions},
  {key: 'flowNumber', title: '流水位数', type: 'select', options: flowNumberOptions, required: true}
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
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const batchControls = [
  {key: 'dateType', title: '日期类型', type: 'select', options: dataOptions, required: true},
  {key: 'flowNumber', title: '流水位数', type: 'select', options: flowNumberOptions, required: true}
];

const batchEdit = {
  controls: batchControls,
  title: '批量编辑',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit,
  batchEdit
};

export default config;

