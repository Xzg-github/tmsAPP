import {pageSize, pageSizeType, description, searchConfig} from "../../globalConfig";
import name from '../../dictionary/name';
import invoiceConfig from '../../config/customerInvoice/config';

const filters = [
  {key: 'orderNumber', title: '运单号', type: 'text'},
  {key: 'customerDelegateCode', title: '客户委托号', type: 'text'},
  {key: 'customerId', title: '结算单位', type: 'search', searchType: 'customer_all'},
  {key: 'receivableInvoiceNumber', title: '发票号', type: 'text'},
  {key: 'billNumber', title: '账单号', type: 'text'},
  {key: 'receivableInvoiceSysNumber', title: '发票申请号', type: 'text'},
  {key: 'receivableInvoiceCode', title: '发票代码', type: 'text'},
  {key: 'invoiceTimeFrom', title: '发票日期', type: 'date'},
  {key: 'invoiceTimeTo', title: '至', type: 'date'},
  {key: 'invoiceHeaderInformation', title: '发票抬头', type: 'text'},
  {key: 'statusType', title: '状态', type: 'select', dictionary: name.STATUS_TYPE},
  {key: 'invoiceCategory', title: '发票种类', type: 'select', dictionary: name.INVOICE_CATEGORY},
  {key: 'settlementPersonnel', title: '财务人员', type: 'search', searchType: 'user'},
  {key: 'insertTimeFrom', title: '创建时间', type: 'date'},
  {key: 'insertTimeTo', title: '至', type: 'date'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'delete', title: '删除', confirm: '是否确定删除已选草稿状态的记录?'},
  {key: 'commit', title: '提交'},
  {key: 'revoke', title: '撤销'},
  {key: 'accept', title: '受理'},
  {key: 'invoice', title: '开票'},
  {key: 'output', title: '输出'}
];

const tableCols = [
  {key: 'receivableInvoiceSysNumber', title: '发票申请号', link: true},
  {key: 'statusType', title: '状态', dictionary: name.STATUS_TYPE},
  {key: 'orderNumber', title: '运单号'},
  {key: 'customerDelegateCode', title: '客户委托号'},
  {key: 'receivableInvoiceNumber', title: '发票号'},
  {key: 'receivableInvoiceCode', title: '发票代码'},
  {key: 'invoiceTime', title: '开票日期'},
  {key: 'billNumber', title: '账单号'},
  {key: 'invoiceCategory', title: '发票种类', type: 'select', dictionary: name.INVOICE_CATEGORY},
  {key: 'taxRegistrationNumber', title: '税务登记号'},
  {key: 'businessRegistrationNumber', title: '工商注册号'},
  {key: 'customerId', title: '结算单位'},
  {key: 'invoiceHeaderInformation', title: '发票抬头'},
  {key: 'taxpayerIdentificationNumber', title: '纳税人识别号'},
  {key: 'addressPhone', title: '地址'},
  {key: 'openingBank', title: '开户行'},
  {key: 'accountNumber', title: '银行账号'},
  {key: 'isPost', title: '是否寄发票'},
  {key: 'postAddress', title: '寄送地址'},
  {key: 'remark', title: '备注'},
  {key: 'exchangeAmount', title: '发票金额'},
  {key: 'tax', title: '税率'},
  {key: 'taxAmount', title: '税额'},
  {key: 'exchangeCurrency', title: '币种'},
  {key: 'interfaceStatus', title: '对接结果'},
  {key: 'interfaceRemark', title: '对接说明'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'insertUser', title: '创建用户'},
  {key: 'updateTime', title: '更新时间'},
  {key: 'updateUser', title: '更新用户'}
];

const index = {
  filters, buttons, tableCols, pageSize, pageSizeType, description, searchConfig
};

const invoiceShowModeOptions = [
  {value: '0', title: '汇总'},
  {value: '1', title: '明细'}
];

