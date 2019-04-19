import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const SUPPLIER = '/api/config/supplier_car/search/owner'; //供应商车主下拉
const filters = [
  {key: 'supplierId', title: '车主', type:'search', required:true, searchUrl:SUPPLIER},
  {key: 'institutionId', title: '归属机构', type:'search'},
  {key: 'supervisorName', title: '监理姓名', type: 'text'},
  {key: 'enabledType', title: '状态', type: 'select', dictionary: name.ENABLED_TYPE}
];


const tableCols = [
  {key: 'supplierId', title: '车主'},
  {key: 'institutionId', title: '归属机构'},
  {key: 'supervisorName', title: '监理姓名', type: 'text'},
  {key: 'enabledType', title: '状态', dictionary: name.ENABLED_TYPE},
  {key: 'idCardNumber', title: '身份证'},
  {key: 'supervisorMobilePhone', title: '手机号码'},
  {key: 'shortNumber', title: '短号'},
  {key: 'consigneeConsignorId', title: '所属站点'},
  {key: 'driverId', title: '关联司机'},
  {key: 'attribute1', title: '备用1'},
  {key: 'attribute2', title: '备用2'},
  {key: 'attribute3', title: '备用3'},
  {key: 'otherRemark', title: '其他说明'},
  {key: 'insertUser', title: '创建人'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateUser', title: '更新人'},
  {key: 'updateTime', title: '更新时间'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'supplierSupervision_add'},
  {key: 'edit', title: '编辑', sign: 'supplierSupervision_edit'},
  //{key: 'active', title: '启用', confirm: '是否确认激活所有勾选的记录？', sign: 'supplierSupervision_enable'},
  //{key: 'invalid', title: '禁用', confirm: '是否确认失效所有勾选的记录？', sign: 'supplierSupervision_invalid'},
  {key: 'active', title: '启用', sign: 'supplierSupervision_active'},
  {key: 'inactive', title: '禁用', sign: 'supplierSupervision_inactive'},
  {key: 'del', title: '删除', sign: 'supplierSupervision_delete', confirm:'是否确定删除'},
  {key: 'import', title: '导入', sign: 'supplierSupervision_import'},
  {key: 'export', title: '导出', sign: 'supplierSupervision_export', menu: [
      { key: 'exportSearch', title: '查询导出'},
      { key: 'exportPage', title: '页面导出'},
      { key: 'templateManager', title: '模板管理'}
    ]}
];

const controls = [
  {key: 'supplierId', title: '车主', type:'search', required:true, searchUrl:SUPPLIER},
  {key: 'institutionId', title: '归属机构', type:'search'},
  {key: 'supervisorName', title: '监理姓名', type: 'text', required: true},
  {key: 'supervisorMobilePhone', title: '手机号码', type: 'text', required: true},
  {key: 'shortNumber', title: '短号', type: 'text', required: true},
  {key: 'idCardNumber', title: '监理身份证号码', type: 'text'},
  {key: 'consigneeConsignorId', title: '所属站点', type: 'search'},
  {key: 'driverId', title: '所属司机', type: 'search'},
  {key: 'otherRemark', title: '其他说明', type: 'text'},
  {key: 'attribute1', title: '备用1', type: 'text'},
  {key: 'attribute2', title: '备用2', type: 'text'},
  {key: 'attribute3', title: '备用3', type: 'text'},
  {key: 'active', title: '状态', type: 'readonly', dictionary: name.ENABLED_TYPE}
];

const index = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  description,
  searchConfig
};

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit,
  names: [name.ENABLED_TYPE]
};

export default config;
