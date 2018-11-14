const buttons = [
  {key: 'add', title: '新增'},
  {key: 'del', title: '删除'},
  {key: 'save', title: '保存'}
];

const tableCols = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'departmentName', title: '部门', type: 'search', options: []},
  {key: 'username', title: '用户名称', type: 'search', options: []},
  {key: 'userPosition', title: '岗位', type: 'select', options: []}
];

const data = {
  expandedKeys: [],
  searchValue: '',
  autoExpandParent: true,
  checkedKeys: []
};

const tabs = [
  {key: 'user', title: '用户信息',close:false},
  {key: 'setting', title: '权限信息',close:false}
];

const config = {
  returnCode: 0,
  activeKey: 'user',
  tabs,
  buttons,
  tableCols,
  data
};

export default config;
