import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'orderNumber', title: '运单号', type: 'text'},
  {key: 'customerDelegateCode', title: '委托号', type: 'text'},
  {key: 'customerId', title: '客户', type: 'search'},
  {key: 'businessType', title: '运输类型', type: 'select', dictionary: name.BUSINESS_TYPE},
  {key: 'customerServiceId', title: '客服人员', type: 'search'},
  {key: 'transportType', title: '运输方式', type: 'select', dictionary: name.TRANSPORT_TYPE},
  {key: 'carModeId', title: '车型', type: 'search'},
  {key: 'departure', title: '始发地', type: 'search'},
  {key: 'destination', title: '目的地', type: 'search'},
  {key: 'planPickupTimeFrom', title: '要求装货时间', type: 'date'},
  {key: 'planPickupTimeTo', title: '至', type: 'date'},
  {key: 'insertTimeFrom', title: '创建时间', type: 'date'},
  {key: 'insertTimeTo', title: '至', type: 'date'}
];

const btns = [
  {key: 'edit', title: '编辑', bsStyle: 'primary', showInTab: ['0', '1']},
  {key: 'audit', title: '整审', showInTab: ['1']},
  {key: 'import', title: '导入', showInTab: ['0', '1']},
  {key: 'export', title: '导出', showInTab: ['0', '1', '2'], menu: [
    { key: 'exportSearch', title: '查询导出'},
    { key: 'exportPage', title: '页面导出'},
  ]},
  {key: 'changeOrder', title: '改单', showInTab: ['2']},
  {key: 'createBill', title: '生成账单', showInTab: ['1'], menu: [
    {key: 'createBill_selection', title:'按选择'},
    {key: 'createBill_waybillBalanceCompany', title:'按运单、结算单位'},
    {key: 'createBill_waybillBalanceCompanyAndCurrency', title:'按运单、结算单位、币种'},
    {key: 'createBill_waybillBalanceCompanyAndTax', title:'按运单、结算单位、税率'},
    {key: 'createBill_waybillBalanceCompanyAndTaxAndCurrency', title:'按运单、结算单位、币种、税率'},
  ]},
  {key: 'config', title: '配置字段', showInTab: ['0', '1', '2']}
];

