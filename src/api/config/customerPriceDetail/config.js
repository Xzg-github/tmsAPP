import name from '../../../api/dictionary/name';
import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';

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

const priceTypeOptions = [
  {title: '金额', value: '1'},
  {title: '运费比例', value: '2'},
];

const filters = [
  {key: 'customerPriceCode', title: '系统编号', type: 'text'},
  {key: 'customerId', title: '客户', type: 'search'},
  {key: 'departure', title: '始发地', type: 'search'},
  {key: 'destination', title: '目的地', type: 'search'},
  {key: 'consignorId', title: '发货人', type: 'search'},
  {key: 'consigneeId', title: '收货人', type: 'search'},
  {key: 'isReturn', title: '是否返程', type: 'select', dictionary: name.ZERO_ONE_TYPE},
  {key: 'carModeId', title: '车型', type: 'search'},
  {key: 'fuelType', title: '燃油种类', type: 'select', dictionary: name.FUEL_TYPE},
  {key: 'enabledType', title: '报价状态', type: 'select', dictionary: name.ENABLED_TYPE},
  {key: 'contractCode', title: '客户合同', type: 'text'},
  {key: 'statusType', title: '合同状态', type: 'select', dictionary: 'status_type'},
  {key: 'startTimeFrom', title: '合同开始日期', type: 'date'},
  {key: 'startTimeTo', title: '至', type: 'date'},
  {key: 'endTimeFrom', title: '合同结束日期', type: 'date'},
  {key: 'endTimeTo', title: '至', type: 'date'},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'customerPriceDetail_add'},
  {key: 'copy', title: '复制新增', sign: 'customerPriceDetail_copy'},
  {key: 'edit', title: '编辑', sign: 'customerPriceDetail_edit'},
  {key: 'batchEdit', title: '批量修改', sign: 'customerPriceDetail_batchEdit'},
  {key: 'delete', title: '删除', confirm: '是否确定删除所选数据？', sign: 'customerPriceDetail_delete'},
  {key: 'enable', title: '启用', sign: 'customerPriceDetail_enable'},
  {key: 'disable', title: '禁用', sign: 'customerPriceDetail_disable'},
  {key: 'import', title: '导入', sign: 'customerPriceDetail_import'},
  {key: 'export', title: '导出', sign: 'customerPriceDetail_export'},
  {key: 'config', title: '配置字段', sign: 'customerPriceDetail_config'},
];

const tableCols = [
  {key: 'customerPriceCode', title: '系统编号'},
  {key: 'customerId', title: '客户'},
  {key: 'enabledType', title: '报价状态', dictionary: name.ENABLED_TYPE},
  {key: 'businessType', title: '运输类型', dictionary: name.BUSINESS_TYPE},
  {key: 'departure', title: '起运地', options: departureOptions},
  {key: 'departureType', title: '起发地类别', options: businessTypeOptions},
  {key: 'destination', title: '目的地', options: destinationTypeOptions},
  {key: 'destinationType', title: '目的地类别', options: destinationTypeOptions},
  {key: 'carModeId', title: '车型'},
  {key: 'chargeItemId', title: '费用项', required: true},
  {key: 'price', title: '价格', required: true},
  {key: 'priceType', title: '价格类别', options: priceTypeOptions, required: true},
  {key: 'chargeUnit', title: '计量单位', dictionary: name.CHARGE_UNIT},
  {key: 'numberSource', title: '数量源', dictionary: name.NUMBER_SOURCE},
  {key: 'remark', title: '备注'},
  {key: 'contractCode', title: '客户合同'},
  {key: 'balanceCompany', title: '结算单位'},
  {key: 'startTime', title: '有效开始日期'},
  {key: 'endTime', title: '有效结束日期'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'insertUser', title: '创建人员'},
  {key: 'updateTime', title: '更新时间'},
  {key: 'updateUser', title: '更新人员'},
];

