import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';

const filters = [
  {key: 'orderNumber', title: '运单号', type: 'text'},
  {key: 'customerDelegateCode', title: '委托号', type: 'text'},
  {key: 'customerId', title: '客户', type: 'search'},
  {key: 'supplierId', title: '供应商', type: 'search'},
  {key: 'carInfoId', title: '车牌号码', type: 'search'},
  {key: 'driverId', title: '司机', type: 'search'},
  {key: 'businessType', title: '运输类型', type: 'select', dictionary: 'business_type'},
  {key: 'customerServiceId', title: '客服人员', type: 'search'},
  {key: 'transportType', title: '运输方式', type: 'select', dictionary: 'transport_type'},
  {key: 'departure', title: '始发地', type: 'search'},
  {key: 'destination', title: '目的地', type: 'search'},
  {key: 'planPickupTimeFrom', title: '要求装货时间', type: 'date', props: {showTime: true}},
  {key: 'planPickupTimeTo', title: '至', type: 'date', props: {showTime: true}},
  {key: 'insertTimeFrom', title: '创建时间', type: 'date', props: {showTime: true}},
  {key: 'insertTimeTo', title: '至', type: 'date', props: {showTime: true}}
];

const tableCols = [
  {key: 'orderNumber', title: '运单号', link: true},
  {key: 'orderType', title: '任务状态', dictionary: 'order_type'},
  {key: 'statusType', title: '运单状态', dictionary: 'transport_order'},
  {key: 'taskTypeName', title: '文件任务'},
  {key: 'fileList', title: '附件', link: 'list'},
  {key: 'uploadType', title: '上传方式'},
  {key: 'remark', title: '备注'},
  {key: 'customerId', title: '客户'},
  {key: 'customerDelegateCode', title: '委托号'},
  {key: 'customerDelegateTime', title: '委托日期'},
  {key: 'businessType', title: '运输类型', dictionary: 'business_type'},
  {key: 'transportType', title: '运输方式', dictionary: 'transport_type'},
  {key: 'carModeId', title: '车型'},
  {key: 'supplierId', title: '供应商/车主'},
  {key: 'carNumber', title: '车牌号'},
  {key: 'driverName', title: '司机名称'},
  {key: 'driverMobilePhone', title: '司机号码'},
  {key: 'departure', title: '始发地'},
  {key: 'destination', title: '目的地'},
  {key: 'planPickupTime', title: '要求装货时间'},
  {key: 'planDeliveryTime', title: '要求卸货时间'},
  {key: 'insertUser', title: '创建人员'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateUser', title: '更新人员'},
  {key: 'updateTime', title: '更新时间'},
];

const menu = [
  {key:'webExport',title:'页面导出'},
  {key:'allExport',title:'查询导出'}
];
const commonButtons = [{key: 'export', title: '导出', menu}];

const config = {
  tabs: [{key: 'index', title: '文件管理', close: false}],
  subTabs: [
    {key: 'uploading', title:'待上传', status: 0},
    {key: 'checking', title:'待审核', status: 1},
    {key: 'checked', title:'已审核', status: 2},
  ],
  filters,
  tableCols,
  initPageSize: pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig,
  activeKey: 'index',
  subActiveKey: 'uploading',
  urlExport: '/tms-service/file_task/list/search', //后端查询导出api配置
  isTotal: true, //页签是否需要统计符合条件的记录数
  searchData: {},//默认搜索条件值-若有需同步配置searchDataBak
  searchDataBak: {},//初始搜索条件值-若有则与searchData相同
  fixedFilters: {//各tab页签列表搜索时的固定搜索条件
    uploading: {fileStatus: 0},
    checking: {fileStatus: 1},
    checked: {fileStatus: 2},
  },
  buttons: { //各tab页签操作按钮
    uploading:[
      {key: 'upload', title: '上传', bsStyle: 'primary'},
      {key: 'check', title: '审核通过', confirm: '是否所有勾选记录审核通过？'},
    ].concat(commonButtons),
    checking:[
      {key: 'edit', title: '编辑', bsStyle: 'primary'},
      {key: 'check1', title: '审核通过', confirm: '是否所有勾选记录审核通过？'},
    ].concat(commonButtons),
    checked: commonButtons,
  }
};

export default config;
