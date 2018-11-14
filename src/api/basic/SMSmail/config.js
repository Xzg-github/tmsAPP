import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
import SMSConfig from './SMSConfig'
import mailConfig from './mailConfig'

const index = {
  pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig
};

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary',sign:'SMSmail_add'},
  {key: 'edit', title: '编辑',sign:'SMSmail_edit'},
  {key: 'del', title: '删除',sign:'SMSmail_del',confirm:'是否确认删除'},
  {key: 'password', title: '设置密码',sign:'SMSmail_password'},
];

const tabs = [
  {
    key: 'SMS',
    title: '短信',
    close: false,
  },
  {
    key: 'mail',
    title: '邮箱',
    close: false,
  }
];

const config = {
  dicNames:[],
  SMS:SMSConfig,
  mail:mailConfig,
  buttons,
  ...index,
  tabs
};

export default config;
