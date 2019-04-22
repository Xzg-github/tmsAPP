
const name = {
  ACTIVE: 'active',       // 激活状态
  CHECK: 'check_status',  // 审核状态
  RECEIVE_ORDER_STATUS: 'order_receive_status', // 待接订单状态
  INPUT_ORDER_STATUS: 'order_create_status', // 订单录入状态
  SPLIT_ORDER_STATUS: 'order_split_status',  // 订单拆分状态
  JOB_ORDER_STATUS: 'order_maintain_status', // 订单维护状态
  DIRECTION: 'goods_direction', //货物流向
  CONSIGNMENT: 'consignment_note', //随货单据
  SIGN_DOCUMENTS: 'sign_documents', //签收单证要求
  PACKEGING_UNIT: 'packaging_unit', //包装单位
  HANDOVER_MODE: 'HANDOVER_MODE', //货物交接方式
  BONDED_TRADE_MODE: 'bonded_trade_mode', //保税贸易方式
  BONDED_SUPERVISION_MODE: 'bonded_supervision_mode', //保税监管方式
  CONTAINER_LOCATION: 'container_location', //集装箱摆货要求/摆尾要求
  TRANSPORTATION_CLAUSE: 'air_transportation_clause',//客户运输条款
  PAYMENT_METHOD: 'payment_method',//客户付款方式
  VGM_WEIGH: 'vgm_weighing_method',//VGM过磅方式
  GENERIC_WEIGH: 'weighing_method',//普通过磅方式
  WEIGH: 'weighing_method',//普通过磅方式
  CUSTOMS_TYPE: 'customs_type',//报关方式
  QUARANTINE_MODE: 'quarantine_mode',//检疫方式
  SEAMLESS: 'seamless_customs_clearance',//无缝清关
  SIGN_SEND: 'sign_bill_send', //签收单送交
  HIGHWAY: 'highway_manifest',//公路舱单
  NUMBER_TYPE: 'csnum_type',//客户单号种类
  TRANS_MODE_MAINLAND: 'mainland_transportation_mode', //国内运输模式
  TRANS_MODE_PORT: 'port_transportation_mode', //港口运输模式
  SEA_BILL_TYPE: 'SEA_BILL_TYPE', //客户提单类型
  AIR_TRANSPORT_DIRECTION: 'air_transport_direction', //运输方向
  AIR_FILE: 'air_file', //航空随机文件
  AIR_TRANSPORTATION_CLAUSE: 'air_transportation_clause', //空运运输条款
  PICKUP_DELIVERY: 'PICKUP_DELIVER', //提货/派送
  SEA_TRANSPORTATION_CLAUSE: 'air_transportation_clause', //海运运输条款
  IMPORT_EXPORT_TYPE: 'import_export_type', //进出口类型
  AGENT_SERVICE_TYPE: 'agent_service_type', //代办服务类型
  WAREHOUSE_TYPE: 'warehouse_type',//仓库操作
  WAREHOUSE_OPERATION_TYPE: 'warehouse_operation_type', //库内操作类型
  STATUS: 'status', //所有状态
  YES_OR_NO: 'true_false_type', //是否
  CHARGE_TYPE: 'charge_type', // 费用类型
  TASK_TYPE: 'task_type', // 业务属性
  TAX_TYPE: 'tax_rate_way', //计税方式
  CHARGE_UNIT: 'charge_unit', //计量单位
  RESPONSIBLE: 'responsible_party', // 责任方
  REASON_TYPE: 'occurrence_class', // 发生类别
  CHARGE_DIRECTION: 'chargeDirection', // 费用方向
  TENANT_TYPE: 'tenant_type', // 租户类别
  CONTAINER_TYPE: 'container_type', // 柜车类型
  LANGUAGE: 'language_version', // 语言版本
  ADDR_TYPE: 'place_type', // 运输地点类别
  LOCATION_TYPE: 'location_type', // 地点联系人地点类别
  BALANCE_WAY: 'balance_way', // 结算方式
  BALANCE_CURRENCY: 'balance_currency_type',  // 结算币种
  CONTACT_TYPE: 'contact_type', // 联系人类型
  SEX: 'sex_type',  // 性别
  STATUS_TYPE: 'status_type',   // 费用状态
  GOODS_TYPE: 'goods_category', // 货物类别
  CANVASSION_MODE: 'canvassion_mode', // 揽货方式
  CHANGE_SHEET_REASON: 'change_sheet_reason', // 改单原因
  SUPPLIER_BUSINESS_TYPE: 'supplier_business_type',  // 供应商业务类型
  PLAN_STATUS: 'logistics_order_plan_status', // 物流计划状态
  DISPATCH_STATUS: 'delivery_order_status',  // 派单中心状态
  HBL_MBL_TYPE: 'hbl_mbl_type', // 空运提单hbl方式
  DELIVERY_TERMS: 'delivery_terms', //空运放货方式
  TELEX_RELEASED_LADING_ORIGINAL_BILL: 'telex_released_lading_original_bill', // 电放或者正本
  TRACE_TYPE: 'trace_type', // 跟踪单类型
  OPERATION_CONDITION_TYPE: 'operation_condition_type',
  LLP_TRANSPORTATION_MODE: 'llp_transportation_mode', // LLP运输方式
  BALANCE_CURRENCY_TYPE: 'balance_currency_type', // LLP结算币种
  CUSTOMER_CONTACTS_CATEGORY: 'customer_contacts_category', // LLP客户联系人类别
  SUPPLY_CONTACTS_CATEGORY: 'supply_contacts_category', // LLP供货商联系人类别
  LLP_TRANSPORTATION_CLAUSE: 'llp_transportation_clause', // LLP贸易条款
  PRODUCT_CATEGORY : 'product_category', // LLP品类
  BOOK_MATCH_ORDER_TYPE: 'book_match_order_type', // 预约匹配类型
  ORDER_FROM: 'order_from', // LLP订单来源
  GOODS_CATEGORY:'goods_category', //货物类别
  CHARGE_ID: 'charge_id', //费用名称
  CHARGE_MEASURE_UNIT_ID: 'charge_measure_unit_id', //划分物流责任计量单位
  COLLECT_REMIT_TYPE: 'collect_remit_type', //llp 划分物流责任费用类型
  COMPONENT_TYPE: 'component_type',//数据类型
  MATERIAL_ATTRIBUTE: 'materiel_attribute_label',//多语言标签
  BUSINESS_ORDER:  'business_order_type',//商流订单类别
  BOOKING_TYPE: 'order_booking_type',//预约订单类别
  MATCH_MODEL: 'book_match_model',//匹配方式
  SHIPMENT_SCHEDULE_STATUS_TYPE: 'shipment_schedule_status_type', // 出货预约状态
  INVOICE_TYPE: 'invoice_type',  // 发票类型
  INVOICE_CATEGORY: 'invoice_category', // 发票种类
  LOGISTICS_RESPONSIBILITY_TYPE: 'logistics_responsibility_type', // 物流责任
  LLP_LOGISTICS_ORDER_TYPE: 'llp_Logistics_order_type',//llp物流订单类型
  LLP_STATUS: 'status_type', //LLP订单状态
  EXCEPTION_CATEGORY: 'exception_category', // 异常大类
  EXCEPTION_OWNER: 'exception_owner', // 异常责任人
  EXCEPTION_RELATION_TYPE: 'exception_relation_type', //异常关联单类型,
  FILE_TYPE: 'file_type', // 文件类型
  VALUE_ADDED_SERVICE: 'value_added_service', //增值服务类型
  FREIGHT_COLLECT_APPLICATION: 'freight_collect_application', // 到付申请状态
  CHARGE_ORIGIN: 'charge_origin', // 费用来源
  BARGE_TYPE: 'barge_type', //驳船类型
  TRANSFER_MODE: 'transfer_mode', //驳船中转方式
  BARGE_CONTAINER_TYPE: 'barge_container_type', //驳船货柜类别
  CROSSDOCKING_TRANSPORT_TYPE: 'crossdocking_transport_type', //越库运输类型
  BUSINESS_ORDER_TYPE: 'business_order_type', //商流订单类型
  TABLE_NUMBER_TYPE: 'table_number_type',
  DISMANTLE_LOAD_TYPE: 'dismantle_load_type', //拆装卸类型
  LOAD_WAY: 'load_way', //装船方式
  JOB_WAY: 'job_way', //作业方式
  RELEASE_STATUS: 'release_status', //放货状态
  CURRENCY: 'currency',
  LOGISTICS_ORDER_TYPE: 'logistics_order_type', //订单类型，物流订单主单字段,
  OPERATION_TYPE: 'operation_type', // 运输模式
  RELATION_TABLE: 'relation_table', //关联规则表
  PREPAY_CURRENCY: 'prepay_currency', //代垫币种
  PAYMENT_WAY: 'payment_way', //代垫付款方式
  TASK_UNIT_STATUS: 'task_unit_status', //作业单元状态
  REQUEST_METHOD:'requestMethod' ,//请求方式
  REQUIRE_TYPE: 'special_require_type', //特殊要求类别
  SPECIAL_CARGO_TYPE: 'special_cargo_type', //特殊货物类型
  SPECIAL_CAR_TYPE: 'special_car_type', //特种车类型
  BACK_ORDER: 'back_order', //推单
  TENANT_LOCATION_TYPE: 'tenant_location_type', // 租户地点类型
  GOODS_CLASSIFICATION: 'goods_classification', //货物分类
  LEG_CLASSIFICATION: 'leg_classification', //作业环节
  PICKUP_DELIVERY_MODE: 'pickup_delivery_mode', //提送货方式
  RETAIL_BUSINESS_CLASSIFICATION: 'retail_business_classification', //业务分类
  CUSTOMER_PAY_INTENTION:'customer_pay_intention',//客户支付意向
  RULE_TYPE: 'rule_type', //规则类型
  LOAD_UNLOAD_TYPE_RAILWAY: 'load_unload_type_railway', //装卸方式-火车
  MECHANICAL_TYPE: 'mechanical_type',	//机械类型
  LOAD_UNLOAD_TYPE_TRUCK: 'load_unload_type_truck', //装卸方式-汽车
  QUERY_GROUP: 'query_group', //查询组合
  OPERATION_TEAM: 'operation_team', //作业班组
  RENEWAL_MODE: 'renewal_mode', //改单类别
  LOAD_UNLOAD_TYPE: 'load_unload_type', //装卸类型
  SUPPLIER_TYPE: 'supplier_type',//供应商类型
  CUSTOMER_TYPE: 'customer_type',//客户类型
  BUSINESS_VARIETY: 'business_variety', //业务品种
  OPERATION_WAY: 'operation_way',//操作方法
  EXCEL_REPORT_GROUP: 'excel_report_group',//报表组
  INTERFACE_STATUS: 'interface_status',//对接状态
  REPORT_OUTPUT_TYPE:'report_output_type' ,//输出类型
  INCOME_COST_TYPE: 'income_cost_type', //结算类型
  OTHER_PRODUCT_TYPE: 'other_product_type', //单据类型
  NOTIFY_TYPE: 'notify_type', //通知类型
  UPLOAD_STATE: 'upload_state', //附件状态
  FILE_STAUS: 'file_status', //文件状态
  PORT_OPERATION_TEAM: 'port_operation_team', //码头作业班组
  RECEIVE_STATE: 'receive_state', //资料回收
  APPOINTMENT_QUERY_STATUS: 'appointment_query_status', //预约查询状态
  MAIL_SEND_TYPE: 'mail_send_type', //发送方式
  MODEL_TYPE: 'model_type', //模板类别
  APPORTIONMENT_RULE: 'apportionment_rule', //分摊规则
  SPLIT_TYPE: 'splitType', //货量拆分类别
  SYNCHRONIZATION_STATUS: 'synchronization_status', //同步状态
  PRICE_CATEGORY_TYPE:'priceCategoryType',//合同类别
  SUB_TASK_UNIT: 'sub_Task_Unit' ,        //国内运输子任务
  NODE_CLASSIFY_TYPE:'lifecycle_type', //节点类型,
  LIFE_STYLE_NODE_APP:"lifecycle_node_app",
  PRICE_MODE:'price_mode',//报价模式
  HANDLE_GOODS_TYPE: "handle_goods_type", //货物处理方式
  TRUE_FALSE_TYPE:"true_false_type", //是否
  IS_MULTIPLE_GOODS: 'is_multiple_goods', //异常原因
  WAREHOUSE_TYPE1: 'warehouse_attribution_type',  //仓库类型
  BARCODE_UNIT: 'barcode_unit',   //条形码单位,
  SEASHUTTLEBUSTYPE: 'seaShuttlebustype',  //海运穿梭巴士类型
  UPLOAD_MODE: 'upload_mode', //导入模式,
  APP_TYPE: 'app_type', //App类型
  LIFECYCLE_TYPE: 'lifecycle_multipoint_type', //装卸货类型
  CHARGE_FROM: 'charge_from', //	改单额外费用来源

  ENABLED_TYPE: 'enabled_type', //客户档案--状态
  COMPANY_TYPE: 'company_type', //客户档案--类型
  COMPANY_LEVEL: 'company_level', //客户档案--级别
  Y_OR_N: 'zero_one_type', //是/否(0/1)
  LOGISTICS_COMPANY_TYPE: 'logistics_company_type', //物流公司档案档案--类型
  COST_TYPE: 'cost_type',           //付款单类型
  INCOME_TYPE: 'income_type',       //收款单类型

  TABLE_PROPERTY_TYPE: 'table_property_type', //扩展备用字段表单
  INBOUND_TYPE: 'inbound_type', //入库类型
  OUTBOUND_TYPE: 'outbound_type', //入库类型

  DELIVERY_TYPE: 'delivery_type', //采购退货单--交货方式
  RETURN_TYPE: 'return_type', //采购退货单--退货方式
  ZERO_ONE_TYPE: 'zero_one_type', //采购退货单--是否保价/险购买
  PURCHASE_RESPONSIBILITY: 'purchase_responsibility', //采购退货单--物流/保险责任
  SALE_RESPONSIBILITY: 'sale_responsibility', //销售退货单--物流/保险责任
  APPOINTMENT_TYPE: 'appointment_type', //采购退货单--预约方式
  COMMODITY_UNIT: 'commodity_unit', //采购退货单--基本单位

  PAYMENT_TYPE: 'payment_type', //支付方式

  SALE_ORDER_TYPE: 'sale_order_type', //订单类别

  PACKAGE_UNIT: 'package_unit', //erp-包装单位,

  CONSIGNEE_CONSIGNOR_TYPE: 'consignee_consignor_type', //收发货人类型
  BUSINESS_TYPE: 'business_type',  //业务类型
  TAX_RATE_WAY: 'tax_rate_way',     //计税方式
  ZERO_ONE: 'zero_one_type', //是否（0/1）
  TRANSPORT_TYPE: 'transport_type', //运输方式
  RESPONSIBLE_PARTY: 'responsible_party', //责任方
  TASK_TYPE_FILE: 'task_type_file',  //文件任务
  CAR_STATE: 'car_state', //车辆状态,

  FUEL_TYPE: 'fuel_type', //燃油种类,
  NUMBER_SOURCE: 'number_source', //数量源
  CAR_STATE: 'car_state', //车辆状态
  CUSTOMER_INFORMATION_FEEDBACK: 'customer_information_feedback', //客户信息反馈类型
  CONTRACT_ROLES: 'contract_roles', //签署角色
  EXPENSE_OUTPUT_TYPE: 'expense_output_type', //产值报销类型
  SETTLEMENT_SYSTEM_STATUS: 'settlement_system_status', //对接状态
};

export default name;
