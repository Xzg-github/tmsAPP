const activeKey = 'msgSubscribe';

const tabs = [
  {key: 'msgSubscribe', title: '消息订阅', close: false}
];

const tableCols = [
  {key: 'messageTitleConfigId', title:'消息主题'},
  {key: 'departmentId', title: '部门'},
  {key: 'institutionId', title: '机构'},
  {key: 'productTypeId', title: '服务类型'},
  {key: 'taskUnitTypeId', title: '作业单元'},
  {key: 'customerId', title: '客户'},
  {key: 'supplierId', title: '供应商'},
  {key: 'lifecycleId', title: '节点'}
];

const buttons = [
  {key: 'subscribe_cancel', title: '取消订阅'}
]

const config = {
  activeKey,
  tabs,
  buttons,
  tableCols
}

export default config;
