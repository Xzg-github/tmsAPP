import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';

const institutionUrl = `/api/config/corporation/options/corporations`;

const filters = [
  {key: 'tenantInstitutionId', title: '归属法人', type:'search', searchUrl: institutionUrl},
  {key: 'corporateName', title: '公司名称', type: 'text'}
];

const tableCols = [
  {key: 'tenantInstitutionId', title: '归属法人'},
  {key: 'corporateName', title: '公司名称'},
  {key: 'corporateEnglishName', title: '第二名称'},
  {key: 'corporateHeaderInformation', title: '公司抬头'},
  {key: 'enterpriseSignature', title: '企业签章'},
  {key: 'taxRegistrationNumber', title: '税务登记号'},
  {key: 'businessRegistrationNumber', title: '工商登记号'},
  {key: 'corporateBillName', title: '账户资料名称'},
  {key: 'corporateBillAccounts', title: '账户资料备注'},
  {key: 'insertUser', title: '创建人'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateUser', title: '修改人'},
  {key: 'updateTime', title: '修改时间'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'del', title: '删除', confirm: '是否确认删除所有勾选的记录'},
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
  {key: 'corporateName', title: '公司名称', type: 'text', required: true},
  {key: 'corporateEnglishName', title: '英文名称', type: 'text'},
  {key: 'enterpriseSignature', title: '企业签章', type: 'text', required: true},
  {key: 'taxRegistrationNumber', title: '税务登记号', type: 'text', required: true},
  {key: 'businessRegistrationNumber', title: '工商登记号', type: 'text', required: true},
  {key: 'phone', title: '联系电话', type: 'text'},
  {key: 'address', title: '联系地址', type: 'text'},
  {key: 'corporateHeaderInformation', title: '公司抬头', type: 'textArea', span: 2, required: true},
  {key: 'corporateBillName', title: '账户资料名称', type: 'textArea', span: 2},
  {key: 'corporateBillAccounts', title: '账户资料备注', type: 'textArea', span: 2},
  {key: 'billHeaderInformation', title: '账单页头', type: 'textArea', span: 2},
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
