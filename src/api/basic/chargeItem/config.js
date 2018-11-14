import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'chargeName', title: '费用名称', type: 'text'},
  {key: 'chargeCode', title: '费用编码', type: 'text'},
  // {key: 'apportionmentRule', title: '分摊规则', type: 'select', dictionary: name.APPORTIONMENT_RULE},
];

const tableCols = [
  {key: 'chargeName', title: '费用名称'},
  {key: 'active', title: '状态', dictionary: name.ACTIVE},
  {key: 'chargeCode', title: '费用编码'},
  {key: 'chargeEnName', title: '英文名称'},
  // {key: 'isTax', title: '税额改单', dictionary: name.YES_OR_NO},
  // {key: 'isNet', title: '净额改单', dictionary: name.YES_OR_NO},
  // {key: 'relationThreePartyCode', title: '第三方系统编码'},
  // {key: 'apportionmentRule', title: '分摊规则', dictionary: name.APPORTIONMENT_RULE},
  {key: 'description', title: '描述'},

];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'charge_item_new'},
  {key: 'edit', title: '编辑', sign: 'charge_item_edit'},
  {key: 'del', title: '失效', sign: 'charge_item_unactive'},
  {key: 'active', title: '激活', sign: 'charge_item_active'},
  {key: 'import', title: '导入', sign: 'charge_item_import'},
  // {key: 'setRule', title: '设置分摊规则', sign: 'charge_item_setRule'}
];

const controls = [
  {key: 'chargeName', title: '费用名称', type: 'text', required: true},
  {key: 'active', title: '状态', type: 'readonly', dictionary: name.ACTIVE},
  {key: 'chargeCode', title: '费用编码', type: 'text'},
  {key: 'chargeEnName', title: '英文名称', type: 'text'},
  // {key: 'isTax', title: '税额改单', type: 'select', dictionary: name.YES_OR_NO},
  // {key: 'isNet', title: '净额改单', type: 'select', dictionary: name.YES_OR_NO},
  // {key: 'relationThreePartyCode', title: '第三方系统编码', type: 'text'},
  {key: 'description', title: '描述', type: 'text'}
];

// const apportionmentRuleConfig = {
//   controls:[{ key: 'apportionmentRule', title: '分摊规则', type: 'text', type: 'select', dictionary: name.APPORTIONMENT_RULE }],
//   title:"设置分摊规则"
// };
const index = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  description,
  searchConfig,
  // apportionmentRuleConfig
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
