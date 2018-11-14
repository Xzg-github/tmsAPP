import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';
import data from './data'

//用于method
const options =[
  {value:'post',title:'post'},
  {value:'get',title:'get'}
];

//是否分页
const options1 =[
  {value:'0',title:'0'},
  {value:'1',title:'1'}
];

//excel报表清单
const options2 =[
  {value:'0',title:'否'},
  {value:'1',title:'是'}
];

const options3 = [
  {value:'text',title:'文本'},
  {value:'search',title:'下拉搜索'},
  {value:'readonly',title:'只读'},
  {value:'dictionary',title:'字典'},
  {value:'select',title:'自定义下拉'},
  {value:'number',title:'数值'},
  {value:'date',title:'日期'},
  {value:'textArea',title:'文本域'},
];


const filters = [
  {key: 'excelReportKey', title: '报表KEY',type:'text'},
  {key: 'excelReportName', title: '报表名称',type:'text'},
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'excelOutputConfiguration_add'},
  {key: 'edit', title: '编辑', sign: 'excelOutputConfiguration_edit'},
  {key: 'del', title: '删除', sign: 'excelOutputConfiguration_del'},
];

const tableCols = [
  {key: 'excelReportKey', title: '报表KEY'},
  {key: 'excelReportName', title: '报表名称'},
  {key: 'apiMethod', title: 'method',options},
  {key: 'urlApi', title: '报表API'},
  {key: 'selectViaUi', title: 'excel报表清单',options:options2},
  {key: 'isPage', title: '是否分页',options:options1},
  {key: 'excelReportGroup', title: '报表组',from:'dictionary', position:name.EXCEL_REPORT_GROUP},
/*  {key: 'numberFieldList', title: '数值列',type: 'text'},*/
];


const controls = [
  {key: 'excelReportKey', title: '报表KEY',type:'text',required:true},
  {key: 'excelReportName', title: '报表名称',type:'text',required:true},
  {key: 'apiMethod', title: 'method',type:'select',options,required:true},
  {key: 'urlApi', title: '报表API',type:'text',required:true},
  {key: 'selectViaUi', title: 'excel报表清单',type:'select',options:options2,required:true},
  {key: 'isPage', title: '是否分页',type:'select',required:true,options:options1},
  {key: 'sendType', title: '发送方式',type:'select',required:true,from:'dictionary', position:name.MAIL_SEND_TYPE},
  {key: 'excelReportGroup', title: '报表组',type:'select',required:true,from:'dictionary', position:name.EXCEL_REPORT_GROUP},
/*  {key: 'gridConfig', title: '表格定义',type: 'textArea',span:2,required:true},
  {key: 'numberFieldList', title: '数值列',type: 'text',span:2},*/
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
  data,
  buttons: [
    {key: 'add', title: '新增'},
    {key: 'edit', title: '编辑'},
    {key: 'delete', title: '删除'}
  ],
  buttons1: [
    {key: 'add1', title: '新增'},
    {key: 'delete1', title: '删除'},
    {key: 'import', title: '导入'}
  ],
  tableCols : [
    {key:'parameterKey',title:"标签key"},
    {key:'parameterName',title:"标签名称"},
    {key:'componentType',title:"组件类型",options:options3},
    {key:'sequence',title:"顺序"}
  ],
  tableCols2 : [
    {key: 'checked', title: '', type: 'checkbox'},
    {key: 'index', title: '序号', type: 'index'},
    {key: 'title', title: '标题', type: 'text',required:true},
    {key: 'dataPath', title: '值路径', type: 'text',required:true},
    {key: 'dataSource', title: '数据源', type: 'text'},
    {key: 'number', title: '是否为数值', type: 'select',options:[{value:true,title:'是'},{value:false,title:'否'}],required:true},
  ],
  tableItems: [],
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit,
  dicNames: [name.EXCEL_REPORT_GROUP,name.COMPONENT_TYPE,name.LANGUAGE,name.MAIL_SEND_TYPE]
};

export default config;



