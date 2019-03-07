import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'customerName', title: '客户名称', type: 'text'},
  {key: 'customerCode', title: '客户编码', type: 'text'},
  {key: 'companyType', title: '客户类型', type: 'select', dictionary: name.COMPANY_TYPE},
  {key: 'enabledType', title: '状态', type: 'select', dictionary: name.ENABLED_TYPE},
  {key: 'thirdPartyCode', title: '第三方系统编码', type: 'text'},
  {key: 'shortName', title: '客户简称', type: 'text'},
  {key: 'englishName', title: '英文名称', type: 'text'},
  {key: 'salesPersonId', title: '销售人员', type: 'search'},
  {key: 'companyLevel', title: '客户级别', type: 'select', dictionary: name.COMPANY_LEVEL},
  {key: 'settlementPersonnel', title: '财务人员', type: 'search'}
];

const buttons = [
  {key: 'customersArchives_add', title: '新增', bsStyle: 'primary'},
  {key: 'customersArchives_edit', title: '编辑'},
  {key: 'customersArchives_enable', title: '启用'},
  {key: 'customersArchives_disable', title: '禁用'},
  {key: 'customersArchives_delete', title: '删除', confirm: '确认删除?'},
  {key: 'customersArchives_import', title: '导入'},
  {key: 'customersArchives_export', title: '导出', menu:[
    { key: 'suppliersArchives_exportSearch', title: '查询导出'},
    { key: 'suppliersArchives_exportPage', title: '页面导出'},
  ]},
  {key: 'customersArchives_finance', title: '设置财务人员'},
  {key: 'customersArchives_config', title: '配置字段'}
];

const tableCols = [
  {key: 'enabledType', title: '状态', type: 'select', dictionary: name.ENABLED_TYPE},
  {key: 'customerCode', title: '客户编码'},
  {key: 'customerName', title: '客户名称'},
  {key: 'shortName', title: '客户简称'},
  {key: 'telephone', title: '电话'},
  {key: 'salesPersonId', title: '销售人员', type: 'search'},
  {key: 'settlementPersonnel', title: '财务人员'},
  {key: 'isContract', title: '是否签订合同', type: 'radio', dictionary: name.YES_OR_NO},
  {key: 'contractStartTime', title: '合同开始日期', type: 'date'},
  {key: 'contractEndTime', title: '合同结束日期', type: 'date'},
  {key: 'companyType', title: '客户类型', type: 'select', dictionary: name.COMPANY_TYPE},
  {key: 'companyLevel', title: '客户级别', type: 'select',dictionary: name.COMPANY_LEVEL},
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
  {key: 'customerCode', title: '客户编码', type: 'readonly'},
  {key: 'customerName', title: '客户名称', type: 'text', required: true},
  {key: 'shortName', title: '客户简称', type: 'text'},
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
  {key: 'companyType', title: '客户类型', type: 'select', dictionary: name.COMPANY_TYPE, required: true},
  {key: 'companyLevel', title: '客户级别', type: 'select', dictionary: name.COMPANY_LEVEL},
  {key: 'isContract', title: '是否签订合同', type: 'radioGroup', dictionary: name.YES_OR_NO},
  {key: 'contractStartTime', title: '合同生效日期', type: 'date', rule: {type: '<', key: 'contractEndTime'}},
  {key: 'contractEndTime', title: '合同终止日期', type: 'date', rule: {type: '>', key: 'contractStartTime'}},
  {key: 'salesPersonId', title: '销售人员', type: 'search'},
  {key: 'balanceCurrency', title: '结算币种', type: 'search', required: true},
  {key: 'balanceWay', title: '结算方式', type: 'select', dictionary: name.BALANCE_WAY},
  {key: 'creditDays', title: '结算天数', type: 'number'},
  {key: 'creditMoney', title: '信用额度', type: 'number'},
  {key: 'checkAccountDeadlineTime', title: '对账时间', type: 'text', props: {placeholder: '文本输入,例如：每月25号'}},
  {key: 'paymentTime', title: '付款时间', type: 'date' },
  {key: 'taxType', title: '计税方式', type: 'select', dictionary: name.TAX_TYPE},
  {key: 'tax', title: '税率', type: 'number', props: {precision: 2}},
];

const controls = [
  {key: 'baseInfo', title: '基本信息', data: baseInfo},
  {key: 'cooperationInfo', title: '合作信息', data: cooperationInfo}
];

//设置财务人员Config
const finance = {
  controls: [{key: 'settlementPersonnel', title: '财务人员', type: 'search', required: true}],
  size: 'small',
  config: {ok: '确定', cancel: '取消'}
};

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  size: 'large',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  edit,
  index,
  finance,
  names: [ name.BALANCE_WAY, name.YES_OR_NO, name.TAX_TYPE,
    name.ENABLED_TYPE, name.COMPANY_TYPE, name.COMPANY_LEVEL
  ]
};

export default config;
