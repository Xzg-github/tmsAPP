import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'resourceName', title: '资源名称', type: 'text'},
  {key: 'resourceType', title: '资源类型', type: 'select', options: [{value: 0, title: 'module'}, {value: 1, title: 'menu'}, {value: 2, title: 'page'}, {value: 3, title: 'action'}]},
  {key: 'url', title: 'URL路径', type: 'text'},
  {key: 'urlName', title: 'URL名称', type: 'text'},
  {key: 'resourceKey', title: '资源代码', type: 'text'},
  {key: 'serviceName', title: '服务名', type: 'text'},
  {key: 'controllerName', title: '控制层名称', type: 'text'},
];

const tableCols = [
  {key: 'urlName', title: 'URL名称'},
  {key: 'url', title: 'URL路径'},
  {key: 'serviceName', title: '服务名'},
  {key: 'controllerName', title: '控制层名称'},
  {key: 'controllerUrl', title: '控制层路径'},
  {key: 'requestMode', title: '请求方式', from:'dictionary', position:name.REQUEST_METHOD},
  {key: 'resourceName', title: '资源名称'},
  {key: 'resourceKey', title: '资源代码'},
  {key: 'parentResourceName', title: '上级资源名称'},
  {key: 'resourceEnName', title: '资源英文名'},
  {key: 'resourceType', title: '资源类型', options: [{value: 0, title: 'module'}, {value: 1, title: 'menu'}, {value: 2, title: 'page'}, {value: 3, title: 'action'}]}
];

const config = {
  filters,
  tableCols,
  pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig,
  dicNames: [name.REQUEST_METHOD]
};

export default config;
