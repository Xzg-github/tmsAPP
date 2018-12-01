import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';

const filters = [
  {key: 'supplierId', title: '所属供应商',type:'search'},
];

const tableCols = [
  {key: 'supplierId', title: '所属供应商'},
  {key: 'chargeItemId', title: '系统费用项标识',},
  {key: 'customaryName', title: '习惯名称',},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'supplier_cost_add'},
  {key: 'edit', title: '编辑', sign: 'supplier_cost_edit'},
  {key: 'del', title: '删除', confirm: '是否确认删除勾选记录', sign: 'supplier_cost_del'},
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
  {key: 'supplierId', title: '所属供应商',type:'search',required:true},
  {key: 'chargeItemId', title: '系统费用项标识',type:'search',required:true},
  {key: 'customaryName', title: '习惯名称',type:'text',required:true},
];

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit,
};

export default config;
