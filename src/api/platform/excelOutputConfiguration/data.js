import name from '../../dictionary/name';


const options = [
  {value:'text',title:'文本'},
  {value:'search',title:'下拉搜索'},
  {value:'readonly',title:'只读'},
  {value:'dictionary',title:'字典'},
  {value:'select',title:'自定义下拉'},
  {value:'number',title:'数值'},
  {value:'date',title:'日期'},
  {value:'textArea',title:'文本域'},
];


const controls = [
  {key: 'parameterKey', title: '标签key',type: 'text',required:true},
  {key: 'parameterName', title: '标签名称',type: 'text',required:true},
  {key: 'componentType', title: '组件类型',type: 'select',options,required:true},
  {key: 'dataSrc', title: '数据源',type: 'readonly'},
  {key: 'sequence', title: '排序',type: 'number',required:true}
];

const buttons = [
  {key: 'add', title: '新增'},
  {key: 'delete', title: '删除'}
];

const buttons1 = [
  {key: 'add1', title: '新增'},
  {key: 'delete1', title: '删除'}
];

const tableCols1 = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'attributeKey', title: '属性', type: 'text'},
  {key: 'attributeName', title: '属性值', type: 'text'},
];

const tableCols2 = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'languageVersion', title: '语言', type: 'select',from:'dictionary', position:name.LANGUAGE},
  {key: 'languageValue', title: '语言值', type: 'text'},
];


const edit = {
  controls,
  buttons,
  buttons1,
  tableCols1,
  tableCols2,
  tableItems1: [],
  tableItems2: [],
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const data = {
  edit,
};

export default data;



