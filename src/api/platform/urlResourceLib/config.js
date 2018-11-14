import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'serviceName', title: '所属服务名', type: 'text'},
  {key: 'controllerName', title: '所属控制层名称', type: 'text'},
  {key: 'url', title: 'URL路径', type: 'text'},
  {key: 'urlName', title: 'URL名称', type: 'text'},
  {key: 'startTime', title: '创建时间', type: 'date', rule: {type: '<', key: 'insertTimeTo'}},
  {key: 'endTime', title: '至', type: 'date', rule: {type: '>', key: 'insertTimeFrom'}}
];


const arr = [
  {value: "0" , title : "否"},
  {value: "1" , title : "是"},
]

const tableCols = [
  {key: "service_serviceName", title: '所属服务名', required: true},
  {key: 'controller_controllerName', title: '所属控制层名称', required: true},
  {key: 'controller_controllerUrl', title: '所属控制层路径'},
  {key: 'url', title: 'URL路径'},
  {key: 'urlName', title: 'URL名称'},
  {key: 'requestMode', title: '请求方式',required: true},
  {key: 'isDistribute', title: '是否已分配', required: true , options: arr},
  {key: 'isNeedPermissionController', title: '是否需要URL权限控制',from:'dictionary', options: arr},
  {key: 'isOpenApi', title: '是否OPENAPI', from:'dictionary', options: arr },
  {key: 'isPublicApi', title: '是否公共 api',from:'dictionary', options: arr},
  {key: 'insertUser', title: '创建人'},
  {key: 'insertTime', title: '创建时间'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'urlResourceLib_add'},
  {key: 'edit', title: '编辑', sign: 'urlResourceLib_edit'},
  {key: 'del', title: '删除', sign: 'urlResourceLib_del'},
  {key: 'distribution', title: '资源分配', sign: 'urlResourceLib_distribution'}
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
  {key: 'service_serviceName', title: '所属服务名', type: 'search', required: true, props: {searchWhenClick: true, noSearchWhenTypo: true},showAdd:true},
  {key: 'controller_controllerName', title: '所属控制层', type: 'search', required: true, props: {searchWhenClick: true, noSearchWhenTypo: true},showAdd:true},
  {key: 'urlName', title: 'URL名称', type: 'text',required: true},
  {key: 'url', title: 'URL路径', type: 'text',required: true},
  {key: 'requestMode', title: '请求方式', type: 'select',dictionary: name.REQUEST_METHOD,required: true},
  {key: 'isNeedPermissionController', title: '是否需要URL权限控制', type: 'radioGroup', from:'dictionary',options: arr,required: true},
  {key: 'isOpenApi', title: '是否公开API', type: 'radioGroup', from:'dictionary',options: arr,required: true},
  {key: 'isPublicApi', title: '是否公共API', type: 'radioGroup', from:'dictionary', options: arr,required: true},
];

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit,
  dicNames: [name.YES_OR_NO,name.REQUEST_METHOD]
};

export default config;