const tableCols = [
  {key: 'orderNumber', title: '运单号', link: true},
  {key: 'customerId', title: '客户'},
  {key: 'customerDelegateCode', title: '委托号'},
  {key: 'customerDelegateTime', title: '委托日期'},
  {key: 'receivableAmount', title: '总应收金额（含税）'},
  {key: 'payAmount', title: '总应付金额（含税）'},
  {key: 'receivableTaxAmount', title: '应收税额'},
  {key: 'payTaxAmount', title: '应付税额'},
  {key: 'profitAmount', title: '利润'},
  {key: 'receivableCheckUserId', title: '应收整审人员'},
  {key: 'receivableCheckTime', title: '应收整审时间'},
  {key: 'salespersonId', title: '销售人员'},
  {key: 'businessType', title: '运输类型', dictionary: name.BUSINESS_TYPE},
  {key: 'customerServiceId', title: '客服人员'},
  {key: 'transportType', title: '运输方式', dictionary: name.TRANSPORT_TYPE},
  {key: 'statusType', title: '运单状态', dictionary: name.STATUS_TYPE},
  {key: 'orderType', title: '任务状态', dictionary: name.STATUS_TYPE},
  {key: 'carModeId', title: '车型'},
  {key: 'departure', title: '始发地'},
  {key: 'destination', title: '目的地'},
  {key: 'planPickupTime', title: '要求装货时间'},
  {key: 'planDeliveryTime', title: '要求卸货时间'},
  {key: 'route', title: '路线'},
  {key: 'commodityDescription', title: '商品描述'},
  {key: 'palletsNumber', title: '总卡板数'},
  {key: 'goodsNumber', title: '总数量'},
  {key: 'volume', title: '总体积'},
  {key: 'roughWeight', title: '总重量'},
  {key: 'insertUser', title: '创建人员'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateUser', title: '更新人员'},
  {key: 'updateTime', title: '更新时间'}
];

// 明细界面应收表格
const receiveCols = [
  {key: 'customerId', title: '结算单位'},
  {key: 'chargeItemId', title: '费用名称'},
  {key: 'chargeUnit', title: '计量单位', dictionary: name.CHARGE_UNIT},
  {key: 'price', title: '单价'},
  {key: 'number', title: '数量'},
  {key: 'amount', title: '金额'},
  {key: 'currency', title: '币种', dictionary: 'currency'},
  {key: 'exchangeRate', title: '汇率'},
  {key: 'tax', title: '税率'},
  {key: 'taxRateWay', title: '计税方式', dictionary: name.TAX_TYPE},
  {key: 'taxAmount', title: '税额'},
  {key: 'netAmount', title: '净价'},
  {key: 'remark', title: '备注'},
  {key: 'isAdditional', title: '是否额外费用', dictionary: name.ZERO_ONE_TYPE},
  {key: 'statusType', title: '状态', dictionary: 'status_type_01'},
  {key: 'relationNumber', title: '关联编码'},
  {key: 'chargeOrigin', title: '费用来源', dictionary: name.CHARGE_ORIGIN},
  {key: 'institutionId', title: '费用归属机构'},
  {key: 'insertUser', title: '创建人'},
  {key: 'inserTime', title: '创建时间'},
  {key: 'updateUser', title: '更新人'},
  {key: 'updateTime', title: '更新时间'}
];

// 明细界面应收工具条
const receiveButtons = [
  {key: 'edit_add', title: '新增', bsStyle: 'primary'},
  {key: 'edit_copy', title: '复制新增'},
  {key: 'edit_edit', title: '编辑'},
  {key: 'edit_del', title: '删除', confirm: '是否确定删除选中的未审核费用？'},
  {key: 'edit_audit', title: '审核', confirm: '是否确定审核选中的未审核费用？'},
  {key: 'edit_strikeBlance', title: '冲账', confirm: '是否执行冲账？'},
  {key: 'edit_autoBilling', title: '自动计费'},
  {key: 'edit_configKeys_receive', title: '配置字段'},
];

// 明细界面应付表格
const payCols = [
  {key: 'isTransferReceivables', title: '是否转应收', dictionary: name.ZERO_ONE_TYPE},
  {key: 'supplierId', title: '结算单位'},
  {key: 'chargeItemId', title: '费用名称'},
  {key: 'chargeUnit', title: '计量单位', dictionary: name.CHARGE_UNIT},
  {key: 'price', title: '单价'},
  {key: 'number', title: '数量'},
  {key: 'amount', title: '金额'},
  {key: 'currencyTypeCode', title: '币种', dictionary: 'currency'},
  {key: 'exchangeRate', title: '汇率'},
  {key: 'tax', title: '税率'},
  {key: 'taxRateWay', title: '计税方式', dictionary: name.TAX_TYPE},
  {key: 'taxAmount', title: '税额'},
  {key: 'netAmount', title: '净价'},
  {key: 'remark', title: '备注'},
  {key: 'isAdditional', title: '是否额外费用', dictionary: name.ZERO_ONE_TYPE},
  {key: 'statusType', title: '状态', dictionary: 'status_type_01'},
  {key: 'relationNumber', title: '关联编码'},
  {key: 'chargeOrigin', title: '费用来源', dictionary: name.CHARGE_ORIGIN},
  {key: 'isExpense', title: '是否报销', dictionary: name.ZERO_ONE_TYPE},
  {key: 'isOutputValue', title: '是否产值', dictionary: name.ZERO_ONE_TYPE},
  {key: 'institutionId', title: '费用归属机构'},
  {key: 'insertUser', title: '创建人'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateUser', title: '更新人'},
  {key: 'updateTime', title: '更新时间'}
];

// 明细界面应付工具条
const payButtons = [
  {key: 'convert', title: '转应收', bsStyle: 'primary'},
  {key: 'edit_configKeys_pay', title: '配置字段'},
];

// 主界面的页签配置
const tabs2 = [
  {key: '0', title: '待明细审核', keySign: 'audit_detail_waiting'},
  {key: '1', title: '待整审', keySign: 'audit_waiting'},
  {key: '2', title: '已整审', keySign: 'audit_completed'}
];

// 明细界面汇总信息配置
const totalKeys = [
  {key: 'totalReceivableAmount', title: '应收总额'},
  {key: 'totalPayableAmount', title: '应付总额'},
  {key: 'profit', title: '利润'},
  {key: 'totalReceivableNetAmount', title: '应收净额'},
  {key: 'totalPayableNetAmount', title: '应付净额'},
];

const dialogBtnsReceive = [
  {key: "add", title: "新增", bsStyle: 'primary'},
  {key: "copy", title: "复制"},
  {key: "del", title: "移除", confirm: '是否确定删除所有选中项？'},
  {key: "get", title: "获取费用项"},
  {key: "config", title: "配置字段"},
];

const receiveColsEdit = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'customerId', title: '结算单位', type: 'search', required: true},
  {key: 'chargeItemId', title: '费用名称', type: 'search', required: true},
  {key: 'chargeUnit', title: '计量单位', type: 'select', required: true, dictionary: name.CHARGE_UNIT},
  {key: 'price', title: '单价', type: 'number', required: true, props: {real: true, precision: 2}},
  {key: 'number', title: '数量', type: 'number', required: true, props: {real: true, precision: 4}},
  {key: 'amount', title: '金额', type: 'readonly', props: {real: true, precision: 2}},
  {key: 'currency', title: '币种', type: 'select', required: true, dictionary: 'currency'},
  {key: 'exchangeRate', title: '汇率', type: 'readonly'},
  {key: 'remark', title: '备注', type: 'text'},
  {key: 'statusType', title: '状态', type: 'readonly', dictionary: 'status_type_01'}
];

