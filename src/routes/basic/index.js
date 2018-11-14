import RouterHelper from '../RouteHelper';
import React from 'react';

const title = '系统设置';
const prefix = '/basic';
const children = [
  require('./fromOddDefine').default,             // 表单单号定义
  require('./SMSmail').default,                   // 通知账号配置
  require('./excelConfigLib').default,            // EXCEL配置库
  require('./mouldMake').default,                 // 模板制作
  require('./emailAccept').default,               // 邮箱接收管理
  require('./messageSetting').default,            // 消息设置
  require('./modeOuputDesign').default,           // 报表模板设计
  require('./formExpand').default,           // 表单扩展设置

  require('./tenantCurrency').default,            // 租户币种
  require('./systemConfig').default,            // 系统配置

  require('./roleAuthorityDistribution').default, // 角色权限分配
  require('./accountManager').default,            // 用户角色分配
  require('./roleDataAuthority').default,         // 角色数据权限分配

  require('./defaultOutput').default,             // 默认输出模板
  require('./commonOutput').default,              // 常用输出模板
];

export default RouterHelper(prefix, title, children);
