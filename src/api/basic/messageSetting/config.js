import {pageSize, pageSizeType, description,paginationConfig, searchConfig} from '../../globalConfig';

const URL_SERVICE = '/api/basic/messageSetting/service';
const URL_TASK = '/api/basic/messageSetting/task';
const URL_LIFE = '/api/basic/messageSetting/lifecyclelist';
const URL_BRANCH = '/api/basic/roleDataAuthority/branch';  // 部门



const filters = [
  {key:'messageTitleConfigId',title:'消息标题',type:'select'},
  {key:'userId',title:'订阅用户',type:'search'},
  {key:'institutionId',title:'机构',type:'search'},
];

const tableCols = [
  {key:'messageTitleConfigId',title:'消息标题'},
  {key:'userId',title:'订阅用户'},
  {key:'institutionId',title:'机构'},
  {key:'customerId',title:'客户'},
 /* {key:'productTypeId',title:'服务类型'},
  {key:'taskUnitTypeId',title:'作业单元'},
  {key:'lifecycleId',title:'生命周期节点'},*/
  {key:'supplierId',title:'供应商'},
  {key:'departmentId',title:'部门'},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary',sign:'messageSetting_add'},
  {key: 'edit', title: '编辑',sign:'messageSetting_edit'},
  {key: 'del', title: '删除',confirm:'确认是否删除？',sign:'messageSetting_del'},
];

const controls = [
  {key:'messageTitleConfigId',title:'消息标题',type:'select',required:true},
  {key:'institutionId',title:'机构',type:'readonly',searchType: 'institution'},
  {key:'customerId',title:'客户',type:'readonly',searchType: 'customer'},
/*  {key:'productTypeId',title:'服务类型',type:'readonly',searchUrl: URL_SERVICE},
  {key:'taskUnitTypeId',title:'作业单元',type:'readonly',searchUrl: URL_TASK,props:{searchWhenClick: true}},
  {key:'lifecycleId',title:'生命周期节点',type:'readonly',searchUrl: URL_LIFE,props:{searchWhenClick: true}},*/
  {key:'supplierId',title:'供应商',type:'readonly',searchType: 'supplier'},
  {key:'departmentId',title:'部门',type:'readonly',searchUrl: URL_BRANCH},
]

const index = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig
};

const edit = {
  controls,
  buttons: [
    {key: 'add', title: '新增'},
    {key: 'delete', title: '删除'},
  ],

  tableCols : [
    {key: 'userId', title: '订阅用户'},
    {key: 'userEmail', title: '收信人邮箱'},
    {key: 'userPhone', title: '收信人手机'},
    {key: 'sendMethod', title: '发送方式',options:[
      {value: 'web', title: '平台'},
      {value: 'sms', title: '短信'},
      {value: 'email', title: '邮箱'}
    ]},
  ],
  fromArchives: {
    title: '从档案中选择',
    filters: [
      {key: 'departmentGuid', title: '部门', type: 'search', options: []},
      {key: 'contactName', title: '联系人', type: 'text'}
    ],
    config: {search: '搜索',reset: '重置'},
    sendType: {
      value: [],
      options: [
        {value: 'web', label: '平台'},
        {value: 'sms', label: '短信'},
        {value: 'email', label: '邮箱'}
      ]
    },
    cols: [
      {key: 'checked',type:"checkbox",title: ''},
      {key: 'contactName', title: '联系人', type: 'text'},
      {key: 'email', title: '联系邮箱', type: 'text'},
      {key: 'mobile', title: '联系手机', type: 'text'},
      {key: 'departmentName', title: '部门'}
    ],
    items: [],
    checkedList: [],
    searchData: {}
  },
  edit: '编辑',
  add: '新增',
  size: 'middle',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit,
};

export default config;
