
const serviceItems = [
  {key: 'waitingPerfect', title: '待完善', href: '/order/pending', activeKey: 'completing'},
  {key: 'waitingSend', title: '待派发', href: '/order/pending', activeKey: 'sending'},
];

const documentItems = [
  {key: 'waittingUpload', title: '待上传', href: '/track/file_manager', activeKey: 'uploading'},
  {key: 'waittingCheck', title: '待审核', href: '/track/file_manager', activeKey: 'checking'},
];

const dispatchItems = [
  {key: 'waitingIntelligenceDelivery', title: '待智能派单', href: '/dispatch/todo', activeKey: 'auto'},
  {key: 'waitingDelivery', title: '待派单', href: '/dispatch/todo', activeKey: 'dispatch'},
  {key: 'waitingDriverCheck', title: '待司机确认', href: '/dispatch/todo', activeKey: 'driver'},
  {key: 'waitingSupplierCheck', title: '待供应商确认', href: '/dispatch/todo', activeKey: 'supplier'},
];

const billItems = [
  {key: 'incomeWaitingDetailChecked', title: '应收待明细审核', href: '/bill/receive_make', activeKey: '0'},
  {key: 'incomeWaitingWholeChecked', title: '应收待整审', href: '/bill/receive_make', activeKey: '1'},
  {key: 'costWaitingDetailChecked', title: '应付待明细审核', href: '/bill/pay_make', activeKey: '0'},
  {key: 'costWaitingWholeChecked', title: '应付待整审', href: '/bill/pay_make', activeKey: '1'},
];

const config = {
  service: {
    title: '客服任务',
    items: serviceItems,
    size: 'large'
  },
  document: {
    title: '文件任务',
    items: documentItems,
    size: 'large'
  },
  dispatch: {
    title: '车辆调度任务',
    items: dispatchItems,
    size: 'small'
  },
  bill: {
    title: '结算任务',
    items: billItems,
    size: 'small'
  }
};

export default config;
