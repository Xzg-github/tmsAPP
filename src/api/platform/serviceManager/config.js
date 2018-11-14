import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';

const filters = [
  {key: 'serviceName', title: '服务名', type: 'text'},
  {key: 'startDate', title: '创建日期', type: 'date', rule: {type: '<', key: 'endDate'}},
  {key: 'endDate', title: '至', type: 'date', rule: {type: '>', key: 'startDate'}},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'serviceManager_add'},
  {key: 'edit', title: '编辑', sign: 'serviceManager_edit'},
  {key: 'del', title: '删除', sign: 'serviceManager_del'}
];

const tableCols = [
  {key: 'serviceName', title: '服务名'},
  {key: 'serviceExplain', title: '服务名说明'},
  {key: 'insertUser', title: '创建人'},
  {key: 'insertTime', title: '创建时间'}
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
  {key: 'serviceName', title: '服务名', type: 'text', required: true},
  {key: 'serviceExplain', title: '服务名说明', type: 'text', required: true}
];

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  edit,
  index,
};

export default config;
