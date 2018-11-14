import name from './name';

const active = [
  {value: '0', title: '未激活'},
  {value: '1', title: '已激活'},
  {value: '2', title: '已失效'}
];

const checkStatus = [
  {value: '0', title: '未审核'},
  {value: '1', title: '已审核'}
];

const orderStatus = [
  {value: '0', title: '草稿'},
  {value: '1', title: '待处理'},
  {value: '2', title: '待处理'},
  {value: '3', title: '待完善'},
  {value: '4', title: '删除'}
];

const submitStatus = [
  {value: '0', title: '待提交'},
  {value: '1', title: '待接受'},
  {value: '2', title: '已接受'},
  {value: '3', title: '人工放行'},
];

const goodsDirection = [
  {value: '1', title: '正向'},
  {value: '2', title: '反向'}
];

const packagingUnit = [
  {value: '1', title: '箱'},
  {value: '2', title: '件'}
];

const transMode = [
  {value: '1', title: '整车'},
  {value: '2', title: '零担'}
];

const status = [
  {value: '0', title: '草稿'},
  {value: '1', title: '待处理'},
  {value: '2', title: '激活'},
  {value: '3', title: '待完善'},
  {value: '4', title: '删除'}
];

const yesOrNo = [
  {value:1, title:'是'},
  {value:0, title:'否'}
];

const chargeType = [
  {value:'0', title:'费用类型1'},
  {value:'1', title:'费用类型2'}
];

const taskType = [
  {value:'0', title:'业务属性1'},
  {value:'1', title:'业务属性2'}
];

const responsible = [
  {value:'0', title:'客户问题'},
  {value:'1', title:'供应商问题'}
];

const customsType = [
  {value:'self', title:'自报关'},
  {value:'other', title:'其他'}
];

const tenantType = [
  {value: '0', title: '货主'},
  {value: '1', title: '物流公司'},
  {value: '2', title: '承运商'}
];

const genDictionary = (num = 3) => {
  const result = [];
  for (let i = 0; i < num; i++) {
    result.push({value: `${i}`, title: `${i}`});
  }
  return result;
};

const dictionary = {
  [name.ACTIVE]: active,
  [name.CHECK]: checkStatus,
  [name.ORDER_STATUS]: orderStatus,
  [name.SUBMIT_STATUS]: submitStatus,
  [name.DIRECTION]: goodsDirection,
  [name.CONSIGNMENT]: genDictionary(),
  [name.SIGN_DOCUMENTS]: genDictionary(),
  [name.PACKEGING_UNIT]: packagingUnit,
  [name.HANDOVER_MODE]: packagingUnit,
  [name.BONDED_TRADE_MODE]: genDictionary(),
  [name.BONDED_SUPERVISION_MODE]: genDictionary(),
  [name.CONTAINER_LOCATION]: genDictionary(),
  [name.TRANSPORTATION_CLAUSE]: genDictionary(),
  [name.PAYMENT_METHOD]: genDictionary(),
  [name.VGM_WEIGH]: genDictionary(),
  [name.GENERIC_WEIGH]: genDictionary(),
  [name.WEIGH]: genDictionary(),
  [name.ORDER_TYPE]: genDictionary(),
  [name.CUSTOMS_TYPE]: customsType,
  [name.QUARANTINE_MODE]: genDictionary(),
  [name.SEAMLESS]: genDictionary(),
  [name.HIGHWAY]: genDictionary(),
  [name.NUMBER_TYPE]: genDictionary(),
  [name.TRANS_MODE]: transMode,
  [name.STATUS]: status,
  [name.YES_OR_NO]: yesOrNo,
  [name.CHARGE_TYPE]: chargeType,
  [name.TASK_TYPE]: taskType,
  [name.TAX_TYPE]: genDictionary(),
  [name.CHARGE_UNIT]: genDictionary(),
  [name.RESPONSIBLE]: responsible,
  [name.REASON_TYPE]: genDictionary(),
  [name.CHARGE_DIRECTION]: genDictionary(),
  [name.TRANSPORT_DIRECTION]: genDictionary(),
  [name.SEA_BILL_TYPE]: genDictionary(),
  [name.AIR_TRANSPORT_DIRECTION]: genDictionary(),
  [name.AIR_FILE]: genDictionary(),
  [name.AIR_TRANSPORTATION_CLAUSE]: genDictionary(),
  [name.PICKUP_DELIVERY]: genDictionary(),
  [name.SEA_TRANSPORTATION_CLAUSE]: genDictionary(),
  [name.IMPORT_EXPORT_TYPE]: genDictionary(),
  [name.AGENT_SERVICE_TYPE]: genDictionary(),
  [name.WAREHOUSE_OPERATION_TYPE]: genDictionary(),
  [name.TENANT_TYPE]: tenantType,
  [name.CONTAINER_TYPE]: genDictionary(),
  [name.HBL_MBL_TYPE]: genDictionary(),
  [name.DELIVERY_TERMS]: genDictionary(),
  [name.TELEX_RELEASED_LADING_ORIGINAL_BILL]: genDictionary(),
  [name.TRACE_TYPE]: genDictionary()
};

export default dictionary;
