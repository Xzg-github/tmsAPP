import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';

const supplierId = '/api/bill/pay_monthly_bill/supplierId';
const currency = '/api/bill/pay_monthly_bill/currency';


const monthOptions = [
  {value:'1',title:'1'},
  {value:'2',title:'2'},
  {value:'3',title:'3'},
  {value:'4',title:'4'},
  {value:'5',title:'5'},
  {value:'6',title:'6'},
  {value:'7',title:'7'},
  {value:'8',title:'8'},
  {value:'9',title:'9'},
  {value:'10',title:'10'},
  {value:'11',title:'11'},
  {value:'12',title:'12'},
];

const filters = [
  {key:"supplierId",title:"结算单位",type:"search",searchUrl:supplierId},
  {key:"billNumber",title:"月帐单号",type:"text"},
  {key:"orderNumber",title:"运单号",type:"text"},
  {key:"customerDelegateCode",title:"客户委托号",type:"text"},
  {key:"statusType",title:"状态",type:"select",dictionary:'status_type'},
  {key:"periodOfyear",title:"归属年",type:"select"},
  {key:"periodOfmonth",title:"归属月",type:"select",options:monthOptions},
  {key:"insertUser",title:"创建人",type:"search",searchType:'user'},
  {key:"insertTimeFrom",title:"创建时间",type:"date"},
  {key:"insertTimeTo",title:"创建时间至",type:"date"},

];


const tableCols = [
  {key:"statusType",title:"状态",dictionary:'status_type'},
  {key:"billNumber",title:"月账单号",link:true},
  {key:"supplierId",title:"结算单位"},
  {key:"currency",title:"对帐币种"},
  {key:"amount",title:"含税金额"},
  {key:"taxAmount",title:"税额"},
  {key:"periodOfyear",title:"归属年"},
  {key:"periodOfmonth",title:"归属月"},
  {key:"fallbackReason",title:"回退原因"},
  {key:"fallbackTime",title:"回退时间"},
  {key:"fileList",title:"附件"},
  {key:"fallbackUser",title:"回退用户"},
  {key:"checkTime",title:"审核人员"},
  {key:"remark",title:"详细说明"},
  {key:"insertTime",title:"创建时间"},
  {key:"insertUser",title:"创建用户"},
  {key:"updateTime",title:"更新时间"},
  {key:"updateUser",title:"更新用户"},
];

const buttons = [
  {key:"add" ,title:"新增" , bsStyle: 'primary'},
  {key:"edit" ,title:"编辑" },
  {key:"output" ,title:"输出" },
];

const controls = [
  {key: "supplierId" , title: "结算单位" , type: "search",searchUrl:supplierId,required:true},
  {key: "currency" , title: "对帐币种" , type: "search" ,searchUrl:currency,required:true},
  {key: "periodOfyear" , title: "归属年" , type: "select",required:true},
  {key: "periodOfmonth" , title: "归属月" , type: "select" ,options: monthOptions,required:true},
  {key: "amount" , title: "对帐金额" , type: "readonly"},
  {key: "remark" , title: "详细说明" , type: "textArea" ,span:2},
];

const editButtons = [
  {key: 'close', title: '关闭', confirm: '是否确定关闭?'},
  {key: 'save', title: '保存'},
];

const cols = [
  {key: 'supplierId', title: '结算单位'},
  {key: 'orderNumber', title: '运单号'},
  {key: 'amount', title: '对帐金额'},
  {key: 'customerDelegateCode', title: '委托号'},
  {key: 'customerDelegateTime', title: '委托日期'},
  {key: 'transportType', title: '运输方式',dictionary:'transport_type'},
  {key: 'carModeId', title: '车型'},
  {key: 'businessType', title: '业务类型',dictionary:'business_type'},
  {key: 'palletsNumber', title: '总卡板数'},
  {key: 'goodsNumber', title: '总数量'},
  {key: 'departure', title: '始发地'},
  {key: 'destination', title: '目的地'},
  {key: 'planPickupTime', title: '要求装货时间'},
  {key: 'planDeliveryTime', title: '要求卸货时间'},
  {key: 'carNumber', title: '车牌号'},
  {key: 'driverName', title: '司机名称'},
];


const addDialogFilters = [
  {key:"supplierId",title:"结算单位",type:"readonly"},
  {key:"currency",title:"对帐币种",type:"readonly"},
  {key:"orderNumber",title:"运单号",type:"text"},
  {key:"customerDelegateCode",title:"客户委托号",type:"text"},
  {key:"planPickupTimeFrom",title:"装货时间",type:"date"},
  {key:"planPickupTimeTo",title:"装货时间至",type:"date"},
  {key:"insertTimeFrom",title:"创建时间",type:"date"},
  {key:"insertTimeTo",title:"创建时间至",type:"date"},

];


const editDialogCols = [
  {key: 'statusType', title: '状态',dictionary:'status_type'},
  {key: 'customerId', title: '结算单位'},
  {key: 'cancelChargeId', title: '取消费用标识'},
  {key: 'chargeItemId', title: '费用名称'},
  {key: 'chargeOrigin', title: '费用来源'},
  {key: 'chargeUnit', title: '计量单位',dictionary:'charge_unit'},
  {key: 'currency', title: '币种'},
  {key: 'exchangeRate', title: '汇率'},
  {key: 'institutionId', title: '费用归属机构'},
  {key: 'isAdditional', title: '是否额外费用',dictionary:'zero_one_type'},
  {key: 'isBilled', title: '是否帐单',dictionary:'zero_one_type'},
  {key: 'netAmount', title: '净价'},
  {key: 'number', title: '数量'},
  {key: 'periodOfmonth', title: '会计月'},
  {key: 'periodOfyear', title: '会计年'},
  {key: 'price', title: '单价'},
  {key: 'relationChargeId', title: '相关费用标识'},
  {key: 'relationId', title: '关联标识'},
  {key: 'relationNumber', title: '关联编码'},
  {key: 'settlementSystemStatus', title: '对接结算系统状态',dictionary:'settlement_system_status'},
  {key: 'tax', title: '税率'},
  {key: 'taxAmount', title: '税额'},
  {key: 'taxRateWay', title: '计税方式',dictionary:'tax_rate_way'},
  {key: 'remark', title: '备注'},
  {key: 'sequence', title: '排序'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'insertUser', title: '创建人'},
  {key: 'updateTime', title: '更新时间'},
  {key: 'updateUser', title: '更新人'},
];


const colsButtons = [
  {key: 'add', title: '加入',},
  {key: 'edit', title: '编辑'},
 // {key: 'import', title: '导入'},
  {key: 'del', title: '删除'},
];


const editDialogBut = [
  {key: 'del', title: '删除', bsStyle: 'primary'},
  {key: 'join', title: '加入费用'},
];


const config = {
  index:{
    filters,
    buttons,
    tableCols,
    pageSize,
    pageSizeType,
    description,
    searchConfig,
    pageKey:'pay_monthly_bill'
  },
  edit:{
    controls,
    cols,
    colsButtons,
    buttons:editButtons
  },
  addDialog:{
    filters:addDialogFilters,
    tableCols:cols,
    pageSize,
    pageSizeType,
    description,
    searchConfig,
    buttons:[]
  },
  editDialog:{
    cols:editDialogCols,
    buttons:editDialogBut
  }
};

export default config;
