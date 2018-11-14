import name from '../../../api/dictionary/name';

const filters = [
  {key: 'tenantName', title: '角色名称', type: 'text'},
  {key: 'active', title: '状态', type: 'text', from: 'dictionary', position: name.ACTIVE},
];

const searchConfig = {
  search: '搜索',
  reset: '重置',
};

const toolbar = [
  {key: 'save', title: '添加', bsStyle: 'primary'},
  {key: 'update', title: '编辑'},
  {key: 'active', title: '激活'},
  {key: 'invalid', title: '失效'},
  {key: 'distribute', title: '权限分配'},
];

const itemCols = [
  {key: 'roleName', title: '角色名称'},
  {key: 'status', title: '状态' ,options: [{value: 1, title: '激活'}, {value: 2, title: '未激活'}, {value: 3, title: '失效'}]},
];


const config = {
  filters,
  searchConfig,
  toolbar,
  itemCols,
  currentRoleId: '',
  tableItems: [],
  notDistributionTree: {},
  distributionTree: {},
  distributionExpand: {},
  distributionChecked: {},
  notDistributionExpand: {},
  notDistributionChecked: {},
};

export default config;
