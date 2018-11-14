import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const companyOptions = [
  {value: '0', title: '集团公司'},
  {value: '1', title: '分公司'}
];

const tableCols = [
  {key: 'tenantName', title: '租户名称'},
  {key: 'active', title: '状态', from: 'dictionary', position: name.ACTIVE},
  {key: 'tenantType', title: '租户类别', from: 'dictionary', position: name.TENANT_TYPE},
  {key: 'companyType', title: '公司级别', options: companyOptions},
  {key: 'tenantContact', title: '联系人'},
  {key: 'tenantContactTellphone', title: '联系电话'},
  {key: 'cooperationStartDate', title: '开始合作时间'},
  {key: 'cooperationEndDate', title: '停止合作时间'},
  {key: 'guid', title: '租户ID'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'active', title: '激活'},
  {key: 'del', title: '失效'},
  {key: 'user', title: '用户管理'}
];

const index = {
  tabs: true,
  indexTableCols: [
    {key: 'id', title: '租户名称', link: true},
    {key: 'pid', title: '上级租户'}
  ],
  tableCols,
  buttons,
  placeholder: '租户名称'
};

const controls = [
  {key: 'tenantName', title: '租户名称', type: 'text', required: true},
  {key: 'parentTenantGuid', title: '上级租户', type: 'readonly'},
  {key: 'companyType', title: '公司级别', type: 'radioGroup', options: companyOptions},
  {key: 'tenantType', title: '租户类别', type: 'select', required: true, from: 'dictionary', position: name.TENANT_TYPE},
  {key: 'tenantContact', title: '联系人', type: 'text', required: true},
  {key: 'tenantContactTellphone', title: '联系电话', type: 'text', required: true},
  {key: 'emailUserName', title: '发送邮箱', type: 'text', required: true},
  {key: 'emailPassword', title: '邮箱密码', type: 'text'},
  {key: 'emailService', title: '发件服务器', type: 'text'},
  {key: 'weChatOpenid', title: '微信OPENID', type: 'text'},
  {key: 'msgUserName', title: '短信发送账号', type: 'text'},
  {key: 'msgPassword', title: '短信发送密码', type: 'text'},
  {key: 'cooperationStartDate', title: '开始合作时间', type: 'date', rule: {type: '<', key: 'cooperationEndDate'}},
  {key: 'cooperationEndDate', title: '停止合作时间', type: 'date', rule: {type: '>', key: 'cooperationStartDate'}},
  {key: 'active', title: '状态', type: 'readonly', from: 'dictionary', position: name.ACTIVE},
  {key: 'tenantAddress', title: '办公地址', type: 'text', required: true}
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

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit,
  userConfig,
  keys: {parent: 'parentTenantGuid'},
  root: '所有租户'
};

export default config;
