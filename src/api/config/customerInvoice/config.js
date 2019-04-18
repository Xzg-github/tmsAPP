import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';


const filters = [
  {key: 'customerId', title: '客户', type: 'search', searchType: 'customer'},
  {key: 'invoiceHeaderInformation', title: '发票抬头', type: 'text'}

];

const tableCols = [
  {key: 'customerId', title: '客户'},
  {key: 'invoiceHeaderInformation', title: '发票抬头'},
  {key: 'taxpayerIdentificationNumber', title: '纳税人识别号'},
  {key: 'openingBank', title: '开户银行'},
  {key: 'accountNumber', title: '开户账号'},
  {key: 'addressPhone', title: '地址及电话'},
  {key: 'insertUser', title: '创建人'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateUser', title: '修改人'},
  {key: 'updateTime', title: '修改时间'}
];

const menu = [
  {key:'webExport',title:'页面导出'},
  {key:'allExport',title:'查询导出'},
  {key:'templateManager', title:'模板管理'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'del', title: '删除', confirm: '确认删除选中的记录?'},
  {key: 'export', title: '导出', menu}
];

const index = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig,
  urlExport: '/archiver-service/CustomerInvoiceRequestDto/listByRelationId', //后端查询导出api配置
};

const controls = [
  {key: 'customerId', title: '客户', type: 'search', searchType: 'customer', required: true},
  {key: 'invoiceHeaderInformation', title: '发票抬头', type: 'text'},
  {key: 'taxpayerIdentificationNumber', title: '纳税人识别号', type: 'text'},
  {key: 'openingBank', title: '开户银行', type: 'text'},
  {key: 'accountNumber', title: '开户账号', type: 'number'},
  {key: 'addressPhone', title: '地址及电话', type: 'text'}
];

const editConfig = {
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
    ...index,
  editConfig
};

export default config;

