import {pageSize, pageSizeType, description, searchConfig} from "../../globalConfig";
import name from '../../dictionary/name';

//OrderPage SearchComponent Config
const filters = [
  {key: 'billNumber', title: '账单号', type: 'text'},
  {key: 'orderNumber', title: '运单号', type: 'text'},
  {key: 'customerDelegateCode', title: '委托号', type: 'text'},
  {key: 'customerId', title: '委托客户', type: 'search', searchType: 'customer_all'},
  {key: 'supplierId', title: '供应商', type: 'search', searchType: 'supplier_all'},
  {key: 'receivableSupplierId', title: '收款单位', type: 'search', searchType: 'supplier_all'},
  {key: 'insertTimeFrom', title: '创建时间', type: 'date'},
  {key: 'insertTimeTo', title: '到', type: 'date'},
  {key: 'customerServiceId', title: '客服人员', type: 'search', searchType: 'user'},
  {key: 'statusType', title: '状态', type: 'select', dictionary: name.STATUS_TYPE}
];

//OrderPage ToolbarComponent Config
const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'delete', title: '删除', confirm: '是否确定删除已选草稿状态的记录?'},
  {key: 'audit', title: '审核', confirm: '是否审核?'},
  {key: 'output', title: '输出'},
  {key: 'export', title: '导出', menu: [
    { key: 'exportSearch', title: '查询导出'},
    { key: 'exportPage', title: '页面导出'},
  ]}
];

//OrderPage SuperTableComponent Config
const tableCols = [
  {key: 'statusType', title: '状态', dictionary: name.STATUS_TYPE},
  {key: 'billNumber', title: '账单号', link: true},
  {key: 'orderNumber', title: '运单订单'},
  {key: 'receivableSupplierId', title: '收款单位'},
  {key: 'supplierId', title: '供应商'},
  {key: 'customerId', title: '委托客户'},
  {key: 'customerServiceId', title: '客服人员'},
  {key: 'customerDelegateCode', title: '委托号'},
  {key: 'customerDelegateTime', title: '委托日期'},
  {key: 'customerHeaderInformation', title: '客户抬头'},
  {key: 'currency', title: '币种'},
  {key: 'supplierContact', title: '联系人名称'},
  {key: 'supplierContactPhone', title: '联系人电话'},
  {key: 'supplierContactFax', title: '联系人传真'},
  {key: 'amount', title: '含税金额'},
  {key: 'taxAmount', title: '税额'},
  {key: 'fallbackReason', title: '回退原因'},
  {key: 'fallbackTime', title: '回退时间'},
  {key: 'fallbackUser', title: '回退用户'},
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
  {key: 'orderNumber', title: '运单订单', type: 'readonly'},
  {key: 'receivableSupplierId', title: '收款单位', type: 'search', searchType: 'supplier_all', required: true},
  {key: 'currency', title: '币种', type: 'search', required: true},
  {key: 'supplierContact', title: '联系人名称', type: 'search'},
  {key: 'supplierContactPhone', title: '联系人电话', type: 'text'},
  {key: 'supplierContactFax', title: '联系人传真', type: 'text'},
  {key: 'amount', title: '结算金额', type: 'readonly'},
  {key: 'amountCapital', title: '金额大写', type: 'readonly'},
  {key: 'supplierHeaderInformation', title: '供应商抬头', type: 'search', props: {searchWhenClick: true}, showAdd: true},
];

//EditPage costInfo buttons Config
const costInfoButtons = [
  {key: 'join', title: '加入', bsStyle: 'primary'},
  {key: 'remove', title: '移除', confirm: '是否确认删除选中记录?'},
  {key: 'changeSort', title: '变更排序'}
];

//EditPage costInfo cols Config
const costInfoCols = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'sequence', title: '排序', type: 'number', required: true},
  {key: 'supplierId', title: '结算单位', type: 'readonly'},
  {key: 'chargeItemId', title: '费用名称', type: 'readonly'},
  {key: 'chargeUnit', title: '计量单位', type: 'readonly', dictionary: name.CHARGE_UNIT},
  {key: 'currency', title: '币种', type: 'readonly'},
  {key: 'billExchangeRate', title: '汇率', type: 'text'},
  {key: 'exchangeRate', title: '开票汇率', type: 'text'},
  {key: 'price', title: '单价', type: 'readonly'},
  {key: 'number', title: '数量', type: 'readonly'},
  {key: 'amount', title: '费用金额', type: 'readonly'},
  {key: 'tax', title: '税率', type: 'readonly'},
  {key: 'taxRateWay', title: '计税方式', type: 'readonly', dictionary: name.TAX_RATE_WAY},
  {key: 'taxAmount', title: '税额', type: 'readonly'},
  {key: 'netAmount', title: '净价', type: 'readonly'},
  {key: 'reamark', title: '备注', type: 'readonly'}
];

