import name from '../../dictionary/name';

const buttons = [
  {key:'add',title:'新增', sign: 'platform_area_place_new'},
  {key:'edit',title:'编辑', sign: 'platform_area_place_edit'}
];

const tableCols =[
  {key:'placeName',title:'运输地点名称'},
  {key: 'placeNameEnglish', title: '运输地点英文名称'},
  {key:'placeCode',title:'运输地点编码'},
  {key:'internationalCode',title:'运输地点国际代码'},
  {key:'longitude',title:'经度'},
  {key:'latitude',title:'纬度'},
  {key:'placeType',title:'地点类别', dictionary: name.ADDR_TYPE}
];

const controls = [
  {key: 'districtGuid', title: '归属行政区',type:'readonly'},
  {key: 'placeName', title:'运输地点名称', type:'text', required:true},
  {key: 'placeNameEnglish', title: '运输地点英文名称', type:'text'},
  {key: 'placeCode', title: '运输地点编码', type:'text'},
  {key: 'internationalCode', title: '运输地点国际代码', type:'text'},
  {key: 'longitude', title: '经度', type: 'readonly'},
  {key: 'latitude', title: '纬度', type: 'readonly'},
  {key: 'placeType', title: '地点类别', type:'select', props: {mode: 'multiple'}, dictionary: name.ADDR_TYPE, required:true}
];

const editTableCols = [
  {key: "checked", title: "", type: "checkbox"},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'languageVersion', title: '语言版本', type: 'select', dictionary:name.LANGUAGE},
  {key: 'value', title: '运输地点名称', type: 'text'}
];

const editButtons = [
  {key:'add', title:'新增行'},
  {key:'del', title:'删除'}
];


const siteEditConfig = {
  controls,
  edit: '编辑运输地点档案',
  add: '新增运输地点档案',
  config: {ok: '确定', cancel: '取消', fence: '定义围栏'},
  tableCols: editTableCols,
  buttons:  editButtons
};

const siteConfig = {
  title:'运输地点档案',
  buttons,
  tableCols
};

export {siteConfig, siteEditConfig};
