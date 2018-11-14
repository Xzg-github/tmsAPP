import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';

const filters = [
  {key: 'apiName', title: '名称', type: 'text'},
  {key: 'code', title: '代码', type: 'text'}
];

const tableCols = [
  {key: 'apiName', title: '名称'},
  {key: 'code', title: '代码'},
  {key: 'valuePath', title: '值路径'},
  {key: 'api', title: 'API'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'datalib_add'},
  {key: 'copy', title: '复制新增', sign: 'datalib_copy'},
  {key: 'edit', title: '编辑', sign: 'datalib_edit'},
  {key: 'del', title: '删除', sign: 'datalib_del'}
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
  {key: 'apiName', title: '名称', type: 'text', required: true},
  {key: 'code', title: '代码', type: 'text', required: true},
  {key: 'api', title: 'API', type: 'text', required: true},
  {key: 'valuePath', title: '值路径', type: 'text', required: true}
];

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '提交', cancel: '取消'}
};


const config1 = {
  index,
  edit
};

export default config1;

