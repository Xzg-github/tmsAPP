import { pageSize, pageSizeType, description, searchConfig } from '../../globalConfig';
const filters = [
  { key: 'modelName', title: '模板名称', type: 'text' },
];
const buttons = [
  { key: 'add', title: '新增', children: [], dropDown: true },
  { key: 'copyAdd', title: '复制新增' },
  { key: 'edit', title: '编辑' },
  { key: 'delete', title: '删除' },
  { key: 'import', title: '导入测试' },
];
const tableCols = [ // 主页表格字段
  { key: 'checked', title: '', type: 'checkbox' },
  { key: 'modelTypeName', title: '模板类型', type: 'text' },
  { key: 'modelName', title: '模板名称' },
  { key: 'insertTime', title: '创建时间' },
];
const modelFilters = [
  { key: 'modelCode', title: '模板编码', type: 'text' },
  { key: 'modelName', title: '模板名称', type: 'text' }
];
const modelButtons = [
  { key: 'save', title: '保存' },
  { key: 'generate', title: '生成模板' },
];
const subModelButtons = [
  { key: 'delete', title: '删除' },
  { key: 'load', title: '加载' },
];
const importButtons = [
  { key: 'upload', title: '上传模板' },
];
// 主页表格字段
const modelPTableCols = [
  { key: 'index', title: '序号', type: 'index', align: 'center' },
  { key: 'tableCode', title: '表单标识', type: 'readonly', hide: true },
  { key: 'parentCode', title: '表单标识', type: 'readonly', hide: true },
  { key: 'tableValue', title: '表单', type: 'readonly', hide: true },
  { key: 'tableTitle', title: '表单值', type: 'readonly', cellClick: true, align: 'center' },
  { key: 'sheetName', title: 'sheet名称', type: 'text', align: 'center' },
  { key: 'sheetIndex', title: '索引列', type: 'text', align: 'center' },
  { key: 'titleRowIndex', title: '标题行', type: 'text', align: 'center' },
  { key: 'dataRowIndex', title: '数据开始行', type: 'text', align: 'center' },
];
// 子表格字段
const modelSTableCols = [
  { key: 'checked', title: '', type: 'checkbox' },
  { key: 'demo', title: 'demo', type: 'text', align: 'center' },
  { key: 'fieldTitle', title: '字段名称', type: 'readonly', cellClick: true, align: 'center' },
  { key: 'fieldCode', title: '字段标识', type: 'readonly', hide: true },
  { key: 'fieldType', title: '字段类型', type: 'readonly', hide: true },
  { key: 'columnTitle', title: '列标题', type: 'text', align: 'center' },
  { key: 'columnIndex', title: '列标识', type: 'text', align: 'center' },
  {
    key: 'require',
    title: '必填',
    type: 'select',
    options: [{ title: 'true', value: 'true' }, { title: 'false', value: 'false' }],
    align: 'center',
  },
  { key: 'defaultValue', title: '默认值', type: 'text', align: 'center' },
  { key: 'apiGetLibraryCode', title: '转换规则', type: 'text', hide: true },
];
const modelControls = [
  { key: 'modelCode', title: '模板编码', type: 'readonly'},
  { key: 'modelName', title: '模板名称', type: 'text' },
  { key: 'uniqueTitle', title: '唯一字段', type: 'search' }
];
const modelInfo = {
  filters: modelFilters,
  buttons: modelButtons,
  buttons1: subModelButtons,
  buttons2: importButtons,
  controls: modelControls,
  tableCols: modelPTableCols,
  tableCols1: modelSTableCols,
};
const index = {
  filters,
  buttons,
  tableCols,
  pageSize,
  pageSizeType,
  description,
  searchConfig,
  title: '导入模板列表',
};
const config = {
  index,
  modelInfo,
};
export default config;
