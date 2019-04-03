import { combineReducers } from 'redux';
import {createReducer} from '../action-reducer/reducer';
import {mapReducer} from '../action-reducer/combine';
import basic from './basic';
import config from './config';
import password from './password';
import platform from './platform';
import message from './message';

/*
* 功能：创建标准reducer结构
* 参数： key: 模块标识，一般使用对应模块侧边栏key的驼峰名
*       isTabPage： 主页面是否为需要tab页签页面扩展，默认true，会创建一个路径加edit的reducer
* */
const create = (key, isTabPage=true) => {
  const prefix = [key];
  if (isTabPage) {
    const edit = createReducer(prefix.concat('edit'));
    const toEdit = ({activeKey}, {payload={}}) => {
      const key = payload.currentKey || activeKey;
      return key !== 'index' ? {keys: [key], reducer: edit} : {};
    };
    return createReducer(prefix, mapReducer(toEdit));
  }else {
    return createReducer(prefix);
  }
};

/*
* 功能：创建编辑页面带运单子页签信息的reduce结构，运单信息容器组件statePath=[key, 'edit', 'orderInfo']
* */
const createBillReducer = (key) => {
  const prefix = [key];
  const editPrefix = [key, 'edit'];
  const toKeyReducer = ({activeKey}) => {
    const orderInfoPrefix = editPrefix.concat('orderInfo');
    const recucerName = activeKey === 'index' ? editPrefix : orderInfoPrefix;
    return {keys: [activeKey], reducer: createReducer(recucerName)};
  };
  const edit = createReducer(editPrefix, mapReducer(toKeyReducer));
  const toEdit = ({activeKey}, {payload={}}) => {
    const key = payload.currentKey || activeKey;
    return key !== 'index' ? {keys: [key], reducer: edit} : {};
  };
  return createReducer(prefix, mapReducer(toEdit));
};


const rootReducer = combineReducers({
  layout: createReducer(['layout']),
  home: createReducer(['home']),
  temp: createReducer(['temp']),
  temp2: createReducer(['temp2']),
  basic,
  config,
  password,
  platform,
  message,

  //快捷设置
  shortcutSet: create('shortcutSet', false),

  //运输订单
  input: create('input', false),
  import: create('import'),
  accept: create('accept'),
  pending: create('pending'),
  complete: create('complete'),
  all: create('all'),

  //车辆调度
  todo: create('todo'),
  done: create('done'),

  //监理任务
  waiting: create('waiting'),
  finish: create('finish'),
  supervisorManager: create('supervisorManager'),

  //跟踪管控
  trackOrder: create('trackOrder'),
  trackTransport: create('trackTransport'),
  fileManager: create('fileManager'),
  interfaceLog: create('interfaceLog'),
  taskTotal: create('taskTotal'),

  //计费与对帐
  receiveMake: createBillReducer('receiveMake'),
  receiveChange: create('receiveChange'),
  receiveBill: create('receiveBill'),
  receiveMonthlyBill: create('receiveMonthlyBill'),
  receiveApply: create('receiveApply'),
  payMake: createBillReducer('payMake'),
  payChange: create('payChange'),
  payBill: create('payBill'),
  payMonthlyBill: create('payMonthlyBill'),
  extraApply: create('extraApply'),
  append: create('append'),

  //档案管理
  customerContact: create('customerContact', false),
  customerTax: create('customerTax', false),
  customerCost: create('customerCost', false),
  customerService: create('customerService', false),
  customerInvoice: create('customerInvoice', false),
  customerTask: create('customerTask', false),
  supplierContact: create('supplierContact', false),
  supplierCar: create('supplierCar', false),
  supplierDriver: create('supplierDriver', false),
  supplierSupervisor: create('supplierSupervisor', false),
  supplierCost: create('supplierCost', false),
  insideCar: create('insideCar', false),
  brand: createReducer(['brand']),
  insideDriver: create('insideDriver', false),
  insideSupervisor: create('insideSupervisor', false),
  customerPrice: create('customerPrice'),
  supplierPrice: create('supplierPrice'),
  supplierTax: create('supplierTax', false),
  carManager: create('carManager'),
  corporation: create('corporation', false),
  bank: create('bank', false),
  position: create('position', false),
  customerPriceDetail: create('customerPriceDetail'),
  supplierPriceDetail: create('supplierPriceDetail'),

  //系统设置
  information: create('information', false),
});

export default rootReducer;
