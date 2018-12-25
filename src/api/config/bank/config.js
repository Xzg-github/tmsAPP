import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';

const institutionUrl = `/api/config/corporation/options/corporations`;
const currencyUrl = `/api/config/bank/options/currency`;

const activeOptions = [
  {value: 1, title: '是'},
  {value: 0, title: '否'}
];

const filters = [
  {key: 'tenantInstitutionId', title: '归属法人', type: 'search', searchUrl: institutionUrl},
  {key: 'accountNumber', title: '银行卡号', type: 'text'}
];

const tableCols = [
  {key: 'tenantInstitutionId', title: '归属法人'},
  {key: 'openingBank', title: '开户行'},
  {key: 'accountNumber', title: '银行卡号'},
  {key: 'currency', title: '账户币种'},
  {key: 'address', title: '银行地址'},
  {key: 'isDefaultInvoice', title: '默认开票银行', options: activeOptions},
  {key: 'isInvoice', title: '用于开票银行', options: activeOptions},
  {key: 'isPayment', title: '默认付款银行', options: activeOptions},
  {key: 'insertUser', title: '创建人'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateUser', title: '修改人'},
  {key: 'updateTime', title: '修改时间'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'del', title: '删除', confirm: '是否确认删除所有勾选的记录'}
];

const index = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig
};

const controls = [
  {key: 'tenantInstitutionId', title: '归属法人', type: 'search', searchUrl: institutionUrl, required: true},
  {key: 'openingBank', title: '开户行', type: 'text'},
  {key: 'accountNumber', title: '银行卡号', type: 'number'},
  {key: 'currency', title: '账户币种', type: 'search', searchUrl: currencyUrl},
  {key: 'address', title: '银行地址', type: 'text'},
  {key: 'isDefaultInvoice', title: '默认开票银行', type:'radioGroup', options: activeOptions},
  {key: 'isInvoice', title: '用于开票银行', type:'radioGroup', options: activeOptions},
  {key: 'isPayment', title: '默认付款银行', type:'radioGroup', options: activeOptions}
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
