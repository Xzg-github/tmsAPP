import name from '../../dictionary/name';
import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';

const filters = [
  {key: 'tablePropertyName', title: '表单名称',type: 'text'},
  {key: 'enabledType', title: '状态类型',type: 'select', dictionary:name.ENABLED_TYPE},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'formExpand_add'},
  {key: 'set', title: '扩展字段设置', sign: 'formExpand_set'},
  {key: 'enable', title: '启用', sign: 'formExpand_enable'},
  {key: 'disable', title: '禁用', sign: 'formExpand_disable'}
];

const tableCols = [
  {key: 'tablePropertyName', title: '表单名称'},
  {key: 'tablePropertyCode', title: '表单编码'},
  {key: 'enabledType', title: '状态类型', dictionary:name.ENABLED_TYPE},
  {key: 'isConfig', title: '是否设置'},
  {key: 'insertUser', title: '创建用户'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateUser', title: '更新用户'},
  {key: 'updateTime', title: '更新时间'}
];

const boolOptions = [
  {value: true, title:'是'},
  {value: false, title:'否'}
];

const boolStrOptions = [
  {value: 'true', title:'是'},
  {value: 'false', title:'否'}
];

const spanOptions = [
  {value: 1, title:'1(默认值)'},
  {value: 2, title:'2'},
  {value: 3, title:'3'},
  {value: 4, title:'4'}
];

const formTypeOptions = [
  {value: 'text', title:'文本'},
  {value: 'number', title:'数值'},
  {value: 'date', title:'日期/时间'},
  {value: 'textArea', title:'多行文本'},
  {value: 'readonly', title:'只读'}
];

//根据控件类型需要隐藏的字段属性
const hideConfig = {
  allHideKeys: ['dictionary', 'mode', 'showTime', 'onSearch', 'searchWhenClick', 'noSearchWhenTypo', 'real', 'precision', 'sign', 'zero', 'isTotal', 'onChange', 'showAdd', 'archives', 'initValue', 'onAddOk'],
  showAddTrue: ['dictionary', 'mode', 'showTime', 'real', 'isTotal', 'precision', 'sign', 'zero'],
  text: ['dictionary', 'mode', 'showTime', 'onSearch', 'searchWhenClick', 'noSearchWhenTypo', 'real', 'isTotal', 'precision', 'sign', 'zero', 'showAdd', 'archives', 'initValue', 'onAddOk'],
  number: ['dictionary', 'mode', 'showTime', 'onSearch', 'searchWhenClick', 'noSearchWhenTypo', 'showAdd', 'archives', 'initValue', 'onAddOk'],
  date: ['dictionary', 'mode', 'onSearch', 'searchWhenClick', 'noSearchWhenTypo', 'real', 'isTotal', 'precision', 'sign', 'zero', 'onChange', 'showAdd', 'archives', 'initValue', 'onAddOk'],
  select: ['showTime', 'onSearch', 'searchWhenClick', 'noSearchWhenTypo', 'real', 'isTotal', 'precision', 'sign', 'zero', 'showAdd', 'archives', 'initValue', 'onAddOk'],
  search: ['dictionary', 'mode', 'showTime', 'real', 'isTotal', 'precision', 'sign', 'zero', 'archives', 'initValue', 'onAddOk'],
  readonly: ['dictionary', 'mode', 'showTime', 'onSearch', 'searchWhenClick', 'noSearchWhenTypo', 'real', 'isTotal', 'precision', 'sign', 'zero', 'onChange', 'showAdd', 'archives', 'initValue', 'onAddOk'],
  textArea: ['dictionary', 'mode', 'showTime', 'onSearch', 'searchWhenClick', 'noSearchWhenTypo', 'real', 'isTotal', 'precision', 'sign', 'zero', 'onChange', 'showAdd', 'archives', 'initValue', 'onAddOk']
};

const editItemConfig = {
  addTitle: '新增字段',
  editTitle: '编辑字段',
  ok: '确定',
  cancel: '取消',
  hideConfig,
  searchConfig: {
    config: searchConfig,
    filters: [
      {key: 'itemKey', title: 'key', type: 'text'},
      {key: 'title', title: '字段名', type: 'text'},
      {key: 'type', title: '控件类型', type: 'select', options: formTypeOptions},
    ]
  },
  controls: [
    {key: 'itemKey', title: 'key', type: 'readonly', required: true},
    {key: 'title', title: '字段名', type: 'text', required: true},
    {key: 'type', title: '控件类型', type: 'readonly', options: formTypeOptions, required: true},
    {key: 'required', title: '必填', type: 'select', options: boolStrOptions, bool: true},
    {key: 'showTime', title: '时间精确到秒', type: 'select', options: boolStrOptions, bool: true},
    {key: 'real', title: '允许小数', type: 'select', options: boolStrOptions, bool: true},
    {key: 'precision', title: '小数位数', type: 'number'},
    {key: 'sign', title: '允许负数', type: 'select', options: boolStrOptions, bool: true},
    {key: 'zero', title: '允许0值', type: 'select', options: boolStrOptions, bool: true},
    {key: 'remark', title: '备注', type: 'text', span: 4}
  ],
  cols: [
    {key: 'itemKey', title: 'key'},
    {key: 'title', title: '字段名'},
    {key: 'type', title: '控件类型', options: formTypeOptions},
    {key: 'required', title: '必填', options: boolOptions},
    {key: 'showTime', title: '时间是否精确到秒', options: boolOptions},
    {key: 'precision', title: '小数位数'},
    {key: 'remark', title: '备注'},
  ],
  items: []
};

const index = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig
};

const setConfig = {
  title: '扩展字段设置',
  ok: '确定',
  cancel: '取消',
  buttons:[
    {key: 'add', title: '新增', bsStyle: 'primary'},
    {key: 'edit', title: '编辑'},
    {key: 'del', title: '删除'},
    {key: 'up', title: '前移'},
    {key: 'down', title: '后移'}
  ],
  tableCols: [
    {key: 'itemKey', title: 'key'},
    {key: 'title', title: '字段名'},
    {key: 'type', title: '控件类型', options: formTypeOptions},
    {key: 'required', title: '必填', options: boolOptions},
    {key: 'span', title: '占列数', type: 'select', options: spanOptions},
    {key: 'showTime', title: '时间是否精确到秒', options: boolOptions},
    {key: 'precision', title: '小数位数'},
    {key: 'remark', title: '备注'}
  ],
  editItemConfig
};

const config = {
  index,
  addConfig: {
    title: '新增',
    controls: [
      {key: 'tablePropertyName', title: '表单名称', type:'search', props: {noSearchWhenTypo: true}, dictionary: name.TABLE_PROPERTY_TYPE, required: true}
    ],
    ok: '确定',
    cancel: '取消'
  },
  setConfig
};

export default config;