const baseInfo = [
  {key: 'receivableInvoiceNumber', title: '发票号', type: 'text'},
  {key: 'receivableInvoiceCode', title: '发票代码', type: 'text'},
  {key: 'invoiceTime', title: '开票日期', type: 'date'},
  {key: 'billNumber', title: '账单号', type: 'readonly'},
  {key: 'invoiceShowMode', title: '发票显示方式', type: 'select', options: invoiceShowModeOptions},
  {key: 'invoiceCategory', title: '发票种类', type: 'select', dictionary: name.INVOICE_CATEGORY},
  {key: 'institutionId', title: '法人主体（结算区域）', type: 'search'},
  {key: 'receivableOpeningBank', title: '法人开户行', type: 'search'},
  {key: 'receivableAccountNumber', title: '法人银行账号', type: 'text'},
  {key: 'enterpriseSignature', title: '企业签章', type: 'readonly'},
  {key: 'taxRegistrationNumber', title: '税务登记号', type: 'readonly'},
  {key: 'businessRegistrationNumber', title: '工商注册号', type: 'readonly'}
];

const goodsInfo = [
  {key: 'customerId', title: '结算单位', type: 'readonly'},
  {key: 'invoiceHeaderInformation', title: '发票抬头', type: 'search', showAdd: true},
  {key: 'taxpayerIdentificationNumber', title: '纳税人识别号', type: 'readonly'},
  {key: 'addressPhone', title: '地址', type: 'readonly'},
  {key: 'openingBank', title: '开户行', type: 'readonly'},
  {key: 'accountNumber', title: '银行账号', type: 'readonly'},
  {key: 'isPost', title: '是否寄发票', type: 'select', dictionary: name.ZERO_ONE},
  {key: 'postAddress', title: '寄送地址', type: 'text'},
  {key: 'isThirdPartyAgreement', title: '是否第三方协议', type: 'select', dictionary: name.ZERO_ONE}
];

const controls = [
  {key: 'baseInfo', title: '基本信息', cols: baseInfo},
  {key: 'goodsInfo', title: '货物信息', cols: goodsInfo}
];

const invoiceInfoConfig = {
  cols: [
    {key: 'goodsName', title: '货物名称', type: 'textarea',
      otherProps: {prefix: '金额合计：', colSpan: 1, align: 'right'}},
    {key: 'chargeName', title: '费用项', type: 'textarea',
      otherProps: {colSpan: 9, align: 'left', select: true}},
    {key: 'price', title: '单价', type: 'number', props: {real: true, precision: 2},
      otherProps: {disabled: true}},
    {key: 'itemCount', title: '数量', type: 'number',
      otherProps: {disabled: true}},
    {key: 'tax', title: '税率', type: 'number', props: {real: true, precision: 2, zero: true},
      otherProps: {disabled: true}},
    {key: 'taxAmount', title: '税额', type: 'number', props: {real: true, precision: 2},
      otherProps: {disabled: true}},
    {key: 'netAmount', title: '净额', type: 'number', props: {real: true, precision: 2},
      otherProps: {disabled: true}},
    {key: 'contentCurrency', title: '币种', type: 'text',
      otherProps: {disabled: true}},
      {key: 'contentAmount', title: '金额', type: 'text',
        otherProps: {disabled: true}},
    {key: 'exchangeCurrency', title: '开票币种', type: 'textarea',
      otherProps: {disabled: true}},
    {key: 'amount', title: '开票金额', type: 'textarea',
      otherProps: {prefix: '合计：', colSpan: 1, align: 'right',}},
    {key: 'remark', title: '备注', type: 'textarea', props: {real: true, precision: 2},
      otherProps: {colSpan: 1, addonBefore: '￥', align: 'left', type: 'number',}}
  ]
};

