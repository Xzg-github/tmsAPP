import name from '../../dictionary/name';

const buttons = [
  {key:'add',title:'新增'},
  {key:'edit',title:'编辑'},
  {key:'active',title:'激活'},
  {key:'del',title:'删除'}
];


const tableCols = [
  {key: 'dictionaryCode', title: '字典标识'},
  {key: 'dictionaryName', title: '字典名称'},
  {key: 'parentDictionaryCode', title: '所属字典'},
  //{key: 'producTypeLevel', title: '级别'},
  {key: 'insertDate', title: '创建时间'},
  {key: 'updateDate', title: '更新时间'},
  {key: 'remark', title: '内容描述'},
  {key: 'attribute1', title: '备注字段1'},
  {key: 'attribute2', title: '备注字段2'},
  {key: 'attributeNumber1', title: '备用数值1'},
  {key: 'attributeNumber2', title: '备用数值2'},
  {key: 'active', title: '激活状态', dictionary: name.ACTIVE}
];

const controls = [
  {key: 'dictionaryCode', title: '字典标识', type: 'text', required: true},
  {key: 'dictionaryName', title: '字典名称', type: 'text', required: true},
  {key: 'parentDictionaryCode', title: '所属字典', type: 'readonly', required: true},
  //{key: 'parentDictionaryCode', title: '父级类型', type: 'readonly', required:true},
  //{key: 'producTypeLevel', title: '级别', type: 'readonly', required:true},
  //{key: 'taskUnitTypeName', title: '排序', type: 'text', required: true},
  //{key: 'isMerge', title: '代码', type: 'text'},
  //{key: 'isLineSplit', title: 'DESC', type: 'text'},
  {key: 'remark', title: '内容描述', type: 'textArea'},
  {key: 'attribute1', title: '备用字段1', type: 'text'},
  {key: 'attribute2', title: '备用字段2', type: 'text'},
  {key: 'attributeNumber1', title: '备用数值1', type: 'number'},
  {key: 'attributeNumber2', title: '备用数值2', type: 'number'},
];

const editTableCols = [
  {key: "checked", title: "", type: "checkbox"},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'languageVersion', title: '语言版本', type: 'select', dictionary: name.LANGUAGE},
  {key: 'dictionaryValue', title: '字典值', type: 'text'}
];

const editButtons = [
  {key:'add', title:'新增行'},
  {key:'del', title:'删除'}
];

const edit = {
  controls,
  tableCols: editTableCols,
  buttons: editButtons,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const index = {
  tabs: true,
  indexTableCols: [
    {key: 'id', title: '字典名称', link: true},
    {key: 'pid', title: '归属字典'}
  ],
  tableCols,
  buttons,
  placeholder: '字典名称'
};

const config = {
  root: '系统字典',
  index,
  edit,
  names: [
    name.ACTIVE,
    name.LANGUAGE
  ]
};

export default config;
