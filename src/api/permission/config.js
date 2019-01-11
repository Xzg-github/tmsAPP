/**
 * 一级导航及侧边栏的配置信息
 * key：url的一部分
 * prefix：如果不存在，公共权限字典中资源代码的值就是key，如果存在则为`${prefix}_${key}`
 * icon: 菜单的图标名，一级导航中不存在该字段
 */

// 导航条(一级导航)
const NAV_ITEMS = [
  {key: 'order', icon: 'pld-yundan'},         // 运输订单
  {key: 'dispatch', icon: 'pld-cheliang'},    // 车辆调度
  {key: 'track', icon: 'pld-genzong'},       // 跟踪管控
  // {key: 'supervisor', icon: 'pld-jianli'},    // 监理任务 --先隐藏
  {key: 'bill', icon: 'pld-feiyong'},         // 计费与对帐
  {key: 'config', icon: 'pld-dangan'},        // 档案管理
  {key: 'platform', icon: 'pld-pingtai'},     // 平台管理
  {key: 'basic', icon: 'pld-setting'},        // 设置
  {key: 'message', icon: 'pld-message'},      // 消息通知
];

// 运输订单侧边栏
const order = [
  {key: 'input'},     // 运单录入
  {key: 'import'},    // 运单导入
  {key: 'pending'},   // 待办任务
  {key: 'complete'},  // 已办任务
  {key: 'all'},       // 运输汇总
];

// 车辆调度侧边栏
const dispatch = [
  {key: 'todo'},          // 待办任务
  {key: 'done'},          // 已办任务
];

// 监理任务侧边栏
const supervisor = [
  {key: 'waiting'},             // 待办任务
  {key: 'finish'},              // 已办任务
  {key: 'supervisor_manager'},  // 监理管理
];

// 跟踪管控侧边栏
const track = [
  {key: 'track_order'},     // 运单跟踪
  {key: 'track_transport'},     // 在途跟踪
  {key: 'file_manager'},     // 文件管理
  {key: 'task_total'},     // 任务看板
  {key: 'interface_log'},   //接口日志
];

// 应收管理子菜单
const receive_mgr = [
  {key: 'receive_make'},                // 应收费用制作
  {key: 'receive_change'},              // 应收改单
  {key: 'receive_bill'},                // 应收票结帐单
  {key: 'receive_monthly_bill'},       // 应收月结帐单
  {key: 'receive_apply'},               // 应收发票申请
];

// 应付管理子菜单
const pay_mgr = [
  {key: 'pay_make'},              // 应付费用制作
  {key: 'pay_change'},            // 应付改单
  {key: 'pay_bill'},              // 应付票结帐单
  {key: 'pay_monthly_bill'},      // 应付月结帐单
];

// 计费与对帐侧边栏
const bill = [
  {key: 'receive', children: receive_mgr},  // 应收管理
  {key: 'pay', children: pay_mgr},  // 应付管理
  {key: 'extra_apply'},             // 额外费用申请
  {key: 'append'},                  // 运单补录
];

// 组织档案子菜单
const institution_mgr = [
  {key: 'institution'},         // 组织机构
  {key: 'department'},          // 部门档案
  {key: 'user'},                // 用户档案
  {key: 'corporation'},        // 法人档案
];

// 客户管理子菜单
const customer_mgr = [
  {key: 'customersArchives'},   // 客户档案
  {key: 'customer_contact'},    // 联系人档案
  {key: 'customer_service'},    // 客服分配
  {key: 'customer_factory'},    // 收发货档案
  {key: 'customer_tax'},        // 税率档案
  {key: 'customer_cost'},       // 习惯费用项
  {key: 'customer_invoice'},       // 开票档案
];

// 供应商管理子菜单
const supplier_mgr = [
  {key: 'suppliersArchives'},   // 供应商档案
  {key: 'supplier_contact'},    // 联系人档案
  {key: 'supplier_car'},        // 车辆档案
  {key: 'supplierDriver'},      // 司机档案
  {key: 'supplierSupervisor'},  // 监理档案
  {key: 'supplier_cost'},       // 习惯费用项
  {key: 'supplier_tax'},        //供应商税率
];

// 内部档案子菜单
const inside_mgr = [
  {key: 'inside_factory'},      // 收发货档案
  {key: 'inside_car'},          // 自有车档案
  {key: 'insideDriver'},        // 自有司机档案
  {key: 'car_manager'},         // 车辆管理
  {key: 'insideSupervisor'},    // 自有监理档案
  {key: 'rate'},                // 汇率档案
  {key: 'charge_item'},         // 费用项档案
];

// 价格管理子菜单
const price_mgr = [
  {key: 'customer_price'},      // 客户价格
  {key: 'supplier_price'},      // 供应商价格
];

// 扩展功能子菜单
const expand = [
  {key: 'position'}             // 位置设置
];

