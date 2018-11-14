import { pageSize, pageSizeType, description, searchConfig } from '../../globalConfig'

const filters = [
  {key: 'modeName', type: 'text',title: '数据集名称'},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'copyAdd', title: '复制新增'},
  {key: 'edit', title: '编辑'},
  {key: 'del', title: '删除'},
];

const tableCols = [
  { key: 'modeCode', title: '数据集编码'},
  { key: 'modeName', title: '数据集名称'},
  { key: 'datasourceType', title: '数据源类别' },
  { key: 'dataType', title: '数据格式'},
  { key: 'url', title: 'URL'},
  { key: 'methodType', title: 'METHOD'},
  { key: 'modeList', title: 'MODE'},
];

const formControls = [
  {key: 'modeCode' , title: '数据集编码', type: 'text'},
  {key: 'modeName', title: '数据集名称', type: 'text'},
  {key: 'datasourceType', title: '数据源类别', type: 'select', options: [{ value:'API', title: 'API' }, { value:'SQL', title: 'SQL' }]},
  {key: 'dataType', title: '数据格式', type: 'select', options: [{ value:'JSON', title: 'JSON' }]},
  {key: 'methodType', title: 'METHOD', type: 'select', options: [{ value:'GET', title: 'GET' }, { value:'POST', title: 'POST' }]},
  {key: 'modeList', title: 'MODE', type: 'text'},
  {key: 'url',title: 'URL',type: 'text'},
];

const textAreaControls = [
  {key: 'datasetConfig', title: '数据集定义', type: 'text', rows: 4},
  {key: 'demo', title: '数据示例', type: 'text', rows: 4},
  {key: 'paramRemark', title: '参数说明', type: 'text', rows: 4},
];

const tagConfig = {
  tabs: [{
    key: 'data_set',
    title: '报表模板类型',
    close: false,
  }],
  activeKey: 'data_set',
};

const config = {
  filters,
  buttons,
  tableCols,
  currentPage: 1,
  pageSize,
  pageSizeType,
  description,
  searchConfig,
  searchData: {},
  trackViewData: {},
  formControls,
  textAreaControls,
  editData: {},
  tagConfig,
};

export default config;
