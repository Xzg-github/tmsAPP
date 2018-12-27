import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'customerId', title: '所属客户', type: 'search'},
  {key: 'active', title: '状态', type: 'select', dictionary: name.ACTIVE}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'customer_service_add'},
  {key: 'edit', title: '编辑',sign: 'customer_service_edit'},
  {key: 'del', title: '失效', confirm: '是否确认失效所有勾选的记录？',sign: 'customer_service_del'},
  {key: 'active', title: '激活', confirm: '是否确认激活所有勾选的记录？',sign: 'customer_service_active'},
  {key: 'export', title: '导出',sign: 'customer_service_export'}
];

const tableCols = [
  {key: 'active', title: '状态', dictionary: name.ACTIVE},
  {key: 'customerId', title: '所属客户'},
  {key: 'businessType', title: '运输类型', dictionary: 'business_type'},
  {key: 'userId', title: '客服人员'}
];

const index = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  description,
  searchConfig
};

const controls = [
  {key: 'customerId', title: '所属客户', type: 'search', required: true},
  {key: 'businessType', title: '运输类型', type:'select', dictionary: 'business_type', required: true},
  {key: 'userId', title: '客服人员', type: 'search', required: true},
];

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  size: 'default',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  edit,
  index,
  names: [name.ACTIVE, 'business_type']
};

export default config;
