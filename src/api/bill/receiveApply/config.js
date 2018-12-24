import {pageSize, pageSizeType, description, searchConfig} from "../../globalConfig";
import name from '../../dictionary/name';

const filters = [
  {key: 'orderNumber', title: '运单号', type: 'text'},
  {key: 'customerDelegateCode', title: '客户委托号', type: 'text'},
  {key: 'customerId', title: '结算单位', type: 'search', searchType: 'customer_all'},
  {key: 'receivableInvoiceNumber', title: '发票号', type: 'text'},
  {key: 'billNumber', title: '账单号', type: 'text'},
  {key: 'receivableInvoiceSysnumber', title: '发票申请号', type: 'text'},
  {key: 'receivableInvoiceCode', title: '发票代码', type: 'text'},
  {key: 'invoiceTimeFrom', title: '发票日期', type: 'date'},
  {key: 'invoiceTimeTo', title: '至', type: 'date'},
  {key: 'invoiceHeaderInformation', title: '发票抬头', type: 'text'},
  {key: 'statusType', title: '状态', type: 'select', dictionary: name.STATUS_TYPE},
  {key: 'invoiceCategory', title: '发票种类', type: 'select', dictionary: name.INVOICE_CATEGORY},
  {key: 'settlementPersonnel', title: '财务人员', type: 'search', searchType: 'user'},
  {key: 'insertTimeFrom', title: '创建时间', type: 'date'},
  {key: 'insertTimeTo', title: '至', type: 'date'},
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
  {key: 'receivableInvoiceSysnumber', title: '发票申请号', link: true},
  {key: 'statusType', title: '状态', dictionary: name.STATUS_TYPE},
  {key: 'orderNumber', title: '运单号'},
  {key: 'customerDelegateCode', title: '客户委托号'},
  {key: 'receivableInvoiceNumber', title: '发票号'},
  {key: 'receivableInvoiceCode', title: '发票代码'},
  {key: 'invoiceTime', title: '开票日期'},
  {key: 'billNumber', title: '账单号'},
  {key: 'invoiceCategory', title: '发票种类', type: 'select', dictionary: name.INVOICE_CATEGORY},
  {key: 'taxRegistrationNumber', title: '税务登记号'},
  {key: 'businessRegistrationNumber ', title: '工商注册号'},
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
  {value: 0, title: '汇总'},
  {value: 1, title: '明细'}
];

const baseInfo = [
  {key: 'receivableInvoiceNumber', title: '发票号', type: 'readonly'},
  {key: 'receivableInvoiceCode', title: '发票代码', type: 'readonly'},
  {key: 'invoiceTime', title: '开票日期', type: 'readonly'},
  {key: 'billNumber', title: '账单号', type: 'readonly'},
  {key: 'invoiceShowMode', title: '发票显示方式', type: 'select', options: invoiceShowModeOptions},
  {key: 'invoiceCategory', title: '发票种类', type: 'select', dictionary: name.INVOICE_CATEGORY},
  {key: 'institutionId', title: '法人主体（结算区域）', type: 'readonly'},
  {key: 'receivableOpeningBank', title: '法人开户行', type: 'search'},
  {key: 'receivableAccountNumber', title: '法人银行账号', type: 'text'},
  {key: 'enterpriseSignature', title: '企业签章', type: 'readonly'},
  {key: 'taxRegistrationNumber', title: '税务登记号', type: 'readonly'},
  {key: 'businessRegistrationNumber ', title: '工商注册号', type: 'readonly'}
];

const goodsInfo = [
  {key: 'customerId ', title: '结算单位', type: 'readonly'},
  {key: 'invoiceHeaderInformation ', title: '发票抬头', type: 'search'},
  {key: 'taxpayerIdentificationNumber ', title: '纳税人识别号', type: 'readonly'},
  {key: 'addressPhone', title: '地址', type: 'readonly'},
  {key: 'openingBank', title: '开户行', type: 'readonly'},
  {key: 'accountNumber', title: '银行账号', type: 'readonly'},
  {key: 'isPost', title: '是否寄发票', type: 'readonly', dictionary: name.ZERO_ONE},
  {key: 'postAddress', title: '寄送地址', type: 'readonly'},
  {key: 'isThirdPartyAgreement', title: '是否第三方协议', type: 'readonly', dictionary: name.ZERO_ONE},
  {key: 'remark', title: '备注', type: 'readonly'}
];

const controls = [
  {key: 'baseInfo', title: '基本信息', data: baseInfo},
  {key: 'goodsInfo', title: '货物信息', data: goodsInfo}
];

const invoiceInfo = {
  title: '发票内容',
  cols: [
    {key: 'tax', title: '税率', type: 'readonly'},
    {key: 'taxAmount', title: '税额', type: 'readonly'},
    {key: 'netAmount', title: '净额', type: 'readonly'},
    {key: 'goodsName', title: '货物名称', type: 'text'},
    {key: 'chargeName', title: '费用项', type: 'text'},
    {key: 'price', title: '单价', type: 'number', props: {real: true, precision: 2}},
    {key: 'itemCount', title: '数量', type: 'number'},
    {key: 'exchange_currency', title: '折合币种（开票币种）', type: 'readonly'},
    {key: 'exchange_amount', title: '折算金额', type: 'readonly'},
    {key: 'currency', title: '折算币种（金额合计币种）', type: 'readonly'},
    {key: 'amountCapital', title: '大写金额', type: 'readonly'},
    {key: 'amount', title: '发票金额（合计）', type: 'readonly'}
  ]
};

const costInfoConfig = {
  title: '费用信息',
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
    {key: 'amount', title: '费用金额'},
    {key: 'tax', title: '税率'},
    {key: 'taxRateWay', title: '计税方式', dictionary: name.TAX_RATE_WAY},
    {key: 'taxAmount', title: '税额'},
    {key: 'netAmount', title: '净价'},
    {key: 'reamark', title: '备注'}
  ],
  joinDialogConfig: {
    title: '可加入费用信息',
    filters: [
      {key: 'billNumber', title: '账单号', type: 'text'},
      {key: 'orderNumber', title: '运单号', type: 'text'},
    ],
    tableTitle: '账单信息',
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
  }
};

const editConfig = {
  controls,
  invoiceInfo,
  costInfoConfig,
  footerButtons: [
    {key: 'close', title: '关闭'},
    {key: 'save', title: '保存'},
    {key: 'commit', title: '提交', bsStyle: 'primary'}
  ]
};

const addDialogConfig = {
  title: '发票申请',
  filters: [
    {key: 'orderNumber', title: '运单号', type: 'text'},
    {key: 'customerDelegateCode', title: '客户委托号', type: 'text'},
    {key: 'customerId', title: '结算单位', type: 'search', searchType: 'customer_all', required: true},
    {key: 'billNumber', title: '账单号', type: 'text'},
    {key: 'tax', title: '税率', type: 'number', required: true}
  ],
  tableTitle: '账单信息',
  cols: [
    {key: 'billNumber', title: '账单号'},
    {key: 'orderNumber', title: '运单号'},
    {key: 'customerDelegateCode', title: '客户委托号'},
    {key: 'customerId', title: '结算单位'},
    {key: 'currency', title: '币种'},
    {key: 'amount', title: '金额'},
    {key: 'tax', title: '税率'},
    {key: 'statusType', title: '状态'}
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
    name.STATUS_TYPE, name.INVOICE_CATEGORY, name.ZERO_ONE, name.CHARGE_UNIT, name.TAX_RATE_WAY
  ]
};

export default config;
