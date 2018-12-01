import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';

const CAR_MODE = '/api/config/supplier_car/search/car_mode'; //车型下拉
const DRIVER = '/api/config/supplier_car/search/driver'; //司机下拉
const SUPPLIER = '/api/config/supplier_car/search/trailer'; //供应商托车行下拉

const filters = [
  {key: 'supplierId', title: '所属供应商', type: 'search',searchType:'supplier'},
  {key: 'carModeId', title: '车型', type: 'search',searchUrl:CAR_MODE},
  {key: 'carNumber', title: '车牌号', type: 'text'},
  {key: 'companyHeader', title: '车辆抬头公司',type: 'text'},
  {key: 'drivingLicenseNumber', title: '行驶证号',type: 'text'},
  {key: 'enabledType', title: '状态', type: 'select',dictionary:"enabled_type"},
];

const buttons = [
  {key: 'add', title: '新增',bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'enable', title: '启用'},
  {key: 'disable', title: '禁用'},
  {key: 'import', title: '导入'},
  {key:'export',title:'导出', menu: [{key:'searchExport',title:'查询导出'}
    ,{key:'pageExport',title:'页面导出'}]},
];

const tableCols = [
  {key: 'enabledType', title: '状态', dictionary: 'enabled_type'},
  {key: 'supplierId', title: '所属供应商'},
  {key: 'carModeId', title: '车型'},
  {key: 'carNumber', title: '车牌号'},
  {key: 'driverId', title: '司机标识'},
  {key: 'companyHeader', title: '车辆抬头公司'},
  {key: 'companyHeaderAddress', title: '牌头地址'},
  {key: 'companyHeaderContactPeople', title: '牌头联系人'},
  {key: 'companyHeaderContactPhone', title: '牌头联系电话'},
  {key: 'carWeight', title: '车身重量（吨）'},
  {key: 'trailerWeight', title: '拖架重量（吨）'},
  {key: 'engineNumber', title: '发动机号'},
  {key: 'electronicLockNumber', title: '电子关锁号'},
  {key: 'trailerModel', title: '拖架型号'},
  {key: 'drivingLicenseNumber', title: '行驶证号'},
  {key: 'compulsoryInsurance', title: '交强险号'},
  {key: 'compulsoryInsuranceTime', title: '交强险日期'},
  {key: 'commerciaInsurance', title: '商业险号'},
  {key: 'commerciaInsuranceTime', title: '商业险日期'},
  {key: 'capacityWeight', title: '载重量'},
  {key: 'gpsEquipmentBrand', title: 'GPS设备品牌',dictionary:"gps_equipment_brand"},
  {key: 'gpsSimNumber', title: 'GPS设备SIM卡号'},
  {key: 'fuelType', title: '燃油种类',dictionary:"fuel_type"},
  {key: 'companyCode', title: '企业代码'},
  {key: 'remark', title: '其它说明'},
];

const controls = [
  {key: 'supplierId', title: '所属供应商',type:'search',searchUrl:SUPPLIER,required:true},
  {key: 'isOwner', title: '是否自有',type:'readonly',dictionary:'zero_one_type',required:true},
  {key: 'carModeId', title: '车型',type:'search',required:true,searchUrl:CAR_MODE},
  {key: 'carNumber', title: '车牌号',type:'text',required:true},
  {key: 'driverId', title: '司机标识',type:'search',required:true,showAdd:true,searchUrl:DRIVER,props:{searchWhenClick:true}},
 // {key: 'institutionId', title: '归属机构',type:'search',searchType:'institution'},
  {key: 'companyHeader', title: '车辆抬头公司',type:'text',required:true},
  {key: 'companyHeaderAddress', title: '牌头地址',type:'text'},
  {key: 'companyHeaderContactPeople', title: '牌头联系人',type:'text',required:true},
  {key: 'companyHeaderContactPhone', title: '牌头联系电话',type:'text',required:true},
  {key: 'carWeight', title: '车身重量（吨）',type:'number',props:{real:true,precision:2}},
  {key: 'trailerWeight', title: '拖架重量（吨）',type:'number',props:{real:true,precision:2}},
  {key: 'engineNumber', title: '发动机号',type:'text'},
  {key: 'electronicLockNumber', title: '电子关锁号',type:'text'},
  {key: 'trailerModel', title: '拖架型号',type:'text'},
  {key: 'drivingLicenseNumber', title: '行驶证号',type:'text',required:true},
  {key: 'compulsoryInsurance', title: '交强险号',type:'text'},
  {key: 'compulsoryInsuranceTime', title: '交强险日期',type:'date'},
  {key: 'commerciaInsurance', title: '商业险号',type:'text',required:true},
  {key: 'commerciaInsuranceTime', title: '商业险日期',type:'date'},
  {key: 'capacityWeight', title: '载重量',type:'number',props:{real:true,precision:2}},
  {key: 'gpsEquipmentBrand', title: 'GPS设备品牌',type:'select',dictionary:"gps_equipment_brand"},
  {key: 'gpsSimNumber', title: 'GPS设备SIM卡号',type:'text'},
  {key: 'fuelType', title: '燃油种类',type:'select',dictionary:"fuel_type"},
  {key: 'companyCode', title: '企业代码',type:'text'},
  {key: 'remark', title: '其它说明',type:'textArea',span:2},
];

const config = {
  pageSize,
  pageSizeType,
  description,
  searchConfig,
  filters,
  buttons,
  tableCols,
  pageKey: 'supplier_car',
  edit: {
    controls,

  },
  dictionary: ['enabled_type','zero_one_type','gps_equipment_brand','fuel_type']
};

export default config;
