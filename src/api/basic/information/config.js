import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';

const filters = [
  {key: 'customerId', title: '客户', type: 'search', searchType: 'customer_all'},
  {key: 'customerInformationFeedback', title: '反馈类型', type: 'select', dictionary: 'customer_information_feedback'},
  {key: 'isInterface', title: '接口推送', type: 'select', dictionary: 'zero_one_type'},
  {key: 'enableType', title: '状态', type: 'select', dictionary: 'enabled_type'}
];

const tableCols = [
  {key: 'customerId', title: '客户'},
  {key: 'customerInformationFeedback', title: '反馈类型', dictionary: 'customer_information_feedback'},
  {key: 'isInterface', title: '接口推送', dictionary: 'zero_one_type'},
  {key: 'subscribeNodeName', title: '订阅名称'},
  {key: 'mail', title: '邮箱接收'},
  {key: 'mobile', title: '短信接收'},
  {key: 'enableType', title: '状态', dictionary: 'enabled_type'},
  {key: 'insertUser', title: '创建人'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateUser', title: '修改人'},
  {key: 'updateTime', title: '修改时间'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'enable', title: '启用', confirm: '确认启用选中的记录?'},
  {key: 'disable', title: '禁用', confirm: '确认禁用选中的记录?'}
];

const config = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig,
};

export default config;

