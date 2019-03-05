import name from '../../../api/dictionary/name';
import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';

const filters = [
  {key: 'customerPriceCode', title: '系统编号', type: 'text'},
  {key: 'customerId', title: '客户', type: 'search'},
  {key: 'contractCode', title: '合同号', type: 'text'},
  {key: 'balanceCompany', title: '结算单位', type: 'search'},
  {key: 'lockStatus', title: '是否锁定', type: 'select', dictionary: name.ZERO_ONE_TYPE},
  {key: 'statusType', title: '状态', type: 'select', dictionary: 'status_type'},
  {key: 'insertUser', title: '创建用户', type: 'search'},
  {key: 'startTimeFrom', title: '有效开始日期', type: 'date'},
  {key: 'startTimeTo', title: '至', type: 'date'},
  {key: 'endTimeFrom', title: '有效结束日期', type: 'date'},
  {key: 'endTimeTo', title: '至', type: 'date'},
  {key: 'insertTimeFrom', title: '创建日期', type: 'date'},
  {key: 'insertTimeTo', title: '至', type: 'date'},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'customerPrice_add'},
  {key: 'copy', title: '复制新增', sign: 'customerPrice_copy'},
  {key: 'edit', title: '编辑', sign: 'customerPrice_edit'},
  {key: 'delete', title: '删除', sign: 'customerPrice_delete'},
  {key: 'enable', title: '启用', sign: 'customerPrice_enable'},
  {key: 'disable', title: '禁用', sign: 'customerPrice_disable'},
  {key: 'import', title: '导入', sign: 'customerPrice_import'},
  {key: 'export', title: '导出', sign: 'customerPrice_export'},
];

const tableCols = [
  {key: 'customerPriceCode', title: '系统编号'},
  {key: 'customerId', title: '客户'},
  {key: 'contractCode', title: '合同号'},
  {key: 'balanceCompany', title: '结算单位'},
  {key: 'startTime', title: '有效开始日期'},
  {key: 'endTime', title: '有效结束日期'},
  {key: 'fileList', title: '附件', link: 'list', linkTitleKey: 'fileName'},
  {key: 'remark', title: '备注'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'insertUser', title: '创建人员'},
  {key: 'insertInstitution', title: '创建机构'},
  {key: 'updateTime', title: '更新时间'},
  {key: 'updateUser', title: '更新人员'},
  {key: 'lockStatus', title: '是否锁定', dictionary: name.ZERO_ONE_TYPE},
  {key: 'statusType', title: '状态', dictionary: 'status_type'},
];

const index = {
  filters,
  buttons,
  tableCols,
  searchConfig,
  searchData: {},
  tableItems: [],
  currentPage: 1,
  returnTotalItems: 0,
  pageSize,
  pageSizeType,
  description
};

const tabs2 = [
  {key: 'contract', title: '合同信息', showIn: [0, 1, 2]},
  {key: 'freight', title: '运费', showIn: [2]},
  {key: 'extraCharge', title: '附加费', showIn: [2]},
];

const contract = {
  controls: [
    {key: 'customerId', title: '客户', type: 'search', required: true},
    {key: 'contractNumber', title: '合同号', type: 'text'},
    {key: 'startTime', title: '有效开始日期', type: 'date', required: true, rule: {type: '<', key: 'endTime'}},
    {key: 'endTime', title: '有效结束日期', type: 'date', required: true, rule: {type: '>', key: 'startTime'}},
    {key: 'balanceCompany', title: '结算单位', type: 'search'},
    {key: 'remark', title: '备注', type: 'textArea', props: {span: 2}},
  ],
  uploadText: '上传文档：（单个文件大小限制在5M以内，上传个数不能超过10个，若大于10个请压缩后上传）',
};

const businessTypeOptions = [
  {title: '始发地', value: '1'},
  {title: '发货人', value: '2'},
];

