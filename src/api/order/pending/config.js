import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';

const filters = [
  {key: 'orderNumber', title: '运单号', type: 'text'},
  {key: 'customerDelegateCode', title: '委托号', type: 'text'},
  {key: 'customerId', title: '客户', type: 'search', searchType: 'customer_all'},
  {key: 'businessType', title: '运输类型', type: 'select', dictionary: 'business_type'},
  {key: 'customerServiceId', title: '客服人员', type: 'search', searchType: 'user'},
  {key: 'transportType', title: '运输方式', type: 'select', dictionary: 'transport_type'},
  {key: 'carModeId', title: '车型', type: 'search', searchType: 'car_mode'},
  {key: 'departure', title: '始发地', type: 'search', searchType:'charge_place'},
  {key: 'destination', title: '目的地', type: 'search', searchType:'charge_place'},
  {key: 'planPickupTimeFrom', title: '要求装货时间开始', type: 'date', props: {showTime: true}},
  {key: 'planPickupTimeTo', title: '要求装货时间至', type: 'date', props: {showTime: true}},
  {key: 'insertTimeFrom', title: '创建时间开始', type: 'date', props: {showTime: true}},
  {key: 'insertTimeTo', title: '创建时间至', type: 'date', props: {showTime: true}}
];

const tableCols = [
  {key: 'orderNumber', title: '运单号', link: true},
  {key: 'orderType', title: '任务状态', dictionary: 'order_type'},
  {key: 'statusType', title: '运单状态', dictionary: 'transport_order'},
  {key: 'reason', title: '原因'},
  {key: 'customerId', title: '客户'},
  {key: 'customerDelegateCode', title: '委托号'},
  {key: 'customerDelegateTime', title: '委托日期'},
  {key: 'businessType', title: '运输类型', dictionary: 'business_type'},
  {key: 'contactName', title: '客户联系人'},
  {key: 'contactTelephone', title: '联系电话'},
  {key: 'contactEmail', title: '联系邮箱'},
  {key: 'salespersonId', title: '销售员'},
  {key: 'customerServiceId', title: '客服'},
  {key: 'transportType', title: '运输方式', dictionary: 'transport_type'},
  {key: 'planPickupTime', title: '要求装货时间'},
  {key: 'planDeliveryTime', title: '要求卸货时间'},
  {key: 'departure', title: '始发地'},
  {key: 'destination', title: '目的地'},
  {key: 'commodityDescription', title: '商品描述'},
  {key: 'goodsNumber', title: '总数量'},
  {key: 'volume', title: '总体积'},
  {key: 'roughWeight', title: '总重量'},
  {key: 'palletsNumber', title: '总卡板数'},
  {key: 'carModeId', title: '车型'},
  {key: 'isSupervisor', title: '是否需要监理', dictionary: 'zero_one_type'},
  {key: 'route', title: '路线', type:'textArea'},
  {key: 'customerFactoryRemark', title: '装货注意事项'},
  {key: 'dispatchRemark', title: '调度注意事项'},
  {key: 'description', title: '附加说明'},
  {key: 'insertUser', title: '创建人员'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateUser', title: '更新人员'},
  {key: 'updateTime', title: '更新时间'},
];

const menu = [
  {key:'webExport',title:'页面导出'},
  {key:'allExport',title:'查询导出'},
  {key:'templateManager', title:'模板管理'}
];
const commonButtons = [{key: 'export', title: '导出', menu}];

const config = {
  tabs: [{key: 'index', title: '待办任务', close: false}],
  subTabs: [
    {key: 'completing', title:'待完善', status: 'status_waiting_perfect'},
    {key: 'sending', title:'待派发', status: 'status_waiting_send'},
  ],
  filters,
  tableCols,
  initPageSize: pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig,
  activeKey: 'index',
  subActiveKey: 'completing',
  urlExport: '/tms-service/transport_order/pending_task_list/search', //后端查询导出api配置
  isTotal: true, //页签是否需要统计符合条件的记录数
  searchData: {},//默认搜索条件值-若有需同步配置searchDataBak
  searchDataBak: {},//初始搜索条件值-若有则与searchData相同
  fixedFilters: {//各tab页签列表搜索时的固定搜索条件
    completing: {orderType: 'status_waiting_perfect'},
    sending: {orderType: 'status_waiting_send'}
  },
  buttons: { //各tab页签操作按钮
    completing:[
      {key: 'edit', title: '运单完善', bsStyle: 'primary'},
      {key: 'del', title: '删除', confirm: '删除！是否确认删除所有勾选运单？'},
    ].concat(commonButtons),
    sending: [
      {key: 'send', title: '任务制作', bsStyle: 'primary'},
      {key: 'sendBatch', title: '批量制作', confirm: '是否确认按任务库规则进行批量任务制作？'},
    ].concat(commonButtons),
  }
};

export default config;
