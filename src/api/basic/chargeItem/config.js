import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'chargeName', title: '费用名称', type: 'text'},
  {key: 'chargeCode', title: '费用编码', type: 'text'},
];

const tableCols = [
  {key: 'chargeName', title: '费用名称'},
  {key: 'active', title: '状态', dictionary: name.ACTIVE},
  {key: 'chargeCode', title: '费用编码'},
  {key: 'chargeEnName', title: '英文名称'},
  {key: 'isTax', title: '税额改单', dictionary: name.ZERO_ONE},
  {key: 'isNet', title: '净额改单', dictionary: name.ZERO_ONE},
  {key: 'relationThreePartyCode', title: '第三方系统编码'},
  {key: 'chargeType', title: '费用类型', dictionary: 'charge_type'},
  {key: 'expenseOutputType', title: '产值报销类型', dictionary: 'expense_output_type'},
  {key: 'description', title: '描述'},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'charge_item_new'},
  {key: 'edit', title: '编辑', sign: 'charge_item_edit'},
  {key: 'del', title: '失效', sign: 'charge_item_unactive'},
  {key: 'active', title: '激活', sign: 'charge_item_active'},
  {key: 'import', title: '导入', sign: 'charge_item_import'},
];

const controls = [
  {key: 'chargeName', title: '费用名称', type: 'text', required: true},
  {key: 'active', title: '状态', type: 'readonly', dictionary: name.ACTIVE},
  {key: 'chargeCode', title: '费用编码', type: 'text'},
  {key: 'chargeEnName', title: '英文名称', type: 'text'},
  {key: 'isTax', title: '税额改单', type: 'select', dictionary: name.ZERO_ONE},
  {key: 'isNet', title: '净额改单', type: 'select', dictionary: name.ZERO_ONE},
  {key: 'relationThreePartyCode', title: '第三方系统编码', type: 'text'},
  {key: 'chargeType', title: '费用类型', type: 'select', dictionary: 'charge_type'},
  {key: 'expenseOutputType', title: '产值报销类型', type: 'select', dictionary: 'expense_output_type'},
  {key: 'description', title: '描述', type: 'text'}
];

const index = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  description,
  searchConfig,
};

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
