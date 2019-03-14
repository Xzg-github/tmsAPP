import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';

const URL_BRANCH = '/api/config/customer_task/options/departments';  // 部门
const filters = [
  {key: 'customerId', title: '客户', type: 'search', searchType: 'customer_all'},
  {key: 'businessType', title: '运输类型', type: 'select', dictionary: 'business_type'},
  {key: 'deptmentId', title: '部门', type: 'search',searchUrl: URL_BRANCH}
];

const tableCols = [
  {key: 'customerId', title: '客户'},
  {key: 'businessType', title: '运输类型', dictionary: 'business_type'},
  {key: 'deptmentId', title: '部门'},
  {key: 'insertUser', title: '创建人'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateUser', title: '修改人'},
  {key: 'updateTime', title: '修改时间'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'del', title: '删除', confirm: '确认删除选中的记录?'},
  {key: 'look', title: '查看'}
];

const config = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig,
};

export default config;

