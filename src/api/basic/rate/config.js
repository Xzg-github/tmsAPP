import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'currencyTypeCode', title: '原币种', type: 'text'}
];

const tableCols = [
  {key: 'currencyTypeCode', title: '原币种'},
  {key: 'active', title: '状态', dictionary: name.ACTIVE},
  {key: 'exchangeCurrencyTypeCode', title: '折合币种'},
  {key: 'exchangeRate', title: '原汇率'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateTime', title: '更新时间'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'rate_new'},
  {key: 'edit', title: '编辑', sign: 'rate_edit'},
  {key: 'del', title: '失效', sign: 'rate_unactive', confirm: '是否确认使勾选记录失效？'},
  {key: 'active', title: '激活', sign: 'rate_active', confirm: '是否确认使勾选记录激活？'}
];

const controls = [
  {key: 'currencyTypeCode', title: '原币种', type: 'search', required: true},
  {key: 'active', title: '状态', type: 'readonly', dictionary: name.ACTIVE},
  {key: 'exchangeCurrencyTypeCode', title: '折合币种', type: 'search', required: true},
  {key: 'exchangeRate', title: '原汇率', type: 'number', required: true, props: {real: true}}
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
  edit
};

export default config;
