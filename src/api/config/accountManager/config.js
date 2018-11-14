import name from '../../../api/dictionary/name';
import {pageSize, pageSizeType, description} from '../../globalConfig';

const filters = [
  {key: 'account', title: '用户账号', type: 'text'},
  {key: 'institutionGuid', title: '机构', type: 'search'},
  {key: 'departmentGuid', title: '部门', type: 'search'},
  {key: 'userEmail', title: '邮箱', type: 'text'},
];

const searchConfig = {
  search: '搜索',
  reset: '重置',
};

const toolbar = [
  {key: 'allot', title: '角色分配', bsStyle: 'primary'},
  {key: 'clear', title: '清除分配'},
  {key: 'dataRoles', title: '数据角色分配'},
  {key: 'clearDataRoles', title: '清除数据分配'},
];

const itemCols = [
  {key: 'userEmail', title: '邮箱'},
  // {key: 'institutionGuid', title: '机构'},
  // {key: 'departmentGuid', title: '部门'},
  {key: 'account', title: '用户账号'},
  {key: 'roleList', title: '权限角色'},
  {key: 'dataRoles', title: '数据角色'},
  {key: 'active', title: '状态', dictionary: name.ACTIVE},
];

const roleListCols = [
  {key: 'roleName', title: '角色名称'},
  {key: 'status', title: '状态' ,options: [{value: 1, title: '激活'}, {value: 2, title: '未激活'}, {value: 3, title: '失效'}]},
];

const dataRoleCols = [
  {key: 'dataRoleName', title: '角色名称'},
];

const config = {
  filters,
  searchConfig,
  searchData: {},
  toolbar,
  itemCols,
  tableItems: [],
  currentPage: 1,
  returnTotalItems: 0,
  pageSize,
  pageSizeType,
  description,
  roleList: [],
  roleListCols,
  dataRoleCols,
  dataRoleList: [],
  names: [name.ACTIVE]
};

export default config;