const costInfoConfig = {
  buttons: [
    {key: 'join', title: '加入', bsStyle: 'primary'},
    {key: 'remove', title: '移除', confirm: '是否确认删除选中记录?'},
    {key: 'changeExchangeRate', title: '变更开票税率'}
  ],
  cols: [
    {key: 'billNumber', title: '账单号'},
    {key: 'orderNumber', title: '运单号'},
    {key: 'customerDelegateCode', title: '客户委托号'},
    {key: 'invoiceExchangeRate', title: '开票汇率'},
    {key: 'customerId', title: '结算单位'},
    {key: 'chargeItemId', title: '费用名称'},
    {key: 'chargeUnit', title: '计量单位', dictionary: name.CHARGE_UNIT},
    {key: 'price', title: '单价'},
    {key: 'number', title: '数量'},
    {key: 'amount', title: '金额'},
    {key: 'currencyTypeCode', title: '币种', dictionary: name.BALANCE_CURRENCY},
    {key: 'tax', title: '税率'},
    {key: 'taxRateWay', title: '计税方式', dictionary: name.TAX_RATE_WAY},
    {key: 'taxAmount', title: '税额'},
    {key: 'netAmount', title: '净价'},
    {key: 'reamark', title: '备注'}
  ],
  joinDialogConfig: {
    title: '可加入费用信息',
    pageSize,
    pageSizeType,
    description,
    searchConfig,
    filters: [
      { key: 'billNumber', title: '账单编号', type: 'text' },
      { key: 'incomeCode', title: '结算单号', type: 'text' },
      { key: 'logisticsOrderNumber', title: '物流订单号', type: 'text' }
    ],
    cols: [
      {key: 'checked', title: '', type: 'checkbox'},
      {key: 'customerId', title: '结算单位', type: 'text'},
      {key: 'chargeItemId', title: '费用名称', type: 'text'},
      {key: 'chargeUnit', title: '计量单位', type: 'select', dictionary: name.CHARGE_UNIT},
      {key: 'currency', title: '币种', type: 'text'},
      {key: 'billExchangeRate', title: '汇率', type: 'text'},
      {key: 'price', title: '单价', type: 'text', props: {real: true, precision: 2}},
      {key: 'number', title: '数量', type: 'number', copy: true},
      {key: 'amount', title: '费用金额', type: 'text'}
    ]
  },
  changeRateDialogConfig: {
    title: '变更开票汇率',
    cols: [
      {key: 'currency', title: '币种', type: 'readonly'},
      {key: 'invoiceExchangeRate', title: '开票汇率', type: 'number', props: {real: true, precision: 4} }
    ]
  }
};

const editConfig = {
  activeKey: 'invoiceInfo',
  tabs: [
    {key: 'invoiceInfo', title: '发票内容'},
    {key: 'costInfo', title: '费用信息'}
  ],
  controls,
  invoiceInfoConfig,
  costInfoConfig,
  addInvoiceConfig: invoiceConfig.editConfig,
  footerButtons: [
    {key: 'close', title: '关闭'},
    {key: 'save', title: '保存'},
    {key: 'commit', title: '提交', bsStyle: 'primary'}
  ]
};

const addDialogConfig = {
  title: '发票申请',
  filters: [
    {key: 'customerId', title: '结算单位', type: 'search', searchType: 'customer_all', required: true},
    {key: 'tax', title: '税率', type: 'number', required: true},
    {key: 'orderNumber', title: '运单号', type: 'text'},
    {key: 'billNumber', title: '账单号', type: 'text'},
    {key: 'customerDelegateCode', title: '客户委托号', type: 'text'}
  ],
  cols: [
    {key: 'billNumber', title: '账单号'},
    {key: 'orderNumber', title: '运单号'},
    {key: 'customerDelegateCode', title: '客户委托号'},
    {key: 'customerId', title: '结算单位'},
    {key: 'currency', title: '币种'},
    {key: 'amount', title: '金额'},
    {key: 'tax', title: '税率'},
    {key: 'statusType', title: '状态', dictionary: name.STATUS_TYPE}
  ],
  okText: '申请',
  pageSize,
  pageSizeType,
  description,
  searchConfig
};

const tabs = [
  {key: 'index', title: '应收发票申请列表', close: false}
];

const config = {
  activeKey: 'index',
  tabs,
  index,
  editConfig,
  addDialogConfig,
  names: [
    name.STATUS_TYPE,
    name.INVOICE_CATEGORY,
    name.ZERO_ONE,
    name.CHARGE_UNIT,
    name.TAX_RATE_WAY,
    name.BALANCE_CURRENCY
  ]
};

export default config;

