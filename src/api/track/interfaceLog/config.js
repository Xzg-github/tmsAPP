import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';

const activeKey = 'pushLog';

const tabs = [
  {key: 'pushLog', title: '推送日志', close: false},
  {key: 'receivingLog', title: '接收日志', close: false}
];

//推送日志下tag的固定选择
const pushTagOptions = [
  {value: 0, title: '已注册'},
  {value: 1, title: '已推送'},
  {value: 2, title: '推送失败'},
  {value: 3, title: '推送成功'},
  {value: 4, title: '解析失败'},
  {value: 5, title: '解析成功'}
];

// 推送日志标签下配置信息
const pushLogConfig = {
  filters: [
    {key: 'interfaceType', title: '接口类别', type: 'select', dictionary: 'system_settings_interface'},
    {key: 'tag', title: '状态', type: 'select', options: pushTagOptions},
    {key: 'showContent', title: '关键信息', type: 'text'},
    {key: 'insertTimeFrom', title: '创建时间', type: 'date',props: {showTime: true}},
    {key: 'insertTimeTo', title: '创建时间至', type: 'date',props: {showTime: true}}
  ],
  buttons: [
    {key: 'redock', title: '重新对接', bsStyle: 'primary'},
    {key: 'check', title: '查看'},
    {key: 'export', title: '导出', menu: [
        { key: 'exportSearch', title: '查询导出'},
        { key: 'exportPage', title: '页面导出'},
      ]}
  ],
  tableCols: [
    {key: 'interfaceType', title: '接口类别', dictionary: 'system_settings_interface'},
    {key: 'tag', title: '状态', options: pushTagOptions},
    {key: 'showContent', title: '关键信息'},
    {key: 'reason', title: '状态描述'},
    {key: 'insertTime', title: '创建时间'},
    {key: 'insertUserName', title: '创建用户'},
    {key: 'updateTime', title: '更新时间'},
    {key: 'updateUserName', title: '更新用户'}
  ],
  pageSize,
  pageSizeType,
  description,
  searchConfig
};

//接收日志下tag的固定选择
const receivingTagOptions = [
  {value: 0, title: '待处理'},
  {value: 1, title: '处理成功'},
  {value: 2, title: '处理失败'}
];

//接收日志下配置信息
const receivingConfig = {
  filters: [
    {key: 'receiveInterfaceType', title: '接收类别', type: 'select', dictionary: 'receive_interface_type'},
    {key: 'tag', title: '状态', type: 'select', options: receivingTagOptions},
    {key: 'showContent', title: '关键信息', type: 'text'},
    {key: 'insertTimeFrom', title: '创建时间', type: 'date',props: {showTime: true}},
    {key: 'insertTimeTo', title: '创建时间至', type: 'date',props: {showTime: true}}
  ],
  buttons: [
    {key: 'check', title: '查看'},
    {key: 'export', title: '导出', menu: [
        { key: 'exportSearch', title: '查询导出'},
        { key: 'exportPage', title: '页面导出'},
      ]}
  ],
  tableCols: [
    {key: 'receiveInterfaceType', title: '接口类别', dictionary: 'receive_interface_type'},
    {key: 'tag', title: '状态', options: receivingTagOptions},
    {key: 'showContent', title: '关键信息'},
    {key: 'reason', title: '状态描述'},
    {key: 'insertTime', title: '创建时间'},
    {key: 'insertUserName', title: '创建用户'},
    {key: 'updateTime', title: '更新时间'},
    {key: 'updateUserName', title: '更新用户'}
  ],
  pageSize,
  pageSizeType,
  description,
  searchConfig
};

const config = {
  activeKey,
  tabs,
  pushLogConfig,
  receivingConfig
};

export default config;




