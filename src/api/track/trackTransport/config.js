import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';

const filters = [
  {key: 'orderNumber', title: '运单号', type: 'text'},
  {key: 'customerDelegateCode', title: '委托号', type: 'text'},
  {key: 'customerId', title: '客户', type: 'search', searchType: 'customer_all'},
  {key: 'supplierId', title: '供应商', type: 'search', searchType: 'supplier_all'},
  {key: 'carInfoId', title: '车牌号码', type: 'search', searchType:'car_all'},
  {key: 'driverId', title: '司机', type: 'search', searchType:'driver_all'},
  {key: 'businessType', title: '运输类型', type: 'select', dictionary: 'business_type'},
  {key: 'customerServiceId', title: '客服人员', type: 'search', searchType: 'user'},
  {key: 'dispatchUser', title: '派单人', type: 'search', searchType: 'user'},
  {key: 'transportType', title: '运输方式', type: 'select', dictionary: 'transport_type'},
  {key: 'carModeId', title: '车型', type: 'search', searchType: 'car_mode'},
  {key: 'departure', title: '始发地', type: 'search', searchType:'charge_place'},
  {key: 'destination', title: '目的地', type: 'search', searchType:'charge_place'},
  {key: 'planPickupTimeFrom', title: '要求装货时间开始', type: 'date', props: {showTime: true}},
  {key: 'planPickupTimeTo', title: '要求装货时间至', type: 'date', props: {showTime: true}},
  {key: 'dispatchTimeFrom', title: '派单时间开始', type: 'date', props: {showTime: true}},
  {key: 'dispatchTimeTo', title: '派单时间至', type: 'date', props: {showTime: true}},
  {key: 'insertTimeFrom', title: '创建时间开始', type: 'date', props: {showTime: true}},
  {key: 'insertTimeTo', title: '创建时间至', type: 'date', props: {showTime: true}}
];

const tableCols = [
  {key: 'orderNumber', title: '运单号', link: true},
  {key: 'customerId', title: '客户'},
  {key: 'customerDelegateCode', title: '委托号'},
  {key: 'customerDelegateTime', title: '委托日期'},
  {key: 'carModeId', title: '车型'},
  {key: 'supplierId', title: '供应商/车主'},
  {key: 'carNumber', title: '车牌号'},
  {key: 'driverName', title: '司机名称'},
  {key: 'driverMobilePhone', title: '司机号码'},
  {key: 'isDelay', title: '是否延误', dictionary: 'zero_one_type'},
  {key: 'firstTransportOrderId', title: '待执行运单', link: true},
  {key: 'totalMileage', title: '总里程'},
  {key: 'position', title: '最新位置'},
  {key: 'positionTime', title: '位置更新时间'},
  {key: 'updateType', title: '来源'},
  {key: 'restMileage', title: '剩余距离'},
  {key: 'departure', title: '始发地'},
  {key: 'destination', title: '目的地'},
  {key: 'planPickupTime', title: '要求装货时间'},
  {key: 'planDeliveryTime', title: '要求卸货时间'},
  {key: 'planArrivalTime', title: '计划到达时间'},
  {key: 'businessType', title: '运输类型', dictionary: 'business_type'},
  {key: 'customerServiceId', title: '客服'},
  {key: 'transportType', title: '运输方式', dictionary: 'transport_type'},
  {key: 'statusType', title: '运单状态', dictionary: 'transport_order'},
  {key: 'orderType', title: '任务状态', dictionary: 'order_type'},
  {key: 'route', title: '路线'},
  {key: 'longitude', title: '经度'},
  {key: 'latitude', title: '纬度'},
  {key: 'gpsSimNumber', title: 'GPS设备SIM卡号'},
  {key: 'gpsEquipmentBrand', title: 'GPS设备品牌'},
];

const menu = [
  {key:'webExport',title:'页面导出'},
  {key:'allExport',title:'查询导出'},
  {key:'templateManager', title:'模板管理'}
];

const config = {
  tabs: [{key: 'index', title: '在途跟踪', close: false}],
  filters,
  tableCols,
  pageSize,
  currentPage: 1,
  pageSizeType,
  paginationConfig,
  searchConfig,
  urlExport: '/tms-service/transport_order/in_transport/list/search', //后端查询导出api配置
  searchData: {},//默认搜索条件值-若有需同步配置searchDataBak
  searchDataBak: {},//初始搜索条件值-若有则与searchData相同
  activeKey: 'index',
  fixedFilters: {},
  buttons: [
    {key: 'position', title: '查看位置', bsStyle: 'primary'},
    {key: 'line', title: '查看轨迹'},
    {key: 'update', title: '位置更新'},
    {key: 'complete', title: '更新为已完成'},
    {key: 'refresh', title: '获取最新位置'},
    {key: 'export', title: '导出', menu},
  ]
};

export default config;
