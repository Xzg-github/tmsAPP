import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'sendName', title: '发信名称', type: 'text'},
  {key: 'emailAddress', title: 'EMAIL地址', type: 'text'}
];

const tableCols = [
  {key: 'active', title: '状态', from:'dictionary', position:name.ACTIVE},
  {key: 'sendName', title: '发信名称'},
  {key: 'emailAddress', title: 'EMAIL地址'},
  //{key: 'emailPassword', title: '密码'},
  {key: 'sendHost', title: '发件服务'},
  {key: 'isSendSsl', title: '发件SSL', from:'dictionary', position:name.YES_OR_NO},
  {key: 'sendPort', title: '发件端口'},
  {key: 'receiveHost', title: '收件服务'},
  {key: 'isReceiveSsl', title: '收件SSL', from:'dictionary', position:name.YES_OR_NO},
  {key: 'receivePort', title: '收件端口'},
  {key: 'userId', title: '异常管理员'},
  {key: 'notifyEmailAddress', title: '通知邮箱'},
  {key: 'insertTime', title: '创建人'},
  {key: 'insertUser', title: '创建时间'},
  {key: 'updateUser', title: '更新人'},
  {key: 'updateTime', title: '更新时间'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'emailAccept_email_add'},
  {key: 'edit', title: '编辑', sign: 'emailAccept_email_edit'},
  {key: 'del', title: '删除', sign: 'emailAccept_email_del'},
  {key: 'active', title: '激活', sign: 'emailAccept_email_active'},
  {key: 'inactive', title: '失效', sign: 'emailAccept_email_inactive'}
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
  {key: 'sendName', title: '发信名称', type: 'text', required: true},
  {key: 'emailAddress', title: 'email地址', type: 'text', required: true},
  {key: 'emailPassword', title: '密码', type: 'password', required: true},
  {key: 'sendHost', title: '发件服务器', type: 'text', required: true},
  {key: 'isSendSsl', title: '发件SSL', type: 'select', from:'dictionary', position:name.YES_OR_NO, required: true},
  {key: 'sendPort', title: '发件端口', type: 'number', required: true},
  {key: 'receiveHost', title: '收件服务器', type: 'text', required: true},
  {key: 'isReceiveSsl', title: '收件SSL', type: 'select', from:'dictionary', position:name.YES_OR_NO, required: true},
  {key: 'receivePort', title: '收件端口', type: 'number', required: true},
  {key: 'userId', title: '异常管理员', type: 'search', required: true},
  {key: 'notifyEmailAddress', title: '通知邮箱', type: 'text', required: true}
];

const editControls = [
  {key: 'sendName', title: '发信名称', type: 'readonly', required: true},
  {key: 'emailAddress', title: 'email地址', type: 'readonly', required: true},
  {key: 'emailPassword', title: '密码', type: 'password', required: true},
  {key: 'sendHost', title: '发件服务器', type: 'readonly', required: true},
  {key: 'isSendSsl', title: '发件SSL', type: 'readonly', from:'dictionary', position:name.YES_OR_NO, required: true},
  {key: 'sendPort', title: '发件端口', type: 'readonly', required: true},
  {key: 'receiveHost', title: '收件服务器', type: 'readonly', required: true},
  {key: 'isReceiveSsl', title: '收件SSL', type: 'readonly', from:'dictionary', position:name.YES_OR_NO, required: true},
  {key: 'receivePort', title: '收件端口', type: 'readonly', required: true},
  {key: 'userId', title: '异常管理员', type: 'search', required: true},
  {key: 'notifyEmailAddress', title: '通知邮箱', type: 'text', required: true}
];

const edit = {
  controls,
  editControls,
  config: {ok: '提交', cancel: '取消'},
  edit: '编辑',
  new:'新增'
};


const config1 = {
  index,
  edit
};

export default config1;

