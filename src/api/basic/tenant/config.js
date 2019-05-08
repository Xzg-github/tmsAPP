import {pageSize, pageSizeType, description, searchConfig, paginationConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const tableCols = [
  {key: 'tenantName', title: '租户名称'},
  {key: 'active', title: '状态', dictionary: name.ACTIVE},
  {key: 'tenantCode', title: '编码'},
  {key: 'tenantType', title: '租户类别', dictionary: name.TENANT_TYPE},
  {key: 'currencyType', title: '核算币种', dictionary: name.BALANCE_CURRENCY},
  {key: 'tenantEmail', title: '管理员邮箱'},
  {key: 'tenantContact', title: '联系人'},
  {key: 'tenantContactTellphone', title: '联系电话'},
  {key: 'cooperationStartDate', title: '开始合作时间'},
  {key: 'cooperationEndDate', title: '停止合作时间'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'insertUser', title: '创建人'},
  {key: 'updateTime', title: '更新时间'},
  {key: 'updateUser', title: '更新人'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'active', title: '激活'},
  {key: 'del', title: '失效'},
  {key: 'user', title: '用户管理'}
];

const filters = [
  {key: 'tenantName', title: '租户名称', type: 'text'},
  {key: 'active', title: '状态', type: 'select', dictionary: name.ACTIVE},
];

const controls = [
  {key: 'tenantName', title: '租户名称', type: 'text', required: true},
  {key: 'tenantType', title: '租户类别', type: 'select', required: true, dictionary: name.TENANT_TYPE},
  {key: 'tenantCode', title: '编码（大写字母，不超过5位）', type: 'text', required: true},
  {key: 'currencyType', title: '核算币种',  type: 'select', dictionary: name.BALANCE_CURRENCY, required: true},
  {key: 'tenantContact', title: '联系人', type: 'text', required: true},
  {key: 'tenantContactTellphone', title: '联系电话', type: 'text', required: true},
  {key: 'tenantAddress', title: '办公地址', type: 'text', required: true},
  {key: 'tenantEmail', title: '管理员邮箱', type: 'text', required: true},
  {key: 'cooperationStartDate', title: '开始合作时间', type: 'date', rule: {type: '<', key: 'cooperationEndDate'}},
  {key: 'cooperationEndDate', title: '停止合作时间', type: 'date', rule: {type: '>', key: 'cooperationStartDate'}},
  {key: 'active', title: '状态', type: 'readonly', dictionary: name.ACTIVE},
];

const userFilters = [
  {key: 'username', title: '中文名称', type: 'text'},
  {key: 'account', title: '用户账号', type: 'text'},
  {key: 'userEmail', title: '邮箱', type: 'text'},
  {key: 'active', title: '状态', type: 'select', dictionary: name.ACTIVE},
  {key: 'role', title: '功能权限', type: 'search', props:{noSearchWhenTypo: true}},
];

const userCols = [
  {key: 'account', title: '用户账号'},
  {key: 'active', title: '状态', dictionary: name.ACTIVE},
  {key: 'username', title: '中文名称'},
  {key: 'userEnglishName', title: '英文名称'},
  {key: 'userPosition', title: '岗位'},
  {key: 'userCellphone', title: '联系电话'},
  {key: 'userEmail', title: '邮箱'},
  {key: 'weChatOpenid', title: '微信'},
  {key: 'parentUserGuid', title: '归属上级'},
  {key: 'institutionGuid', title: '归属机构'},
  {key: 'departmentGuid', title: '归属部门'},
  {key: 'relationThreePartyCode', title: '内部编码'},
];

//用户管理对话框界面配置
const userConfig = {
  filters: userFilters,
  tableCols: userCols,
  buttons:[],
  pageSize,
  pageSizeType,
  description,
  searchConfig,
  title: '用户管理'
};

const editConfig = {
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const index = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig
};

const config = {
  index,
  editConfig,
  userConfig,
};

export default config;
