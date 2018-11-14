import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const filters = [
  {key: 'formType', title: '表单类型', type: 'text'},
  {key: 'formName', title: '表单名称', type: 'text'},
  {key: 'dictionaryCode', title: '表单状态', type: 'select',from:'dictionary', position:name.STATUS_TYPE},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'formStateConfiguration_add'},
  {key: 'edit', title: '编辑', sign: 'formStateConfiguration_edit'},
  {key: 'del', title: '删除', sign: 'formStateConfiguration_del'},
];

const tableCols = [
  {key: 'formType', title: '表单类型'},
  {key: 'formName', title: '表单名称'},
  {key: 'dictionaryCode', title: '表单状态',from:'dictionary', position:name.STATUS_TYPE},
];


const controls = [
  {key: 'formType', title: '表单类型',type: 'text',required:true},
  {key: 'formName', title: '表单名称',type: 'text',required:true},
];


const index = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  paginationConfig,
  searchConfig
};


const edit = {
  controls,
  buttons: [
    {key: 'add', title: '新增'},
    {key: 'delete', title: '删除'}
  ],

  tableCols : [
    {key: 'checked', title: '', type: 'checkbox'},
    {key: 'index', title: '序号', type: 'index'},
    {key: 'dictionaryCode', title: '表单状态', type: 'select',from:'dictionary', position:name.STATUS_TYPE,required:true},
    {key: 'sortNumber', title: '排序', type: 'number',required:false},
  ],
  tableItems: [],
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit,
  dicNames: [name.STATUS, name.LANGUAGE,name.STATUS_TYPE]
};

export default config;



