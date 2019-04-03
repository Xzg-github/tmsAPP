import name from '../../dictionary/name';

const languages = [
  {value: 'chinese', title: '中文'}
];

const tableCols = [
  {key: 'account', title: '用户账号'},
  {key: 'active', title: '状态', dictionary: name.ACTIVE},
  {key: 'username', title: '中文名称'},
  {key: 'userEnglishName', title: '英文名称'},
  {key: 'userPosition', title: '岗位'},
  {key: 'userCellphone', title: '联系电话'},
  {key: 'userEmail', title: '邮箱'},
  {key: 'contractRoles', title: '签署角色', dictionary: name.CONTRACT_ROLES},
  {key: 'weChatOpenid', title: '微信'},
  {key: 'parentUserGuid', title: '归属上级'},
  {key: 'institutionGuid', title: '归属机构'},
  {key: 'departmentGuid', title: '归属部门'},
  {key: 'languageVersion', title: '语言版本', options: languages},
  {key: 'relationThreePartyCode', title: '内部编码'},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'active', title: '激活', confirm: '是否确认激活所有勾选的记录？'},
  {key: 'del', title: '失效', confirm: '是否确认失效所有勾选的记录？'},
  {key: 'reset', title: '重置密码', confirm: '是否确认重置密码勾选的记录？'},
  {key: 'set', title: '设置签署角色'},
];

const index = {
  tabs: true,
  indexTableCols: [
    {key: 'id', title: '部门/机构名称', link: true},
    {key: 'pid', title: '归属部门/机构'}
  ],
  tableCols,
  buttons,
  placeholder: '用户账号/中文名称/邮箱'
};

const controls = [
  {key: 'account', title: '用户账号', type: 'text', required: true},
  {key: 'userEmail', title: '邮箱', type: 'text', required: true},
  {key: 'username', title: '中文名称', type: 'text', required: true},
  {key: 'userEnglishName', title: '英文名称', type: 'text'},
  {key: 'userPosition', title: '岗位', type: 'text'},
  {key: 'userCellphone', title: '联系电话', type: 'text'},
  {key: 'weChatOpenid', title: '微信', type: 'text'},
  {key: 'institutionGuid', title: '归属机构', type: 'readonly'},
  {key: 'departmentGuid', title: '归属部门', type: 'readonly'},
  {key: 'parentUserGuid', title: '归属上级', type: 'search'},
  {key: 'active', title: '状态', type: 'readonly', dictionary: name.ACTIVE},
  {key: 'languageVersion', title: '语言版本', type: 'select', options: languages},
  {key: 'relationThreePartyCode', title: '内部编码', type: 'text'},
];

const controls2 = [
  {key: 'account', title: '用户账号', type: 'text', required: true},
  {key: 'userEmail', title: '邮箱', type: 'text', required: true},
  {key: 'username', title: '中文名称', type: 'text', required: true},
  {key: 'userEnglishName', title: '英文名称', type: 'text'},
  {key: 'userPosition', title: '岗位', type: 'text'},
  {key: 'userCellphone', title: '联系电话', type: 'text'},
  {key: 'weChatOpenid', title: '微信', type: 'text'},
  {key: 'institutionGuid', title: '归属机构', type: 'search'},
  {key: 'departmentGuid', title: '归属部门', type: 'search', required: true},
  {key: 'parentUserGuid', title: '归属上级', type: 'search'},
  {key: 'active', title: '状态', type: 'readonly', dictionary: name.ACTIVE},
  {key: 'languageVersion', title: '语言版本', type: 'select', options: languages},
  {key: 'relationThreePartyCode', title: '内部编码', type: 'text'},
];

const edit = {
  controls,
  controls2,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit
};

export default config;
