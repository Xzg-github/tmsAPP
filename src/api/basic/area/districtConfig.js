import name from '../../dictionary/name';

const buttons = [
  {key:'add',title:'新增', sign: 'platform_area_district_new'},
  {key:'edit',title:'编辑', sign: 'platform_area_district_edit'}
];

const tableCols =[
  {key:'districtName',title:'名称'},
  {key:'districtCode',title:'编码'},
  {key:'districtInternationalCode',title:'国际代码'}
];

const controls = [
  {key: 'parentDistrictGuid', title: '上级',type:'readonly'},
  {key: 'districtName', title: '行政区名称', type: 'text', required:true},
  {key: 'districtCode', title: '行政区编码', type: 'text'},
  {key: 'districtInternationalCode', title: '国际代码', type: 'text'}
];

const editTableCols = [
  {key: "checked", title: "", type: "checkbox"},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'languageVersion', title: '语言版本', type: 'select', from:'dictionary', position:name.LANGUAGE},
  {key: 'value', title: '行政区名称', type: 'text'}
];

const editButtons = [
  {key:'add', title:'新增行'},
  {key:'del', title:'删除'}
];

const districtEditConfig = {
  controls,
  edit: '编辑行政区档案',
  add: '新增行政区档案',
  config: {ok: '确定', cancel: '取消'},
  tableCols: editTableCols,
  buttons:  editButtons
};

const districtConfig = {
  title: '行政区档案',
  buttons,
  tableCols
};

export {districtConfig, districtEditConfig};
