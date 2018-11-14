import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'uploadSubject', title: '导入主题', type: 'text'},
  {key: 'downloadSubject', title: '模板下载主题', type: 'text'},
  {key: 'uploadMode', title: '导入模式', type: 'select', from:'dictionary', position:name.UPLOAD_MODE},
  {key: 'active', title: '状态', type: 'select', from:'dictionary', position:name.ACTIVE},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'importTemplate_add'},
  {key: 'import', title: '从导入库引入', sign: 'importTemplate_import'},
  {key: 'edit', title: '编辑', sign: 'importTemplate_edit'},
  {key: 'del', title: '删除', sign: 'importTemplate_del'},
  {key: 'active', title: '激活', sign: 'importTemplate_active'},
  {key: 'inactive', title: '失效', sign: 'importTemplate_inactive'}
];

const tableCols = [
  {key: 'active', title: '状态', from:'dictionary', position:name.ACTIVE},
  {key: 'uploadSubject', title: '导入主题'},
  {key: 'downloadSubject', title: '模板下载主题'},
  {key: 'uploadMode', title: '导入模式', from:'dictionary', position:name.UPLOAD_MODE},
  {key: 'modeTitle', title: '关联值'},
  {key: 'uploadTemplate', title: '下载模板', link: 'list', linkTitleKey: 'fileName'},
  {key: 'notifyEmailAddress', title: '系统异常通知邮箱'},
  {key: 'insertUser', title: '创建人'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateUser', title: '更新人'},
  {key: 'updateTime', title: '更新时间'}
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
  {key: 'uploadSubject', title: '导入主题', type: 'text', required: true},
  {key: 'downloadSubject', title: '模板下载主题', type: 'text', required: true},
  {key: 'uploadMode', title: '导入模式', type: 'select', from:'dictionary', position:name.UPLOAD_MODE, required: true },
  {key: 'modeValue', title: 'EPLD导入库', type: 'search', required: true},
  {key: 'notifyEmailAddress', title: '系统异常通知邮箱', type: 'text', required: true}
];

const editControls = [
  {key: 'uploadSubject', title: '导入主题', type: 'readonly', required: true},
  {key: 'downloadSubject', title: '模板下载主题', type: 'readonly', required: true},
  {key: 'uploadMode', title: '导入模式', type: 'readonly', from:'dictionary', position:name.UPLOAD_MODE, required: true },
  {key: 'modeValue', title: 'EPLD导入库', type: 'readonly', required: true},
  {key: 'notifyEmailAddress', title: '系统异常通知邮箱', type: 'text', required: true}
];

const edit = {
  controls,
  editControls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  edit,
  index
};

export default config;
