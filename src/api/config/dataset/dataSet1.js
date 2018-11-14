import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'outputType', title: '输出类型', type: 'select',from:'dictionary', position:name.REPORT_OUTPUT_TYPE},
  {key: 'reportTypeConfigId', title: '模板类型', type: 'search'},
];

const tableCols = [
  {key: 'outputType', title: '输出类型',from:'dictionary', position:name.REPORT_OUTPUT_TYPE},
  {key: 'reportTypeConfigId', title: '模板类型'},
  {key: 'isRelationCustomer', title: '是否关联客户',from:'dictionary', position:name.YES_OR_NO},
  {key: 'isRelationTaskUnitType', title: '是否关联作业单元',from:'dictionary', position:name.YES_OR_NO},
  {key: 'isRelationSupplier', title: '是否关联供应商',from:'dictionary', position:name.YES_OR_NO},

];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', },
  {key: 'edit', title: '编辑',},
  {key: 'del', title: '删除'},
];

const index = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig
};

const controls = [
  {key: 'outputType', title: '输出类型',from:'dictionary',type:'select', position:name.REPORT_OUTPUT_TYPE,required:true},
  {key: 'reportTypeConfigId', title: '模板类型',type:'search',required:true},
  {key: 'isRelationCustomer', title: '是否关联客户',type: 'radioGroup', from:'dictionary', position:name.YES_OR_NO},
  {key: 'isRelationTaskUnitType', title: '是否关联作业单元',type: 'radioGroup', from:'dictionary', position:name.YES_OR_NO},
  {key: 'isRelationSupplier', title: '是否关联供应商',type: 'radioGroup', from:'dictionary', position:name.YES_OR_NO},
];

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const data = {
  index,
  edit,
  dicNames: [name.REPORT_OUTPUT_TYPE,name.YES_OR_NO]
};

export default data;