const departureOptions = [
  {title: '来自行政区域档案', value: '1'},
  {title: '来自于合同客户', value: '2'},
];

const destinationTypeOptions = [
  {title: '目的地', value: '1'},
  {title: '收货人', value: '2'},
];

const freight = {
  buttons: [
    {key: 'add', title: '新增', bsStyle: 'primary'},
    {key: 'copy', title: '复制新增'},
    {key: 'edit', title: '编辑'},
    {key: 'batchEdit', title: '批量修改'},
    {key: 'delete', title: '删除'},
    {key: 'enable', title: '启用'},
    {key: 'disable', title: '禁用'},
    {key: 'import', title: '导入'},
    {key: 'export', title: '导出'},
    {key: 'refresh', title: '刷新'},
  ],
  cols: [
    {key: 'customerPriceId', title: '客户报价标识'},
    {key: 'businessType', title: '运输类型', dictionary: name.BUSINESS_TYPE},
    {key: 'departureType', title: '起发地类别', options: businessTypeOptions},
    {key: 'departure', title: '起运地', options: departureOptions},
    {key: 'destinationType', title: '目的地类别', options: destinationTypeOptions},
    {key: 'destination', title: '目的地', options: destinationTypeOptions},
    {key: 'isReturn', title: '是否返程', dictionary: name.ZERO_ONE_TYPE},
    {key: 'carModeId', title: '车型'},
    {key: 'fuelType', title: '燃油种类', dictionary: name.FUEL_TYPE},
    {key: 'standardPrice', title: '基本运费'},
    {key: 'returnPrice', title: '返空费'},
    {key: 'chargeUnit', title: '计量单位', dictionary: name.CHARGE_UNIT},
    {key: 'numberSource', title: '数量源', dictionary: name.NUMBER_SOURCE},
    {key: 'hours', title: '时效（小时）'},
    {key: 'kilometre', title: '公里数（KM）'},
    {key: 'remark', title: '备注'},
    {key: 'statusType', title: '状态', dictionary: 'status_type'},
    {key: 'insertTime', title: '创建时间'},
    {key: 'insertUser', title: '创建人员'},
    {key: 'updateTime', title: '更新时间'},
    {key: 'updateUser', title: '更新人员'},
  ],
  items: [{customerPriceId: 11},{customerPriceId: 22}],
  controls: [
    // {key: 'departureType', title: '起发地类别', type: 'select', required: true, options: businessTypeOptions},
    // {key: 'departure', title: '起运地', type: 'select', required: true, options: departureOptions},
    // {key: 'destinationType', title: '目的地类别', type: 'select', required: true, options: destinationTypeOptions},
    // {key: 'destination', title: '目的地', type: 'select', required: true, options: destinationTypeOptions},
    // {key: 'businessType', title: '运输类型', type: 'select', dictionary: name.BUSINESS_TYPE},
    // {key: 'isReturn', title: '是否返程', type: 'select', dictionary: name.ZERO_ONE_TYPE},
    // {key: 'carModeId', title: '车型', type: 'search'},
    // {key: 'fuelType', title: '燃油种类', type: 'select', dictionary: name.FUEL_TYPE},
    // {key: 'standardPrice', title: '基本运费', type: 'text', required: true},
    // {key: 'returnPrice', title: '返空费', type: 'search', required: true},
    // {key: 'chargeUnit', title: '计量单位', type: 'search', dictionary: name.CHARGE_UNIT, required: true},
    // {key: 'numberSource', title: '数量源', type: 'search', dictionary: name.NUMBER_SOURCE, required: true},
    // {key: 'hours', title: '时效（小时）', type: 'number'},
    // {key: 'kilometre', title: '公里数（KM）', type: 'number'},
    // {key: 'remark', title: '备注', type: 'text'},
  ],
  currentPage: 1,
  returnTotalItems: 0,
  pageSize,
  pageSizeType,
  description
};

