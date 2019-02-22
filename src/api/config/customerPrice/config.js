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
  {key: 'import', title: '导入', sign: 'customerPrice_import'},
  {key: 'other', title: '其他', sign: 'customerPrice_other', menu: [
    {key: 'lock', title: '锁定'},
    {key: 'unlock', title: '解锁'},
    {key: 'disable', title: '禁用'},
  ]},
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

const editConfig = {

};

const config = {
  activeKey: 'index',
  tabs: [{key: 'index', title: '客户报价列表'}],
  index,
  editConfig,
  names: [
    name.ZERO_ONE_TYPE
  ]
};

export default config;
