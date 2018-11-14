import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'institutionCode', title: '机构编码', type: 'text'},
  {key: 'institutionName', title: '机构名称', type: 'text'},
  {key: 'active', title: '状态', type: 'select', dictionary: name.ACTIVE}
];

const tableCols = [
  {key: 'institutionCode', title: '机构编码'},
  {key: 'institutionName', title: '机构名称'},
  {key: 'active', title: '状态', dictionary: name.ACTIVE},
  {key: 'parentInstitutionId', title: '归属法人'},
  {key: 'institutionOwner', title: '负责人'},
  {key: 'institutionContactTellPhone', title: '联系电话'},
  {key: 'isLegalPerson', title: '法人', dictionary: name.YES_OR_NO}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'del', title: '失效'},
  {key: 'active', title: '激活'}
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
  {key: 'institutionCode', title: '机构编码', type: 'text', required: true},
  {key: 'institutionName', title: '机构名称', type: 'text', required: true},
  {key: 'institutionEnglishName', title: '英文名称', type: 'text'},
  {key: 'institutionOwner', title: '负责人', type: 'search'},
  {key: 'institutionContactTellPhone', title: '联系电话', type: 'text'},
  {key: 'institutionAddress', title: '办公地址', type: 'text'},
  {key: 'parentInstitutionId', title: '归属法人', type: 'search'},
  {key: 'active', title: '状态', type: 'readonly', dictionary: name.ACTIVE},
  {key: 'isLegalPerson', title: '法人', type: 'radioGroup', dictionary: name.YES_OR_NO}
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