const payColsEdit = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'isTransferReceivables', title: '是否转应收', type: 'select', dictionary: name.ZERO_ONE_TYPE},
  {key: 'transportOrderId', title: '运单订单标识', type: 'search'},
  {key: 'customerId', title: '结算单位', type: 'search'},
  {key: 'chargeItemId', title: '费用名称', type: 'search'},
  {key: 'chargeUnit', title: '计量单位', type: 'select', dictionary: name.CHARGE_UNIT},
  {key: 'price', title: '单价', type: 'number'},
  {key: 'number', title: '数量', type: 'number'},
  {key: 'amount', title: '金额', type: 'number'},
  {key: 'currency', title: '币种', type: 'select', dictionary: 'currency'},
  {key: 'exchangeRate', title: '汇率', type: 'number'},
  {key: 'tax', title: '税率', type: 'number'},
  {key: 'taxRateWay', title: '计税方式', type: 'select', dictionary: name.TAX_TYPE},
  {key: 'taxAmount', title: '税额', type: 'number'},
  {key: 'netAmount', title: '净价', type: 'number'},
  {key: 'remark', title: '备注', type: 'text'},
  {key: 'isAdditional', title: '是否额外费用', type: 'select', dictionary: name.ZERO_ONE_TYPE},
  {key: 'statusType', title: '状态', type: 'select', dictionary: 'status_type_01'},
  {key: 'relationNumber', title: '关联编码', type: 'text'},
  {key: 'chargeOrigin', title: '费用来源', type: 'select', dictionary: name.CHARGE_ORIGIN},
  {key: 'isExpense', title: '是否报销', type: 'select', dictionary: name.ZERO_ONE_TYPE},
  {key: 'isOutputValue', title: '是否产值', type: 'select', dictionary: name.ZERO_ONE_TYPE},
  {key: 'sequence', title: '排序', type: 'text'},
  {key: 'institutionId', title: '费用归属机构', type: 'search'},
  {key: 'insertUser', title: '创建人', type: 'date'},
  {key: 'insertTime', title: '创建时间', type: 'date'},
  {key: 'updateUser', title: '更新人', type: 'date'},
  {key: 'updateTime', title: '更新时间', type: 'date'}
];

const dialogBtnsPay = [
  {key: "del", title: "移除", bsStyle: 'primary', confirm: '是否确定删除所有选中项？'}
];

// 主界面配置
const index = {
  tabKey: '0',
  tabs2,
  filters,
  btns,
  tableCols,
  pageSize,
  pageSizeType,
  description,
  searchConfig,
};

// 明细界面配置
const editConfig = {
  payCols,
  payButtons,
  receiveCols,
  receiveButtons,
  totalKeys,
  dialogBtnsReceive,
  receiveColsEdit,
  payColsEdit,
  dialogBtnsPay
};

const tabs = [
  {key: 'index', title: '应收结算列表', close: false}
];

const config = {
  activeKey: 'index',
  tabs,
  index,
  editConfig,
  names: [
    name.BUSINESS_TYPE,
    name.STATUS_TYPE,
    name.TRANSPORT_TYPE,
    name.CHARGE_ORIGIN,
    name.CHARGE_UNIT,
    name.ZERO_ONE_TYPE,
    name.TAX_TYPE
  ]
};

export default config;