const freightControls = [
  {key: 'customerId', title: '客户', type: 'search', required: true},
  {key: 'contractNumber', title: '客户合同', type: 'search'},
  {key: 'departureType', title: '起发地类别', type: 'select', required: true, options: businessTypeOptions},
  {key: 'departure', title: '起运地', type: 'search', required: true},
  {key: 'destinationType', title: '目的地类别', type: 'select', required: true, options: destinationTypeOptions},
  {key: 'destination', title: '目的地', type: 'search', required: true},
  {key: 'businessType', title: '运输类型', type: 'select', dictionary: name.BUSINESS_TYPE},
  {key: 'isReturn', title: '是否返程', type: 'select', dictionary: name.ZERO_ONE_TYPE},
  {key: 'carModeId', title: '车型', type: 'search'},
  {key: 'fuelType', title: '燃油种类', type: 'select', dictionary: name.FUEL_TYPE},
  {key: 'standardPrice', title: '基本运费', type: 'text', required: true},
  {key: 'returnPrice', title: '返空费', type: 'text'},
  {key: 'chargeUnit', title: '计量单位', type: 'select', dictionary: name.CHARGE_UNIT, required: true},
  {key: 'numberSource', title: '数量源', type: 'select', dictionary: name.NUMBER_SOURCE, required: true},
  {key: 'hours', title: '时效（小时）', type: 'number'},
  {key: 'kilometre', title: '公里数（KM）', type: 'number', props: {real: true, precision: 2}},
  {key: 'remark', title: '备注', type: 'text'},
];

const extraChargeControls = [
  {key: 'customerId', title: '客户', type: 'search', required: true},
  {key: 'contractNumber', title: '客户合同', type: 'search'},
  {key: 'departureType', title: '起发地类别', type: 'select', required: true, options: businessTypeOptions},
  {key: 'departure', title: '起运地', type: 'search', required: true},
  {key: 'destinationType', title: '目的地类别', type: 'select', required: true, options: destinationTypeOptions},
  {key: 'destination', title: '目的地', type: 'search', required: true},
  {key: 'businessType', title: '运输类型', type: 'select', dictionary: name.BUSINESS_TYPE},
  {key: 'carModeId', title: '车型', type: 'search'},
  {key: 'chargeItemId', title: '费用项', type: 'search', required: true},
  {key: 'price', title: '价格', type: 'number', required: true},
  {key: 'priceType', title: '价格类别', type: 'select', options: priceTypeOptions, required: true},
  {key: 'chargeUnit', title: '计量单位', type: 'select', dictionary: name.CHARGE_UNIT, required: true},
  {key: 'numberSource', title: '数量源', type: 'select', dictionary: name.NUMBER_SOURCE, required: true},
  {key: 'remark', title: '备注', type: 'text'},
];

const freightBatchEditControls = [
  {key: 'standardPrice', title: '基本运费', type: 'text'},
  {key: 'returnPrice', title: '返空费', type: 'text'},
  {key: 'currency', title: '币种', type: 'search'},
  {key: 'chargeUnit', title: '计量单位', type: 'select', dictionary: name.CHARGE_UNIT},
  {key: 'numberSource', title: '数量源', type: 'select', dictionary: name.NUMBER_SOURCE},
];

const ExtraChargeatchEditControls = [
  {key: 'standardPrice', title: '基本运费', type: 'text'},
  {key: 'returnPrice', title: '返空费', type: 'text'},
  {key: 'currency', title: '币种', type: 'search'},
  {key: 'chargeUnit', title: '计量单位', type: 'select', dictionary: name.CHARGE_UNIT},
  {key: 'numberSource', title: '数量源', type: 'select', dictionary: name.NUMBER_SOURCE},
];

const index = {
  filters,
  buttons,
  tableCols,
  searchConfig,
  pageSize,
  pageSizeType,
  description,
  controls: freightControls,
  batchEditControls: freightBatchEditControls,
};

const editConfig = {
  filters,
  buttons,
  tableCols,
  searchConfig,
  pageSize,
  pageSizeType,
  description,
  controls: extraChargeControls,
  batchEditControls: ExtraChargeatchEditControls
};

const tabs = [
  {key: 'index', title: '客户运费列表', close: false},
  {key: 'extraCharge', title: '客户附加费列表', close: false}
];

const config = {
  activeKey: 'index',
  tabs,
  index,
  editConfig,
  names: [
    name.ZERO_ONE_TYPE, name.BUSINESS_TYPE, name.FUEL_TYPE, name.CHARGE_UNIT, name.NUMBER_SOURCE, name.ENABLED_TYPE, name.FUEL_TYPE
  ]
};

export default config;
