import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'userId', title: '用户', type: 'search'},
  {key: 'reportTypeConfigId', title: '模板类型', type: 'search'},
];

const tableCols = [
  {key:'userId',title:'用户'},
  {key:'reportTypeConfigId',title:'模板类型'},
  {key:'reportConfigId',title:'模板名称'},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'del', title: '删除'},
];

const controls = [
  {key:'reportTypeConfigId',title:'模板类型',type:'search',required:true},
  {key:'reportConfigId',title:'模板名称',type: 'select',props: {mode: 'multiple'},span:2},
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

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  size: 'middle',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit,
  names: [name.ACTIVE]
};

export default config;
