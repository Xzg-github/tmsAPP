import RouterHelper from '../RouteHelper';
import React from 'react';

const title = '快捷菜单';
const prefix = '/shortcut';

const children = [
  require('./shortcutSet').default,
  require('../order/input').default,
  require('../order/import').default,
  require('../order/accept').default,
  require('../order/pending').default,
  require('../order/complete').default,
  require('../order/all').default,
  require('../dispatch/todo').default,
  require('../dispatch/done').default,
  require('../track/trackOrder').default,
  require('../track/trackTransport').default,
  require('../track/fileManager').default,
  require('../track/taskTotal').default,
  require('../track/interfaceLog').default,
  require('../bill/receiveMake').default,
  require('../bill/receiveChange').default,
  require('../bill/receiveBill').default,
  require('../bill/receiveMonthlyBill').default,
  require('../bill/receiveApply').default,
  require('../bill/payMake').default,
  require('../bill/payChange').default,
  require('../bill/payBill').default,
  require('../bill/payMonthlyBill').default,
  require('../bill/extraApply').default,
  require('../bill/append').default,
  require('../config/institution').default,
  require('../config/department').default,
  require('../config/user').default,
  require('../config/corporation').default,
  require('../config/bank').default,
  require('../config/customersArchives').default,
  require('../config/customerContact').default,
  require('../config/customerFactory').default,
  require('../config/customerTax').default,
  require('../config/customerCost').default,
  require('../config/customerService').default,
  require('../config/customerInvoice').default,
  require('../config/suppliersArchives').default,
  require('../config/supplierContact').default,
  require('../config/supplierCar').default,
  require('../config/supplierDriver').default,
  require('../config/carManager').default,
  require('../config/supplierSupervisor').default,
  require('../config/supplierCost').default,
  require('../config/supplierTax').default,
  require('../config/insideFactory').default,
  require('../config/insideCar').default,
  require('../config/insideDriver').default,
  require('../config/insideSupervisor').default,
  require('../config/rate').default,
  require('../config/chargeItem').default,
  require('../config/customerPrice').default,
  require('../config/supplierPrice').default,
  require('../config/position').default,
  require('../basic/fromOddDefine').default,             // 表单单号定义
  require('../basic/SMSmail').default,                   // 通知账号配置
  require('../basic/excelConfigLib').default,            // EXCEL配置库
  require('../basic/mouldMake').default,                 // 模板制作
  require('../basic/emailAccept').default,               // 邮箱接收管理
  require('../basic/messageSetting').default,            // 消息设置
  require('../basic/modeOuputDesign').default,           // 报表模板设计
  require('../basic/formExpand').default,           // 表单扩展设置
  require('../basic/tenantCurrency').default,            // 租户币种
  require('../basic/systemConfig').default,            // 系统配置
  require('../basic/roleAuthorityDistribution').default, // 角色权限分配
  require('../basic/accountManager').default,            // 用户角色分配
  require('../basic/roleDataAuthority').default,         // 角色数据权限分配
  require('../basic/defaultOutput').default,             // 默认输出模板
  require('../basic/commonOutput').default,              // 常用输出模板
  require('../message/business').default,
  require('../message/sendMessageByShortMes').default,
  require('../message/sendMessageByEmail').default,
  require('../message/messageSubscribe').default,
  require('../platform/publicAuthority').default,
  require('../platform/dataset').default,
  require('../platform/datalib').default,
  require('../platform/excelOutputConfiguration').default,
  require('../platform/importTemplate').default,
  require('../platform/messageTheme').default,
  require('../platform/formStateConfiguration').default,
  require('../platform/tenantAuthorityDistribution').default,
  require('../platform/jurisdiction/tenantRuleTypes').default,
  require('../platform/tenantapi').default,
  require('../platform/sysDictionary').default,
  require('../platform/carType').default,
  require('../platform/currencyFile').default,
  require('../platform/area').default,
  require('../platform/jurisdiction/dataRule').default,
  require('../platform/jurisdiction/dataType').default,
  require('../platform/serviceManager').default,
  require('../platform/controlManager').default,
  require('../platform/urlResourceLib').default,
  require('../platform/urlResource').default,
  require('../platform/tenant').default,
];

export default RouterHelper(prefix, title, children);
