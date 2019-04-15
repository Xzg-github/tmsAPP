import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'supplierCode', title: '供应商编码', type: 'text'},
  {key: 'supplierType', title: '供应商类型', type: 'select', dictionary: name.SUPPLIER_TYPE},
  {key: 'companyLevel', title: '供应商级别', type: 'select', dictionary: name.COMPANY_LEVEL},
  {key: 'supplierName', title: '供应商名称', type: 'text'},
  {key: 'thirdPartyCode', title: '第三方系统编码', type: 'text'},
  {key: 'shortName', title: '供应商简称', type: 'text'},
  {key: 'englishName', title: '英文名称', type: 'text'},
  {key: 'purchasePersonId', title: '采购人员', type: 'search'},
  {key: 'enabledType', title: '状态', type: 'select', dictionary: name.ENABLED_TYPE},
  {key: 'settlementPersonnel', title: '财务人员', type: 'search'}
];

const buttons = [
  {key: 'suppliersArchives_add', title: '新增', bsStyle: 'primary'},
  {key: 'suppliersArchives_edit', title: '编辑'},
  {key: 'suppliersArchives_enable', title: '启用'},
  {key: 'suppliersArchives_disable', title: '禁用'},
  {key: 'suppliersArchives_delete', title: '删除', confirm: '确认删除?'},
  {key: 'suppliersArchives_import', title: '导入'},
  {key: 'suppliersArchives_export', title: '导出', menu:[
    { key: 'suppliersArchives_exportSearch', title: '查询导出'},
    { key: 'suppliersArchives_exportPage', title: '页面导出'},
  ]},
  {key: 'suppliersArchives_finance', title: '设置财务人员'},
  {key: 'suppliersArchives_config', title: '配置字段'}
];

const tableCols = [
  {key: 'enabledType', title: '状态', type: 'select', dictionary: name.ENABLED_TYPE},
  {key: 'supplierCode', title: '供应商编码'},
  {key: 'supplierName', title: '供应商名称'},
  {key: 'shortName', title: '供应商简称'},
  {key: 'englishName', title: '英文名称'},
  {key: 'telephone', title: '电话'},
  {key: 'purchasePersonId', title: '采购人员', type: 'search'},
  {key: 'settlementPersonnel', title: '财务人员'},
  {key: 'isContract', title: '是否签订合同', type: 'radio', dictionary: name.YES_OR_NO},
  {key: 'contractStartTime', title: '合同开始日期', type: 'date'},
  {key: 'contractEndTime', title: '合同结束日期', type: 'date'},
  {key: 'supplierType', title: '供应商类型', type: 'select', dictionary: name.SUPPLIER_TYPE},
  {key: 'companyLevel', title: '供应商级别', type: 'select',dictionary: name.COMPANY_LEVEL},
  {key: 'insertUser', title: '操作人'},
  {key: 'insertTime', title: '操作时间', type: 'date'}
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
  {key: 'supplierCode', title: '供应商编码', type: 'readonly'},
  {key: 'supplierName', title: '供应商名称', type: 'text', required: true},
  {key: 'shortName', title: '供应商简称', type: 'text'},
  {key: 'englishName', title: '英文名称', type: 'text'},
  {key: 'headerInformation', title: '抬头信息', type: 'text'},
  {key: 'telephone', title: '电话', type: 'text'},
  {key: 'fax', title: '传真', type: 'text'},
  {key: 'creditCode', title: '公司信用代码', type: 'text'},
  {key: 'thirdPartyCode', title: '第三方系统编码', type: 'text'},
  {key: 'country', title: '国家', type: 'search', props: {noSearchWhenTypo: true}},
  {key: 'province', title: '省份', type: 'search', props: {noSearchWhenTypo: true}},
  {key: 'city', title: '城市', type: 'search', props: {noSearchWhenTypo: true}},
  {key: 'district', title: '行政区', type: 'search', props: {noSearchWhenTypo: true}},
  {key: 'street', title: '街道', type: 'search', props: {noSearchWhenTypo: true}},
  {key: 'address', title: '详细地址', type: 'text', span: 2},
  {key: 'longitude', title: '经度', type: 'readonly'},
  {key: 'latitude', title: '纬度', type: 'readonly'},
  {key: 'institutionId', title: '归属法人', type: 'search', required: true}
];

const cooperationInfo = [
  {key: 'supplierType', title: '供应商类型', type: 'select', dictionary: name.SUPPLIER_TYPE,required:true},
  {key: 'companyLevel', title: '供应商级别', type: 'select', dictionary: name.COMPANY_LEVEL, required: true},
  {key: 'isContract', title: '是否签订合同', type: 'radioGroup', dictionary: name.YES_OR_NO},
  {key: 'contractStartTime', title: '合同生效日期', type: 'date', rule: {type: '<', key: 'contractEndTime'}},
  {key: 'contractEndTime', title: '合同终止日期', type: 'date', rule: {type: '>', key: 'contractStartTime'}},
  {key: 'purchasePersonId', title: '采购人员', type: 'search'},
  {key: 'balanceCurrency', title: '结算币种', type: 'search', required: true},
  {key: 'balanceWay', title: '结算方式', type: 'select', dictionary: name.BALANCE_WAY},
  {key: 'creditDays', title: '结算天数', type: 'number'},
  {key: 'creditMoney', title: '信用额度', type: 'number'},
  {key: 'taxType', title: '计税方式', type: 'select', dictionary: name.TAX_TYPE},
  {key: 'tax', title: '税率', type: 'select', dictionary: 'supplier_tax_type'},
];

const controls = [
  {key: 'baseInfo', title: '基本信息', data: baseInfo},
  {key: 'cooperationInfo', title: '合作信息', data: cooperationInfo}
];


const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  size: 'large',
  config: {ok: '确定', cancel: '取消'}
};

//设置财务人员Config
const finance = {
  controls: [{key: 'settlementPersonnel', title: '财务人员', type: 'search', required: true}],
  size: 'small',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  edit,
  index,
  finance,
  names: [
    name.BALANCE_WAY, name.YES_OR_NO,name.CUSTOMER_TYPE, name.TAX_TYPE,
    name.ENABLED_TYPE, name.COMPANY_TYPE, name.COMPANY_LEVEL,name.SUPPLIER_TYPE, 'supplier_tax_type'
  ]
};

export default config;