// 档案管理侧边栏
const config = [
  {key: 'institution_mgr', children: institution_mgr},  // 组织档案
  {key: 'customer_mgr', children: customer_mgr},        // 客户管理
  {key: 'supplier_mgr', children: supplier_mgr},        // 供应商管理
  {key: 'inside_mgr', children: inside_mgr},            // 内部档案
  {key: 'price_mgr', children: price_mgr},              // 价格管理
  {key: 'bank'},                                        // 银行档案
  {key: 'expand', children: expand}                     // 扩展功能
];

// 开发配置子菜单
const jurisdiction_mgr = [
  {key: 'publicAuthority'},           // 公共字典权限
  {key: 'formStateConfiguration'},    // 表单状态配置
  {key: 'datalib'},                   // 导入库文件
  {key: 'dataset'},                   // 报表模板类型
  {key: 'excelOutputConfiguration'},  // excel输出配置
  {key: 'importTemplate'},            // 导入模板配置
  {key: 'messageTheme'},              // 消息主题
];

// 租户配置
const tenant_mgr = [
  {key: 'tenant'},                    // 租户档案
  {key: 'tenantapi'},                 // 租户可用API
  {key: 'tenantAuthorityDistribution'},     // 租户权限分配
  {key: 'jurisdiction_tenant_rule_types'},  // 租户数据类型分配
];

// 平台档案
const platform_mgr = [
  {key: 'sysDictionary'},         // 系统字典
  {key: 'car_type'},              // 车型档案
  {key: 'currencyFile'},          // 货币档案
  {key: 'area'},                  // 行政区档案管理
];

// 数据权限配置
const data_mgr = [
  {key: 'jurisdiction_dataRule'}, // 数据规则库
  {key: 'jurisdiction_dataType'}, // 数据类型库
];

// URL权限配置
const url_mgr = [
  {key: 'serviceManager'},      // 服务管理
  {key: 'controlManager'},      // 控制层管理
  {key: 'urlResourceLib'},      // URL库管理
  {key: 'urlResource'},         // URL资源分配
];

// 平台管理的侧边栏
const platform = [
  {key: 'tenantConfig', children: tenant_mgr},        // 租户配置
  {key: 'platformArchives', children: platform_mgr},  // 平台档案
  {key: 'jurisdiction', children: jurisdiction_mgr},  // 开发配置
  {key: 'dataPermission', children: data_mgr},        // 数据权限配置
  {key: 'urlPermission', children: url_mgr},          // URL权限配置
];


// 系统规则
const systemRule_mgr = [
  {key: 'excelConfigLib'},      // EXCEL配置库
  {key: 'mode_output_design'},  // 报表模板设计
  {key: 'fromOddDefine'} ,      // 表单单号定义
  {key: 'mouldMake'},           // 模板制作
  {key: 'SMSmail'},             // 通知账号配置
  {key: 'emailAccept'},         // 邮箱接收管理
  {key: 'messageSetting'},      // 消息设置
  {key: 'formExpand'},          // 表单扩展设置
];

// 租户规则
const tenantRule_mgr = [
  {key: 'tenantCurrency'},      // 租户币种
  {key: 'systemConfig'},        // 系统配置
];

// 权限分配
const privilege_mgr = [
  {key: 'roleAuthorityDistribution'}, // 角色权限分配
  {key: 'accountManager'},            // 用户角色分配
  {key: 'role_data_authority'},       // 角色数据权限分配
];

//用户设置
const userSettings_mgr = [
  {key: 'defaultOutput'}, // 默认输出模板
  {key: 'commonOutput'},  // 常用输出模板
];


// 设置的侧边栏
const basic = [
  {key: 'systemRule', children: systemRule_mgr},        // 系统规则
  {key: 'tenantRule', children: tenantRule_mgr},        // 租户规则
  {key: 'privilegeDispatch', children: privilege_mgr},  // 权限分配
  {key: 'userSettings', children: userSettings_mgr},    // 用户设置
];

// 业务消息子菜单
const businessMessage = [
  {key: 'msg_order'},               // 订单消息
  {key: 'msg_dispatch'},            // 派单消息
  {key: 'msg_track'},               // 跟踪消息
  {key: 'msg_abnormal'},            // 异常消息
  {key: 'msg_system'},              // 系统消息
  {key: 'messageSubscribe'}         // 消息订阅
];

//消息中心通知子菜单
const notificationMessage =[
  {key: 'sendMessageByShortMes'},   // 短信日志
  {key: 'sendMessageByEmail'}       // 邮件日志
];

// 消息通知的侧边栏
const message = [
  {key: 'businessMessage', children: businessMessage}, // 业务消息
  {key: 'businessNotification', children: notificationMessage}
];

// 所有侧边栏
const SIDEBARS = {
  order, dispatch, supervisor, track, bill, basic, config, platform, message
};

export {NAV_ITEMS, SIDEBARS};
