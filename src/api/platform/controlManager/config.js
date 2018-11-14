import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';

const filters = [
  {key: 'serviceId', title: '服务名', type: 'search'},
  {key: 'controllerName', title: '控制层名称', type: 'text'},
  {key: 'startDate', title: '创建日期', type: 'date', rule: {type: '<', key: 'endDate'}},
  {key: 'endDate', title: '至', type: 'date', rule: {type: '>', key: 'startDate'}},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'controlManager_add'},
  {key: 'edit', title: '编辑', sign: 'controlManager_edit'},
  {key: 'del', title: '删除', sign: 'controlManager_del'}
];

const tableCols = [
  {key: 'serviceId', title: '服务名'},
  {key: 'controllerName', title: '控制层名称'},
  {key: 'controllerUrl', title: '控制层路径'},
  {key: 'controllerPath', title: '控制层代码路径'},
  {key: 'controllerExplain', title: '控制层说明'},
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
  {key: 'serviceId', title: '服务名', type: 'search', required: true},
  {key: 'controllerName', title: '控制层名称', type: 'text', required: true},
  {key: 'controllerUrl', title: '控制层路径', type: 'text', required: true},
  {key: 'controllerPath', title: '控制层代码路径', type: 'text', required: true},
  {key: 'controllerExplain', title: '控制层说明', type: 'text', required: true}
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
