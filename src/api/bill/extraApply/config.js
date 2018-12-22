import {pageSize, pageSizeType, description, searchConfig} from "../../globalConfig";
import name from '../../dictionary/name';

const filters = [
  {key: 'extraChargeNumber', title: '额外费用编码', type: 'text'},
  {key: 'orderNumber', title: '运单号', type: 'text'},
  {key: 'customerDelegateCode', title: '客户委托号', type: 'text'},
  {key: 'supplierId', title: '供应商', type: 'search', searchType: 'supplier'},
  {key: 'carNumber', title: '车牌号', type: 'text'},
  {key: 'statusType', title: '运单状态', type: 'select', dictionary: name.STATUS_TYPE},
  {key: 'insertUser', title: '创建人', type: 'search', searchType: 'user'},
  {key: 'waitCheckUser', title: '待审核人', type: 'search', searchType: 'user'},
  {key: 'insertTimeFrom', title: '创建时间', type: 'date'},
  {key: 'insertTimeTo', title: '至', type: 'date'},
  {key: 'settleLawsuitTimeFrom', title: '结案时间', type: 'date'},
  {key: 'settleLawsuitTimeTo', title: '至', type: 'date'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'audit', title: '审核'},
  {key: 'endACase', title: '结案'},
  {key: 'delete', title: '删除', confirm :'是否确认删除勾选数据？'}
];

const tableCols = [
  {key: 'statusType', title: '运单状态', dictionary: name.STATUS_TYPE},
  {key: 'extraChargeNumber', title: '额外费用编码', link: true},
  {key: 'orderNumber', title: '运单号'},
  {key: 'customerId', title: '委托客户'},
  {key: 'supplierId', title: '供应商'},
  {key: 'customerServiceId', title: '客服人员'},
  {key: 'customerDelegateCode', title: '委托号'},
  {key: 'customerDelegateTime', title: '委托日期'},
  {key: 'chargeFrom', title: '费用来源', dictionary: name.CHARGE_FROM},
  {key: 'occurrenceClass', title: '发生类别', dictionary: name.REASON_TYPE},
  {key: 'responsibleParty', title: '责任方', dictionary: name.RESPONSIBLE_PARTY},
  {key: 'customerPayIntention', title: '客户支付意向', dictionary: name.CUSTOMER_PAY_INTENTION},
  {key: 'description', title: '详细说明'},
  {key: 'actualOccurrenceClass', title: '实际发生类别', dictionary: name.REASON_TYPE},
  {key: 'actualResponsibleParty', title: '实际责任方', dictionary: name.RESPONSIBLE_PARTY},
  {key: 'settleLawsuitUser', title: '结案人员'},
  {key: 'settleLawsuitTime', title: '结案时间'},
  {key: 'receiveAmount', title: '应收金额'},
  {key: 'payAmount', title: '应付金额'},
  {key: 'profitAmount', title: '差额'},
  {key: 'payCheckUser', title: '应付审核人员'},
  {key: 'receiveCheckTime', title: '应付审核时间'},
  {key: 'approvalUser', title: '审批人员'},
  {key: 'approvalTime', title: '审批时间'},
  {key: 'fallbackRemark', title: '回退原因'},
  {key: 'waitCheckUser', title: '待审核人员'},
  {key: 'insertUser', title: '创建人员'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateUser', title: '更新人员'},
  {key: 'updateTime', title: '更新时间'}
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

const baseInfo = [
  {key: 'transportOrderId', title: '运单号', type: 'search', required: true},
  {key: 'occurrenceClass', title: '发生类别', type: 'select', dictionary: name.REASON_TYPE, required: true},
  {key: 'responsibleParty', title: '责任方', type: 'select', dictionary: name.RESPONSIBLE_PARTY, required: true},
  {key: 'customerPayIntention', title: '客户支付意向', type: 'select', dictionary: name.CUSTOMER_PAY_INTENTION, required: true},
  {key: 'description', title: '详细说明', type: 'textArea'}
];

const controls = [
  {key: 'baseInfo', title: '基本信息', cols: baseInfo}
];

const payButtons = [
  {key: 'edit_add', title: '新增', bsStyle: 'primary'},
  {key: 'edit_copy', title: '复制新增'},
  {key: 'edit_del_pay', title: '删除', confirm: '是否确定删除选中的未审核费用？'},
];

const payCols = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'balanceId', title: '结算单位', type: 'search', searchType: 'supplier'},
  {key: 'chargeItemId', title: '费用名称', type: 'search'},
  {key: 'chargeUnit', title: '计量单位', type: 'select', dictionary: name.CHARGE_UNIT},
  {key: 'price', title: '单价', type: 'number', props: {real: true, precision: 2}},
  {key: 'number', title: '数量', type: 'number'},
  {key: 'amount', title: '金额', type: 'readonly'},
  {key: 'currency', title: '币种', type: 'select', dictionary: 'currency'},
  {key: 'exchangeRate', title: '汇率', type: 'readonly'},
  {key: 'tax', title: '税率', type: 'readonly'},
  {key: 'taxType', title: '计税方式', type: 'readonly', dictionary: name.TAX_TYPE},
  {key: 'taxAmount', title: '税额', type: 'readonly'},
  {key: 'netAmount', title: '净价', type: 'readonly'},
  {key: 'remark', title: '备注', type: 'text'},
  {key: 'isAdditional', title: '是否额外费用', type: 'select', dictionary: name.ZERO_ONE_TYPE},
  {key: 'statusType', title: '状态', type: 'select', dictionary: name.STATUS_TYPE},
  {key: 'relationNumber', title: '关联编码', type: 'text'},
  {key: 'chargeOrigin', title: '费用来源', type: 'select', dictionary: name.CHARGE_ORIGIN},
  {key: 'isExpense', title: '是否报销', type: 'select', dictionary: name.ZERO_ONE_TYPE},
  {key: 'isOutputValue', title: '是否产值', type: 'select', dictionary: name.ZERO_ONE_TYPE},
  {key: 'sequence', title: '排序', type: 'readonly'},
  {key: 'institutionId', title: '费用归属机构', type: 'readonly'},
  {key: 'insertUser', title: '创建人', type: 'readonly'},
  {key: 'insertDate', title: '创建时间', type: 'readonly'},
  {key: 'updateUser', title: '更新人', type: 'readonly'},
  {key: 'updateDate', title: '更新时间', type: 'readonly'}
];

