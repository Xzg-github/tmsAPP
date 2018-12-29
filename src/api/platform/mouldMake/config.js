import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'modelType', title: '类别', type: 'select', from:'dictionary', position:name.MODEL_TYPE},
  {key: 'excelReportGroup', title: '组类', type: 'select', from:'dictionary', position:name.EXCEL_REPORT_GROUP},
  {key: 'modelName', title: '模板名称', type: 'text'}
];

const addMenu = [
  {key: 'model_type_email', title: '邮件模板'},
  {key: 'model_type_signature', title: '签名'},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'mouldMake_add', menu: addMenu, dropDown: true},
  {key: 'copy', title: '复制', sign: 'mouldMake_copy'},
  {key: 'edit', title: '编辑', sign: 'mouldMake_edit'},
  {key: 'del', title: '删除', sign: 'mouldMake_del'},
  {key: 'active', title: '激活', sign: 'mouldMake_active'},
  {key: 'inactive', title: '失效', sign: 'mouldMake_inactive'}
];

const tableCols = [
  {key: 'active', title: '状态', from:'dictionary', position:name.ACTIVE},
  {key: 'modelType', title: '类别', from:'dictionary', position:name.MODEL_TYPE},
  {key: 'excelReportGroup', title: '组类', from:'dictionary', position:name.EXCEL_REPORT_GROUP},
  {key: 'modelName', title: '模板名称'},
  {key: 'recipient', title: '收件人'},
  {key: 'recipientCcls', title: '抄送人'},
  {key: 'subject', title: '主题'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'insertUser', title: '创建用户'},
  {key: 'updateTime', title: '更新时间'},
  {key: 'updateUser', title: '更新用户'}
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

const emailControls = [
  {key: 'excelReportGroup', title: '组类', type: 'select', from:'dictionary', position:name.EXCEL_REPORT_GROUP, required: true},
  {key: 'modelName', title: '模板名称', type: 'text', required: true},
  {key: 'recipient', title: '收件人', type: 'select', props: {mode: 'multiple'}, span: 3, required: true, showAdd:true},
  {key: 'recipientCcls', title: '抄送人', type: 'select', props: {mode: 'multiple'}, span: 3, showAdd:true},
  {key: 'subject', title: '主题', type: 'textArea', span: 3, required: true},
  {key: 'content', title: '邮件正文', type: 'editor', span: 3, required: true, rows: 4}
];

const signatureControls = [
  {key: 'excelReportGroup', title: '组类', type: 'select', from:'dictionary', position:name.EXCEL_REPORT_GROUP, required: true},
  {key: 'modelName', title: '模板名称', type: 'text', required: true},
  {key: 'content', title: '邮件正文', type: 'textArea', span: 3, required: true, rows: 4}
];

const emailConfig = {
  emailControls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const signatureConfig = {
  signatureControls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
}

const edit = {
  emailConfig,
  signatureConfig
};

const config = {
  edit,
  index
};

export default config;
