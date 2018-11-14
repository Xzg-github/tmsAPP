import name from '../../dictionary/name';

const buttons = [
  {key:'add',title:'新增', sign: 'platform_area_location_new'},
  {key:'edit',title:'编辑', sign: 'platform_area_location_edit'},
  {key:'del',title:'删除', sign: 'platform_area_location_delete'},
  {key: 'active', title: '激活', sign: 'platform_area_location_active'}
];

const tableCols =[
  {key:'locationName',title:'名称'},
  {key:'billingLocation',title:'计费地点'},
  {key:'locationType',title:'地点类别', from:'dictionary', position: name.LOCATION_TYPE},
  {key:'parentLocationId',title:'归属提还柜地'},
  {key:'locationAddr',title:'地址'},
  {key:'locationCode',title:'代码'},
  {key:'locationContact',title:'联系人'},
  {key:'locationContactPhone',title:'联系人电话'},
  {key:'active',title:'激活状态', from:'dictionary', position:name.ACTIVE}
];

const controls = [
  {key: 'districtGuid', title: '归属行政区', type: 'readonly'},
  {key: 'locationName', title: '名称', type: 'text', required:true},
  {key: 'billingLocation', title:'计费地点', type: 'search'},
  {key: 'locationCode', title: '代码', type:'text'},
  {key: 'locationAddr', title: '地址', type:'text'},
  {key:'locationContact',title:'联系人', type:'text'},
  {key:'locationContactPhone',title:'联系人电话', type:'text'},
  {key: 'parentLocationId', title: '归属提还地', type:'search'},
  {key: 'locationType', title: '地点类别', type:'select', from:'dictionary', position: name.LOCATION_TYPE},
  {key: 'longitude', title: '经度', type: 'readonly'},
  {key: 'latitude', title: '纬度', type: 'readonly'},
  {key:'active',title:'激活状态', type: 'readonly', from:'dictionary', position:name.ACTIVE}
];

const editTableCols = [
  {key: "checked", title: "", type: "checkbox"},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'languageVersion', title: '语言版本', type: 'select', from:'dictionary', position:name.LANGUAGE},
  {key: 'value', title: '名称', type: 'text'}
];

const editButtons = [
  {key:'add', title:'新增行'},
  {key:'del', title:'删除'}
];


const contactEditConfig = {
  controls,
  edit: '编辑公用地点档案',
  add: '新增公用地点档案',
  config: {ok: '确定', cancel: '取消', fence: '定义围栏'},
  tableCols: editTableCols,
  buttons:  editButtons
};

const contactConfig = {
  title:'公用地点档案',
  buttons,
  tableCols
};

export {contactConfig, contactEditConfig};
