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
  {key: 'orderType', title: '任务状态', dictionary: 'order_type'},
  {key: 'statusType', title: '运单状态', dictionary: 'transport_order'},
  {key: 'customerId', title: '客户'},
  {key: 'customerDelegateCode', title: '委托号'},
  {key: 'customerDelegateTime', title: '委托日期'},
  {key: 'contactName', title: '客户联系人'},
  {key: 'contactTelephone', title: '联系电话'},
  {key: 'contactEmail', title: '联系邮箱'},
  {key: 'salespersonId', title: '销售员'},
  {key: 'businessType', title: '运输类型', dictionary: 'business_type'},
  {key: 'customerServiceId', title: '客服'},
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
  {key: 'route', title: '路线'},
  {key: 'isSupervisor', title: '是否需要监理', dictionary: 'zero_one_type'},
  {key: 'reason', title: '原因'},
  {key: 'commodityDescription', title: '商品描述'},
  {key: 'palletsNumber', title: '总卡板数'},
  {key: 'goodsNumber', title: '总数量'},
  {key: 'volume', title: '总体积'},
  {key: 'roughWeight', title: '总重量'},
  {key: 'customerFactoryRemark', title: '装货注意事项'},
  {key: 'dispatchRemark', title: '调度注意事项'},
  {key: 'description', title: '附加说明'},
  {key: 'insertUser', title: '创建人员'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateUser', title: '更新人员'},
  {key: 'updateTime', title: '更新时间'},
  {key: 'dispatchUser', title: '派单人员'},
  {key: 'dispatchTime', title: '派单时间'},
  {key: 'dispatchConfirmUser', title: '确认人员'},
  {key: 'dispatchConfirmTime', title: '确认时间'},
  {key: 'dispatchInterfaceRemark', title: '车辆对接说明'},
  {key: 'dispatchInterfaceStatus', title: '车辆对接结果'},
];

const menu = [
  {key:'webExport',title:'页面导出'},
  {key:'allExport',title:'查询导出'},
  {key:'templateManager', title:'模板管理'}
];
const commonButtons = [{key: 'export', title: '导出', menu}];

const config = {
  tabs: [{key: 'index', title: '运单跟踪', close: false}],
  subTabs: [
    {key: 'order', title:'已下单', status: 'status_customer_order_completed'},
    {key: 'dispatch', title:'已派发', status: 'status_cs_send_completed'},
    {key: 'confirm', title:'派车已确认', status: 'status_vehicle_completed_check'},
    {key: 'transport', title:'运输已开始', status: 'status_in_transport'},
    {key: 'complete', title:'已完成', status: 'status_completed'},
    {key: 'sign', title:'已签收', status: 'status_sign_completed'},
    {key: 'bill', title:'已结算', status: 'status_settlement_completed'},
    {key: 'cancel', title:'已取消', status: 'status_cancel_completed'},
  ],
  filters,
  tableCols,
  initPageSize: pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig,
  activeKey: 'index',
  subActiveKey: 'order',
  urlExport: '/tms-service/transport_order/trace_order/list/search', //后端查询导出api配置
  isTotal: true, //页签是否需要统计符合条件的记录数
  searchData: {},//默认搜索条件值-若有需同步配置searchDataBak
  searchDataBak: {},//初始搜索条件值-若有则与searchData相同
  fixedFilters: {//各tab页签列表搜索时的固定搜索条件
    order: {statusType: 'status_customer_order_completed'},
    dispatch: {statusType: 'status_cs_send_completed'},
    confirm: {statusType: 'status_vehicle_completed_check'},
    transport: {statusType: 'status_in_transport'},
    complete: {statusType: 'status_completed'},
    sign: {statusType: 'status_sign_completed'},
    bill: {statusType: 'status_settlement_completed'},
    cancel: {statusType: 'status_cancel_completed'},
  },
  buttons: { //各tab页签操作按钮
    order:commonButtons,
    dispatch:commonButtons,
    confirm: [
      {key: 'started', title: '运输已开始', bsStyle: 'primary'},
    ].concat(commonButtons),
    transport: [
      {key: 'completed', title: '运输已完成', bsStyle: 'primary'},
    ].concat(commonButtons),
    complete: commonButtons,
    sign: commonButtons,
    bill: commonButtons,
    cancel: commonButtons,
  }
};

export default config;
