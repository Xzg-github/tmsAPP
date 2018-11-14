// import name from '../../../api/dictionary/name';
import { pageSize, pageSizeType, description } from '../../globalConfig'

const formCols = [
  {key: 'pid', title: '上级权限代码', type: 'select', required: true},
  {key: 'resourceKey', title: '资源代码', type: 'text', required: true},
  {key: 'resourceName', title: '名称', type: 'text', required: true},
  {key: 'resourceEnName', title: '英文名称', type: 'text'},
  {key: 'resourceType', title: '类型', type: 'select', required: true, options: [{value: 0, title: 'module'}, {value: 1, title: 'menu'}, {value: 2, title: 'page'}, {value: 3, title: 'action'}]},
];

const toolbar = [
  {key: 'save', title: '新增', bsStyle: 'primary'},
  {key: 'update', title: '更新'},
  {key: 'remove', title: '删除'}
];

const itemCols = [
  {key: 'resourceKey', title: '资源代码', link: true},
  {key: 'resourceName', title: '名称'},
  {key: 'resourceEnName', title: '英文名称'},
  {key: 'resourceType', title: '类型', options: [{value: 0, title: 'module'}, {value: 1, title: 'menu'}, {value: 2, title: 'page'}, {value: 3, title: 'action'}]},
  {key: 'insertTime', title: '创建时间'},
  {key: 'insertUser', title: '创建用户'},
  {key: 'updateTime', title: '更新时间'},
  {key: 'updateUser', title: '更新用户'},
];


const config = {
  tabs: true,
  indexTableCols: [
    {key: 'id', title: '权限名称', link: true},
    {key: 'pid', title: '归属权限'}
  ],
  placeholder: '权限名称',
  toolbar,
  itemCols,
  tableItems: [],
  formCols,
  formData: {},
  treeData: {},
  expand: {},
  currentPage: 1,
  pageSize,
  pageSizeType,
  description,
};

export default config;
