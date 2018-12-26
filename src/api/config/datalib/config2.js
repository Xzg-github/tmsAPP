import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';

const methodOptions = [
  {value: 'POST', title: 'POST'},
  {value: 'PUT', title: 'PUT'}
];

const filters = [
  {key: 'apiName', title: '名称', type: 'text'},
  {key: 'code', title: '代码', type: 'text'}
];

const tableCols = [
  {key: 'apiName', title: '名称'},
  {key: 'code', title: '代码'},
  {key: 'api', title: 'API'},
  {key: 'remark', title: '说明'},
  {key: 'apiRequestMethod', title: '请求方式', options:methodOptions},
  {key: 'parentCode', title: '归属编码'}
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
  {key: 'remark', title: '说明', type: 'text', required: true},
  {key: 'apiRequestMethod', title: '请求方式', type: 'select', options:methodOptions, required: true},
  {key: 'parentCode', title: '归属编码', type: 'text'},
  {key: 'api', title: 'API', type: 'text', required: true , span:3},
  {key: 'content', title: '内容定义', type: 'textArea', required: true, span: 3}
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

