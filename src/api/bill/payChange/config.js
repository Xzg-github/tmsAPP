import {pageSize, pageSizeType, description, searchConfig} from "../../globalConfig";
import name from '../../dictionary/name';

//OrderPage SearchComponent Config
const filters = [
  {key: 'renewalNumber', title: '改单编号', type: 'text'},
  {key: 'orderNumber', title: '运单号', type: 'text'},
  {key: 'customerDelegateCode', title: '委托号', type: 'text'},
  {key: 'customerId', title: '委托客户', type: 'search'},
  {key: 'supplierId', title: '供应商', type: 'search'},
  {key: 'insertTimeFrom', title: '创建时间', type: 'date'},
  {key: 'insertTimeTo', title: '到', type: 'date'},
  {key: 'customerServiceId', title: '客服人员', type: 'search'},
  {key: 'statusType', title: '状态', type: 'select', dictionary: name.STATUS_TYPE}
];

//OrderPage ToolbarComponent Config
const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'addTax', title: '新增税额改单'},
  {key: 'addNet', title: '新增净额改单'},
  {key: 'edit', title: '编辑'},
  {key: 'auditing', title: '审核'},
  {key: 'revoke', title: '撤销提交'},
  {key: 'delete', title: '删除', confirm: '是否确定删除已选中记录?'},
  {key: 'export', title: '导出', menu: [
      { key: 'exportSearch', title: '查询导出'},
      { key: 'exportPage', title: '页面导出'},
    ]},
  {key: 'config', title: '配置字段'}
];

//OrderPage SuperTableComponent Config
const tableCols = [
  {key: 'statusType', title: '状态', dictionary: name.STATUS_TYPE},
  {key: 'renewalNumber', title: '改单编号', link: true},
  {key: 'orderNumber', title: '运单订单'},
  {key: 'customerId', title: '委托客户'},
  {key: 'supplierId', title: '供应商'},
  {key: 'customerServiceId', title: '客服人员'},
  {key: 'customerDelegateCode', title: '委托号'},
  {key: 'customerDelegateTime', title: '委托日期'},
  {key: 'responsibleParty', title: '责任方', dictionary: name.RESPONSIBLE_PARTY},
  {key: 'renewalReason', title: '改单原因'},
  {key: 'renewalMode', title: '改单类型', dictionary: name.RENEWAL_MODE},
  {key: 'failedReason', title: '失败原因'},
  {key: 'checkUser', title: '审核人员'},
  {key: 'checkTime', title: '审核时间'},
  {key: 'submitUser', title: '提交人员'},
  {key: 'submitTime', title: '提交时间'},
  {key: 'remark', title: '备注'},
  {key: 'chargeFrom', title: '改单来源', dictionary: name.CHARGE_FROM},
  {key: 'interfaceRemark', title: '对接说明'},
  {key: 'interfaceStatus', title: '对接结果'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'insertUser', title: '创建用户'},
  {key: 'updateTime', title: '更新时间'},
  {key: 'updateUser', title: '更新用户'}
];

//All need Informations of OrderPage
const index = {
  filters, buttons, tableCols, pageSize, pageSizeType, description, searchConfig
};

//EditPage BaseInfo FormComponent Config
const baseInfo = [
  {key: 'renewalMode', title: '改单类别', type: 'readonly', dictionary: name.RENEWAL_MODE},
  {key: 'transportOrderId', title: '运单号', type: 'search', required: true},
  {key: 'responsibleParty', title: '责任方', type: 'select', dictionary: name.RESPONSIBLE_PARTY, required: true},
  {key: 'renewalReason', title: '改单原因', type: 'select', required: true},
  {key: 'balanceId', title: '供应商', type: 'readonly'},
  {key: 'statusType', title: '状态', type: 'readonly', dictionary: name.STATUS_TYPE},
  {key: 'remark', title: '备注', type: 'text'}
];

//EditPage costInfo buttons Config
const costInfoButtons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'copy', title: '复制新增'},
  {key: 'delete', title: '删除', confirm: '是否确认删除选中记录?'},
  {key: 'strikeBalance', title: '冲账'},
];

//EditPage costInfo cols Config
const costInfoCols = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'chargeItemId', title: '费用名称', type: 'search', copy: true, required: true},
  {key: 'balanceId', title: '结算单位', type: 'search', copy: true, required: true},
  {key: 'price', title: '单价', type: 'number', required: true, copy: true, props: {real: true, sign: true,precision: 2}},
  {key: 'number', title: '数量', type: 'number', required: true, copy: true, props: {real: true, precision: 4}},
  {key: 'chargeUnit', title: '计量单位', type: 'select', required: true, copy: true, dictionary: name.CHARGE_UNIT},
  {key: 'currency', title: '币种', type: 'select', required: true, copy: true},
  {key: 'amount', title: '费用金额', type: 'readonly', copy: true},
  {key: 'reamark', title: '备注', type: 'text', copy: true},
  {key: 'oilRatio', title: '油卡比例', type: 'number', props: {real: true, precision: 2}, copy: true},
  {key: 'exchangeRate', title: '汇率', type: 'readonly'},
  {key: 'taxRateWay', title: '计税方式', type: 'readonly', dictionary: name.TAX_RATE_WAY},
  {key: 'tax', title: '税率', type: 'readonly'},
  {key: 'taxAmount', title: '税额', type: 'readonly'},
  {key: 'netAmount', title: '净价', type: 'readonly'},

];

const controls = [
  {key: 'baseInfo', title: '基本信息', data: baseInfo}
];

const tables = [
  {key: 'costInfo', title: '费用信息', cols: costInfoCols, btns: costInfoButtons}
];

const editConfig = {
  controls, tables,
  footerButtons: [
    {key: 'cancel', title: '关闭'},
    {key: 'save', title: '保存'},
    {key: 'commit', title: '提交', bsStyle: 'primary'}
  ],
  AuditFooter: [
    {key: 'cancel', title: '关闭'},
    {key: 'reject', title: '审核不通过'},
    {key: 'confirm', title: '确认审核', bsStyle: 'primary'}
  ]
};

const tabs = [
  {key: 'index', title: '应付改单列表', close: false}
];

const config = {
  activeKey: 'index', tabs, index, editConfig,
  dicNames: [
    name.STATUS_TYPE, name.TAX_RATE_WAY, name.CHARGE_UNIT,
    name.RESPONSIBLE_PARTY, name.CHARGE_FROM, name.RENEWAL_MODE
  ]
};

export default config;

