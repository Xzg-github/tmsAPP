import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';

const filters = [
  {key: 'carNumber', title: '车牌号码', type: 'text'},
  {key: 'carModeId', title: '车型', type: 'search', searchType: 'car_mode'},
];

const tableCols = [
  {key: 'carNumber', title: '车牌号'},
  {key: 'driverName', title: '司机名称'},
  {key: 'carModeId', title: '车型'},
  {key: 'transportOrderId', title: '操作中运单', link: true},
  {key: 'carState', title: '使用状态', dictionary: 'car_state'},
  {key: 'position', title: '车辆位置'},
  {key: 'longitude', title: '经度'},
  {key: 'latitude', title: '纬度'},
  {key: 'province', title: '省份'},
  {key: 'city', title: '城市'},
  {key: 'district', title: '行政区'},
  {key: 'gpsSimNumber', title: 'GPS设备SIM卡号'},
  {key: 'gpsEquipmentBrand', title: 'GPS设备品牌'},
  {key: 'positionTime', title: '位置更新时间'},
  {key: 'totalOutputValue', title: '总产值'},
  {key: 'firstTransportOrderId', title: '待执行运单', link: true},
  {key: 'lastFinishTime', title: '最后一单完成时间'},
  {key: 'reason', title: '变更说明'},
];

const menu = [
  {key:'webExport',title:'页面导出'},
  {key:'allExport',title:'查询导出'}
];
const commonButtons = [{key: 'export', title: '导出', menu}];

const config = {
  tabs: [{key: 'index', title: '车辆管理', close: false}],
  subTabs: [
    {key: 'use', title:'使用中', status: 'car_state_user'},
    {key: 'unuse', title:'闲置中', status: 'car_state_unuser'},
    {key: 'repair', title:'维修中', status: 'car_state_repair'},
    {key: 'accident', title:'事故中', status: 'car_state_accident'},
    {key: 'stop', title:'禁用', status: 'car_state_stop'}
  ],
  filters,
  tableCols,
  initPageSize: pageSize, //每页显示条数初始值
  pageSizeType,
  paginationConfig,
  searchConfig,
  activeKey: 'index',
  subActiveKey: 'use',
  urlExport: '/tms-service/car_manager/list/search', //后端查询导出api配置
  isTotal: true, //页签是否需要统计符合条件的记录数

  //以下属性没有时可不写
  searchData: {},//默认搜索条件值-若有需同步配置searchDataBak
  searchDataBak: {},//初始搜索条件值-若有则与searchData相同
  fixedFilters: {//各tab页签列表搜索时的固定搜索条件
    use: {carState: 'car_state_user'},
    unuse: {carState: 'car_state_unuser'},
    repair: {carState: 'car_state_repair'},
    accident: {carState: 'car_state_accident'},
    stop: {carState: 'car_state_stop'},
  },
  buttons: { //各tab页签操作按钮
    use:[
      {key: 'clear', title: '清空运单', bsStyle: 'primary', confirm: '是否确认将勾选记录清空运单？'},
    ].concat(commonButtons),
    unuse: [
      {key: 'change', title: '变更状态', bsStyle: 'primary'},
    ].concat(commonButtons),
    repair: [
      {key: 'change', title: '变更状态', bsStyle: 'primary'},
    ].concat(commonButtons),
    accident: [
      {key: 'change', title: '变更状态', bsStyle: 'primary'},
    ].concat(commonButtons),
    stop: commonButtons
  }
};

export default config;
