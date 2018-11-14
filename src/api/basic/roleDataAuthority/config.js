import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';


const filters = [
  {key: 'dataRoleName', title: '角色名称', type: 'text'},
];


const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'del', title: '删除'},
];


const tableCols = [
  {key: 'dataRoleName', title: '角色名称', align: 'center'},
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
  {key: 'dataRoleName', title: '角色名称', type: 'text', required: true},
  {key: 'remark', title: '描述', type: 'text', required: true},
];

const editButtons = [
  {key:'add', title:'新增行'},
  {key:'del', title:'删除'}
];

const editTableCols = [
  {key: "checked", title: "", type: "checkbox"},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'tenantRuleTypeId', title: '类型', type: 'search', required: true},
  {key: 'ruleId', title: '规则', type: 'search', required: true},
  {key: 'dataRoleRemark', title: '描述', type: 'text'},
  {key: 'content', title: '值', type: 'select', props: {mode: 'multiple'}, width: 300, align: 'center', required: true}
];



const edit = {
  controls,
  add: '新增',
  edit: '编辑',
  config: {ok: '确定', cancel: '取消'},
  tableCols: editTableCols,
  tableItems: [],
  buttons:  editButtons
};

const config = {
  index,
  edit,
};

export default config;
