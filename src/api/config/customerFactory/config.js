import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'customerId', title: '所属客户', type: 'search'},
  {key: 'name', title: '名称', type: 'text'},
  {key: 'code', title: '编码', type: 'text'},
  {key: 'shortName', title: '简称', type: 'text'},
  {key: 'englishName', title: '英文名称', type: 'text'},
  {key: 'enabledType', title: '状态', type: 'select', dictionary: name.ENABLED_TYPE}
];

const tableCols = [
  {key: 'name', title: '名称', required: true},
  {key: 'enabledType', title: '状态', dictionary: name.ENABLED_TYPE, required: true},
  {key: 'customerId', title: '所属客户', required: true},
  {key: 'shortName', title: '简称'},
  {key: 'englishName', title: '英文名称'},
  {key: 'code', title: '编码'},
  {key: 'country', title: '国家'},
  {key: 'province', title: '省份'},
  {key: 'city', title: '城市'},
  {key: 'district', title: '行政区'},
  {key: 'street', title: '街道'},
  {key: 'address', title: '地址'},
  {key: 'chargingPlaceId', title: '计费地点'},
  {key: 'consigneeConsignorType', title: '类别', dictionary: name.CONSIGNEE_CONSIGNOR_TYPE},
  {key: 'insertTime', title: '创建时间'},
  {key: 'insertUser', title: '创建用户'},
  {key: 'updateTime', title: '更新时间'},
  {key: 'updateUser', title: '更新用户'}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'cutomerFactory_add'},
  {key: 'edit', title: '编辑', sign: 'cutomerFactory_edit'},
  {key: 'enable', title: '启用', sign: 'cutomerFactory_enable'},
  {key: 'disable', title: '禁用', sign: 'cutomerFactory_disable'},
  {key: 'delete', title: '删除', sign: 'cutomerFactory_delete', confirm: '是否删除选中记录'},
  {key: 'import', title: '导入', sign: 'cutomerFactory_import'},
  {key: 'export', title: '导出', sign: 'cutomerFactory_export'},
  {key: 'config', title: '配置字段', sign: 'cutomerFactory_config'}
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

const controls = [
  {key: 'customerId', title: '所属客户', type: 'search', required: true},
  {key: 'name', title: '名称', type: 'text', required: true},
  {key: 'shortName', title: '简称', type: 'text', required: true},
  {key: 'englishName', title: '英文名称', type: 'text'},
  {key: 'code', title: '编码', type: 'text'},
  {key: 'country', title: '国家', type: 'search',  required: true,
    props: {searchWhenClick: true, noSearchWhenTypo: true}},
  {key: 'province', title: '省份', type: 'search', required: true,
    props: {searchWhenClick: true, noSearchWhenTypo: true}},
  {key: 'city', title: '城市', type: 'search', required: true,
    props: {searchWhenClick: true, noSearchWhenTypo: true}},
  {key: 'district', title: '行政区', type: 'search',
    props: {searchWhenClick: true, noSearchWhenTypo: true}},
  {key: 'street', title: '街道', type: 'search',
    props: {searchWhenClick: true, noSearchWhenTypo: true}},
  {key: 'chargingPlaceId', title: '计费地点', type: 'search', required: true},
  {key: 'fixedWaitingTime', title: '固定等待时长', type: 'number'},
  {key: 'address', title: '详细地址', type: 'text', span: 2, required: true},
  {key: 'longitude', title: '经度', type: 'readonly'},
  {key: 'latitude', title: '纬度', type: 'readonly'},
  {key: 'fenceRadius', title: '半径', type: 'number'},
  {key: 'fenceShape', title: '形状', type: 'number'},
  {key: 'consigneeConsignorType', title: '类别', type: 'select', dictionary: name.CONSIGNEE_CONSIGNOR_TYPE},
  {key: 'customerFactoryRemark', title: '装卸货注意事项', type: 'textArea', span: 4},
  {key: 'dispatchRemark', title: '调度注意事项', type: 'textArea', span: 4},
  {key: 'remark', title: '备注', type: 'textArea', span: 4},
];

const editTableCols = [
  {key: "checked", title: "", type: "checkbox"},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'contactName', title: '联系人', type: 'text', required: true},
  {key: 'contactTelephone', title: '联系人电话', type: 'text', required: true},
  {key: 'contactEmail', title: '联系人邮箱', type: 'text'},
  {key: 'contactFax', title: '联系人传真', type: 'text'},
];

const editButtons = [
  {key:'add', title:'新增行'},
  {key:'del', title:'删除'}
];

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消', fence: '定义围栏'},
  tableCols: editTableCols,
  buttons:  editButtons
};

const config = {
  index,
  edit,
  names: [name.ENABLED_TYPE, name.CONSIGNEE_CONSIGNOR_TYPE]
};

export default config;