//EditPage joinDialog SuperTableComponent Config
const joinDialogTableCols = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'supplierId', title: '结算单位', type: 'text'},
  {key: 'chargeItemId', title: '费用名称', type: 'text'},
  {key: 'chargeUnit', title: '计量单位', type: 'select', dictionary: name.CHARGE_UNIT},
  {key: 'currency', title: '币种', type: 'text'},
  {key: 'billExchangeRate', title: '汇率', type: 'text'},
  {key: 'price', title: '单价', type: 'text'},
  {key: 'number', title: '数量', type: 'number', copy: true, props: {real: true, precision: 4}},
  {key: 'amount', title: '费用金额', type: 'text'}
];

const controls = [
  {key: 'baseInfo', title: '基本信息', data: baseInfo}
];

const tables = [
  {key: 'chargeList', title: '费用信息', cols: costInfoCols, btns: costInfoButtons}
];

const editConfig = {
  controls, tables, joinDialogTableCols,
  footerButtons: [
    {key: 'close', title: '关闭', readonlyPage: true},
    {key: 'save', title: '保存'},
    {key: 'send', title: '发送', bsStyle: 'primary'}
  ]
};

//Define incomeTag select options
const incomeTagOptions = [
  {value: 0, title: '待明细审核'},
  {value: 1, title: '待整审'},
  {value: 2, title: '已整审'}
];

//AddDialog SearchComponent Config
const addDialogFilters = [
  {key: 'orderNumber', title: '运单号', type: 'text'},
  {key: 'customerDelegateCode', title: '委托号', type: 'text'},
  {key: 'customerId', title: '委托客户', type: 'search', searchType: 'customer_all'},
  {key: 'supplierId', title: '供应商', type: 'search', searchType: 'supplier_all'},
  {key: 'incomeTag', title: '费用状态', type: 'select', options: incomeTagOptions},
  {key: 'statusType', title: '运单状态', type: 'select', dictionary: 'status_type_addDialog'},
  {key: 'customerDelegateTimeFrom', title: '委托日期', type: 'date'},
  {key: 'customerDelegateTimeTo', title: '至', type: 'date'},
  {key: 'planPickupTimeFrom', title: '预计装货时间', type: 'date'},
  {key: 'planPickupTimeTo', title: '至', type: 'date'}
];

//AddDialog SuperTableComponent Config
const addDialogCols = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'orderNumber', title: '运单号'},
  {key: 'customerDelegateCode', title: '委托号'},
  {key: 'customerId', title: '委托客户'},
  {key: 'supplierId', title: '供应商'},
  {key: 'incomeTag', title: '费用状态', options: incomeTagOptions},
  {key: 'statusType', title: '运单状态', dictionary: 'status_type_addDialog'},
  {key: 'receivableBillAmount', title: '可对帐税金额'},
  {key: 'planPickupTime', title: '要求装货时间'},
  {key: 'customerDelegateTime', title: '委托日期'}
];

//AddDialog FooterButtons Config
const addDialogButtons = [
  {key: 'close', title: '关闭'},
  {key: 'selection', title: '按选择'},
  {key: 'balanceCompany', title: '按结算单位'},
  {key: 'balanceCompanyAndCurrency', title: '按结算单位与币种'},
  {key: 'balanceCompanyAndTax', title: '按结算单位与税率'},
  {key: 'balanceCompanyAndTaxAndCurrency', title: '按结算单位与税率与币种'},
];

//All need Informations of AddDialog
const addConfig = {
  filters: addDialogFilters,
  cols: addDialogCols,
  buttons: addDialogButtons,
  pageSize,
  pageSizeType,
  description,
  searchConfig,
  tableTitle: '结算单信息',
  title: '选择运单'
};

const tabs = [
  {key: 'index', title: '应付账单列表', close: false}
];

const config = {
  activeKey: 'index', tabs, index, editConfig, addConfig,
  dicNames: [
    name.TAX_RATE_WAY, name.CHARGE_UNIT
  ]
};

export default config;

