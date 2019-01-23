import { pageSize, pageSizeType, description, searchConfig, paginationConfig, } from '../../globalConfig';

const filters = [
  { key: 'modelName', title: '模板名称', type: 'text' },
];

const buttons = [
  { key: 'add', title: '新增', bsStyle: 'primary' },
  { key: 'copyAdd', title: '复制新增' },
  { key: 'edit', title: '编辑' },
  { key: 'delete', title: '删除', confirm:'是否确定删除'},
  { key: 'upload', title: '上传导入模板' },
  { key: 'generate', title: '生成导入模板'},
];

const tableCols = [
  { key: 'checked', title: '', type: 'checkbox' },
  { key: 'modelTypeName', title: '模板类型', type: 'text' },
  { key: 'modelName', title: '模板名称' },
  { key: 'fileList', title:'模板', link: '下载'},
  { key: 'insertTime', title: '创建时间' },
];

const index = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  description,
  searchConfig,
  paginationConfig,
  title: '导入模板列表',
};

const modelControls = [
  { key: 'modelCode', title: '模板类型', type: 'search', required:true},
  { key: 'modelName', title: '模板名称', type: 'text', required:true},
  { key: 'uniqueTitle', title: '唯一字段', type: 'search'}
];

const sheetControls = [
  { key: 'sheetName', title: 'sheet名称', type: 'text', required: true},
  { key: 'titleRowIndex', title: '标题行', type: 'number', required: true},
  { key: 'dataRowIndex', title: '数据开始行', type: 'number', required: true},
  { key: 'sheetIndex', title: '索引列', type: 'number'},
];

const subModelButtons = [
  { key: 'load', title: '加入', bsStyle: 'primary'},
  { key: 'delete', title: '删除', confirm:'是否确定删除' },
  { key: 'empty', title: '清空列标题', confirm: '是否确定清空'}
];

// 子表格字段
const modelSTableCols = [
  { key: 'checked', title: '', type: 'checkbox' },
  { key: 'demo', title: 'demo'},
  { key: 'fieldTitle', title: '字段名称', cellClick: true},
  { key: 'columnTitle', title: '列标题', type: 'text', required:true},
  { key: 'require',title: '必填',type: 'select',options: [{ title: 'true', value: 'true' }, { title: 'false', value: 'false' }]},
  { key : 'prefix', title: '前缀追加', type: 'text'},
  { key : 'suffix', title: '后缀追加', type: 'text'},
  { key: 'defaultValue', title: '默认值', type: 'text'},
  { key: 'apiGetLibraryCode', title: '转换规则', type: 'text', hide: true },
  { key: 'fieldCode', title: '字段标识', type: 'readonly', hide: true },
  { key: 'fieldType', title: '字段类型', type: 'readonly', hide: true },
  { key: 'columnIndex', title: '列标识', type: 'text', hide: true},
];

const modelButtons = [
  { key: "cancel", title: '关闭'},
  { key: 'save', title: '保存', bsStyle: 'primary'},
];

const importButtons = [
  { key: 'import', title: '下载模板'}
];


const edit ={
  edit: '编辑',
  add: '新增',
  controls: modelControls,
  controls1: sheetControls,
  buttons: subModelButtons,
  tableCols: modelSTableCols,
  buttons1: modelButtons,
  buttons2: importButtons
};


const config = {
  index,
  edit
};

export default config;
