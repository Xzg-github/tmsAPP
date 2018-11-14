const filters = [
  {key: 'name', title: '租户名称', type: 'search'},
];

const searchConfig = {
  search: '打开',
  reset: '重置',
};


const config = {
  filters,
  searchConfig,
  currentTenantId: '',
  searchData: {},
  notDistributionTree: {},
  distributionTree: {},
  distributionExpand: {},
  distributionChecked: {},
  notDistributionExpand: {},
  notDistributionChecked: {},
};

export default config;