const extraCharge = {
  buttons: [
    {key: 'add', title: '新增'},
    {key: 'copy', title: '复制新增'},
    {key: 'delete', title: '删除'},
    {key: 'edit', title: '编辑'},
    {key: 'enable', title: '启用'},
    {key: 'disable', title: '禁用'},
    {key: 'import', title: '导入'},
    {key: 'export', title: '导出'},
    {key: 'refresh', title: '刷新'},
  ],
  cols: [
    {key: 'customerPriceId', title: '客户报价标识'},
    {key: 'businessType', title: '运输类型', dictionary: name.BUSINESS_TYPE},
    {key: 'departure', title: '起运地', options: departureOptions},
    {key: 'departureType', title: '起发地类别', options: businessTypeOptions},
    {key: 'destination', title: '目的地', options: destinationTypeOptions},
    {key: 'destinationType', title: '目的地类别', options: destinationTypeOptions},
    {key: 'carModeId', title: '车型'},
    {key: 'chargeItemId', title: '费用项'},
    {key: 'price', title: '价格'},
    {key: 'priceType', title: '价格类别'},
    {key: 'chargeUnit', title: '计量单位', dictionary: name.CHARGE_UNIT},
    {key: 'numberSource', title: '数量源', dictionary: name.NUMBER_SOURCE},
    {key: 'remark', title: '备注'},
    {key: 'statusType', title: '状态', dictionary: 'status_type'},
    {key: 'insertTime', title: '创建时间'},
    {key: 'insertUser', title: '创建人员'},
    {key: 'updateTime', title: '更新时间'},
    {key: 'updateUser', title: '更新人员'},
  ],
  items: [{customerPriceId: 1},{customerPriceId: 2}],
  controls: [
    // {key: 'departureType', title: '起发地类别', type: 'select', required: true, options: businessTypeOptions},
    // {key: 'departure', title: '起运地', type: 'select', required: true, options: departureOptions},
    // {key: 'destinationType', title: '目的地类别', type: 'select', required: true, options: destinationTypeOptions},
    // {key: 'destination', title: '目的地', type: 'select', required: true, options: destinationTypeOptions},
    // {key: 'businessType', title: '运输类型', type: 'select', dictionary: name.BUSINESS_TYPE},
    // {key: 'isReturn', title: '是否返程', type: 'select', dictionary: name.ZERO_ONE_TYPE},
    // {key: 'carModeId', title: '车型', type: 'search'},
    // {key: 'fuelType', title: '燃油种类', type: 'select', dictionary: name.FUEL_TYPE},
    // {key: 'standardPrice', title: '基本运费', type: 'text', required: true},
    // {key: 'returnPrice', title: '返空费', type: 'search', required: true},
    // {key: 'chargeUnit', title: '计量单位', type: 'search', dictionary: name.CHARGE_UNIT, required: true},
    // {key: 'numberSource', title: '数量源', type: 'search', dictionary: name.NUMBER_SOURCE, required: true},
    // {key: 'hours', title: '时效（小时）', type: 'number'},
    // {key: 'kilometre', title: '公里数（KM）', type: 'number'},
    // {key: 'remark', title: '备注', type: 'text'},
  ],
  currentPage: 1,
  returnTotalItems: 0,
  pageSize,
  pageSizeType,
  description
};

const editConfig = {
  activeKey: 'contract',
  tabs: tabs2,
  contract,
  freight,
  extraCharge,
  footerBtns: [
    {key: 'save', title: '保存'},
    {key: 'commit', title: '提交'},
  ]
};

const config = {
  activeKey: 'index',
  tabs: [{key: 'index', title: '客户报价列表'}],
  index,
  editConfig,
  names: [
    name.ZERO_ONE_TYPE, name.BUSINESS_TYPE, name.FUEL_TYPE, name.CHARGE_UNIT, name.NUMBER_SOURCE
  ]
};

export default config;