const receiveCols = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'balanceId', title: '结算单位', type: 'search', searchType: 'customer'},
  {key: 'chargeItemId', title: '费用名称', type: 'search'},
  {key: 'chargeUnit', title: '计量单位', type: 'select', dictionary: name.CHARGE_UNIT},
  {key: 'price', title: '单价', type: 'number', props: {real: true, precision: 2}},
  {key: 'number', title: '数量', type: 'number', props: {real: true, precision: 4}},
  {key: 'amount', title: '金额', type: 'readonly', props: {real: true, precision: 2}},
  {key: 'currency', title: '币种', type: 'select', dictionary: 'currency'},
  {key: 'exchangeRate', title: '汇率', type: 'readonly'},
  {key: 'remark', title: '备注', type: 'text'},
  {key: 'statusType', title: '状态', type: 'readonly', dictionary: name.STATUS_TYPE}
];

const tables = [
  {key: 'payChargeList', title: '应付费用', cols: payCols, btns: payButtons},
  {key: 'receiveChargeList', title: '应收费用', cols: receiveCols}
];

const footerButtons = [
  {key: 'close', title: '关闭', showInEditType: [0, 1, 2, 3, 4]},
  {key: 'save', title: '保存', showInEditType: [0, 2]},
  {key: 'commit', title: '提交', bsStyle: 'primary', showInEditType: [0, 2]},
  {key: 'fallback', title: '回退', bsStyle: 'primary', showInEditType: [3]},
  {key: 'review', title: '审核', bsStyle: 'primary', showInEditType: [3]},
  {key: 'endACase', title: '结案', bsStyle: 'primary', showInEditType: [4]}
];

const amountInfo = [
  {key: 'receiveNet', title: '应收净额', important: true},
  {key: 'payNet', title: '应付净额'},
  {key: 'profit', title: '差额'}
];

const fallbackInfo = [
  {key: 'fallbackReason', title: '回退原因', type: 'textArea'}
];

const resultForm = {
  key: 'resultInfo',
  title: '处理结果',
  cols: [
    {key: 'actualOccurrenceClass', title: '发生类别', type: 'select', dictionary: name.REASON_TYPE, required: true},
    {key: 'actualResponsibleParty', title: '责任定义', type: 'select', dictionary: name.RESPONSIBLE, required: true},
  ]
};

const editConfig = {
  controls,
  payBtns: [{key: 'convert', title: '转应收'}],
  receiveBtns: [{key: 'edit_del_receive', title: '删除'}],
  tables,
  footerButtons,
  amountInfo,
  fallbackInfo,
  resultForm
};

const tabs = [
  {key: 'index', title: '额外费用列表', close: false}
];

const config = {
  activeKey: 'index',
  tabs,
  index,
  editConfig,
  names: [
    name.STATUS_TYPE,
    name.CHARGE_FROM,
    name.REASON_TYPE,
    name.RESPONSIBLE_PARTY,
    name.CHARGE_UNIT,
    name.CUSTOMER_PAY_INTENTION,
    name.TAX_TYPE,
    name.ZERO_ONE_TYPE,
    name.CHARGE_ORIGIN
  ]
};

export default config;

