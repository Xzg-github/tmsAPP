import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'emailAddressConfigId', title: '接收邮箱', type: 'search'},
  {key: 'importTemplateConfigId', title: '接收模板', type: 'search'},
  {key: 'uploadSubject', title: '导入主题', type: 'text'}
];

const tableCols = [
  {key: 'active', title: '状态', from:'dictionary', position:name.ACTIVE},
  {key: 'emailAddressConfigId', title: '接收邮箱'},
  {key: 'importTemplateConfigId', title: '接收模板'},
  {key: 'uploadSubject', title: '导入主题'},
  {key: 'downloadSubject', title: '模板下载主题'},
  {key: 'uploadMode', title: '导入模式', from:'dictionary', position:name.UPLOAD_MODE},
  {key: 'excelModelConfigId', title: 'EXCEL导入模板'},
  {key: 'notifyEmailAddress', title: ' 通知邮箱'},
  {key: 'insertTime', title: '创建人'},
  {key: 'insertUser', title: '创建时间'},
  {key: 'updateUser', title: '更新人'},
  {key: 'updateTime', title: '更新时间'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'emailAccept_accept_add'},
  {key: 'edit', title: '编辑', sign: 'emailAccept_accept_edit'},
  {key: 'del', title: '删除', sign: 'emailAccept_accept_del'},
  {key: 'active', title: '激活', sign: 'emailAccept_accept_active'},
  {key: 'inactive', title: '失效', sign: 'emailAccept_accept_inactive'}
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

//基本信息表单配置
const controls = [
  {key: 'emailAddressConfigId', title: '接收邮箱', type: 'search', required: true}
];

const toolbars = [
  {key: 'add', title: '加入'},
  {key: 'del', title: '移除'}
];

//表格Cols配置
const matchTable = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'importTemplateConfigId', title: '接收模板', type: 'readonly', required: true},
  {key: 'uploadSubject', title: '导入主题', type: 'text', required: true},
  {key: 'downloadSubject', title: '模板下载主题', type: 'text', required: true},
  {key: 'uploadMode', title: '导入模式', type: 'readonly', from:'dictionary', position:name.UPLOAD_MODE, required: true},
  {key: 'excelModelConfigId', title: 'EXCEL导入模板', type: 'search'},
  {key: 'notifyEmailAddress', title: '通知邮箱', type: 'text'},
];

const leadConfig = {
  title: '选择导入模板',
  okText: '确定',
  cancelText: '取消',
  filters: [
    {key: 'filter', title: '导入主题', type: 'text'}
  ],
  searchConfig,
  tableCols : [
    {key: 'uploadSubject', title: '导入主题'}
  ],
};

//编辑表单配置
const editControls = [
  {key: 'emailAddressConfigId', title: '接收邮箱', type: 'readonly', required: true},
  {key: 'importTemplateConfigId', title: '接收模板', type: 'readonly', required: true},
  {key: 'uploadSubject', title: '导入主题', type: 'readonly', required: true},
  {key: 'downloadSubject', title: '模板下载主题', type: 'readonly', required: true},
  {key: 'uploadMode', title: '导入模式', type: 'readonly', from:'dictionary', position:name.UPLOAD_MODE, required: true},
  {key: 'excelModelConfigId', title: 'EXCEL导入模板', type: 'search', required: true},
  {key: 'notifyEmailAddress', title: '通知邮箱', type: 'text'}
];

const editControls1 = [
  {key: 'emailAddressConfigId', title: '接收邮箱', type: 'search', required: true},
  {key: 'importTemplateConfigId', title: '接收模板', type: 'search', required: true},
  {key: 'uploadSubject', title: '导入主题', type: 'text', required: true},
  {key: 'downloadSubject', title: '模板下载主题', type: 'text', required: true},
  {key: 'uploadMode', title: '导入模式', type: 'select', from:'dictionary', position:name.UPLOAD_MODE, required: true},
  {key: 'excelModelConfigId', title: 'EXCEL导入模板', type: 'search', required: true},
  {key: 'notifyEmailAddress', title: '通知邮箱', type: 'text'}
];

const edit = {
  controls,
  tableCols: matchTable,
  toolbars,
  add: '新增',
  del: '删除',
  //baseTitle: '基本信息',
  //detailTitle: '匹配字段及规则',
  config: {ok: '提交', cancel: '取消'},
  edit: '编辑匹配规则',
  new:'新增匹配规则',
  leadConfig,
  editControls,
  editControls1
};

const config2 = {
  index,
  edit
};

export default config2;

