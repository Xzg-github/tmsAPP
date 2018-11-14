import name from '../../dictionary/name';

const tableCols = [
  {key: 'departmentName', title: '部门名称'},
  {key: 'active', title: '状态', dictionary: name.ACTIVE},
  {key: 'departmentEnglishName', title: '英文名称'},
  {key: 'departmentOwnerGuid', title: '负责人'},
  {key: 'contactTellPhone', title: '联系电话'},
  {key: 'departmentAddress', title: '办公地址'},
  {key: 'institutionGuid', title: '归属机构'},
  {key: 'parentDepartmentGuid', title: '上级部门'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'active', title: '激活'},
  {key: 'del', title: '失效'}
];

const index = {
  tabs: true,
  indexTableCols: [
    {key: 'id', title: '部门/机构名称', link: true},
    {key: 'pid', title: '归属部门/机构'}
  ],
  tableCols,
  buttons,
  placeholder: '部门/机构名称'
};

const controls = [
  {key: 'departmentName', title: '部门名称', type: 'text', required: true},
  {key: 'departmentEnglishName', title: '英文名称', type: 'text'},
  {key: 'departmentOwnerGuid', title: '负责人', type: 'search'},
  {key: 'contactTellPhone', title: '联系电话', type: 'text'},
  {key: 'departmentAddress', title: '办公地址', type: 'text'},
  {key: 'parentDepartmentGuid', title: '上级部门', type: 'readonly'},
  {key: 'institutionGuid', title: '归属机构', type: 'readonly'},
  {key: 'active', title: '状态', type: 'readonly', dictionary: name.ACTIVE}
];

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit
};

export default config;
