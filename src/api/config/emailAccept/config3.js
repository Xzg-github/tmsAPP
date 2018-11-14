import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const statusOptions = [
  {value: 'success', title: '成功'},
  {value: 'failure', title: '失败'}
];

const filters = [
  {key: 'receiveEmailAddress', title: '接收邮箱', type: 'search'},
  {key: 'fromEmailAddress', title: '发件邮箱', type: 'text'},
  {key: 'subject', title: '主题', type: 'text'},
  {key: 'matchingStatus', title: '匹配状态', type: 'select', options: statusOptions},
  {key: 'handingStatus', title: '处理状态', type: 'select', options: statusOptions},
  {key: 'insertTimeFrom', title: '接收开始时间', type: 'date', rule: {type: '<', key: 'insertTimeTo'}},
  {key: 'insertTimeTo', title: '接收结束时间', type: 'date', rule: {type: '>', key: 'insertTimeFrom'}},
];

const tableCols = [
  {key: 'handingStatus', title: '处理状态', options: statusOptions},
  {key: 'matchingStatus', title: '匹配状态', options: statusOptions},
  {key: 'receiveEmailAddress', title: '接收邮箱'},
  {key: 'fromEmailAddress', title: '发件邮箱'},
  {key: 'fromPerson', title: '发件人'},
  {key: 'subject', title: '主题'},
  {key: 'uploadDownloadType', title: '上传/下载', from:'dictionary', position:name.YES_OR_NO},
  {key: 'fileList', title: '附件', link: 'list', linkTitleKey: 'fileName'},
  {key: 'insertTime', title: '接收时间'},
  {key: 'notifyEmailAddress', title: '通知邮箱', from:'dictionary', position:name.YES_OR_NO},
  {key: 'updateTime', title: '处理时间'}
];

const buttons = [
  {key: 'add', title: '收取', sign: 'acceptEmail_log_add'},
  {key: 'del', title: '删除', sign: 'acceptEmail_log_del'}
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

const config3 = {
  index
};

export default config3;

