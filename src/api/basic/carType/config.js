import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../globalConfig';
import name from '../../dictionary/name';

const containerTypeOptions = [{value:1, title:'1'}, {value:2, title:'2'}];
const tableCols = [
  {key: 'carMode', title: '车型'},
  {key: 'length', title: '长' },
  {key: 'width', title: '宽'},
  {key: 'height', title: '高' },
  {key: 'maxWeight', title: '最大装载重量' },
  {key: 'maxVolume', title: '最大装载体积' },
  {key: 'containerRate', title: '标准柜比例', options: containerTypeOptions },
  {key: 'isContainer', title: '是否柜车', from:'dictionary', position: name.YES_OR_NO },
  {key: 'containerType', title: '柜车类型', from:'dictionary', position: name.CONTAINER_TYPE },
  {key: 'containerCode', title: '柜型标准代码' },
  {key: 'remark', title: '备注'},
  {key: 'active', title: '状态', from:'dictionary', position: name.ACTIVE}
];

const filters = [
  {key: 'carMode', title: '车型', type: 'text'},
  {key: 'maxWeight', title: '最大装载重量', type: 'number', remark2: true},
  {key: 'maxVolume', title: '最大装载体积', type: 'number', remark2: true}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary', sign: 'car_type_new'},
  {key: 'edit', title: '编辑', sign: 'car_type_edit'},
  {key: 'del', title: '删除', sign: 'car_type_delete'},
  {key: 'active', title: '激活', sign: 'car_type_active'},
  //{key: 'input', title: '导入'},
  //{key: 'output', title: '导出'}
];
const controls = [
  {key: 'carMode', title: '车型', type:'text', required: true },
  {key: 'length', title: '长',type:'number', props: {real: true, precision: 2}},
  {key: 'width', title: '宽',type:'number', props: {real: true, precision: 2}},
  {key: 'height', title: '高',type:'number', props: {real: true, precision: 2}},
  {key: 'maxWeight', title: '最大装载重量',type:'number', props: {real: true, precision: 2}},
  {key: 'maxVolume', title: '最大装载体积',type:'number', props: {real: true, precision: 2}},
  {key: 'containerRate', title: '标准柜比例',type:'select', options: containerTypeOptions },
  {key: 'isContainer', title: '是否柜车', type:'radioGroup', from:'dictionary', position: name.YES_OR_NO },
  {key: 'containerType', title: '柜车类型',type:'select', from:'dictionary', position: name.CONTAINER_TYPE },
  {key: 'containerCode', title: '柜型标准代码',type:'text'},
  {key: 'remark', title: '备注', type:'text' },
  {key: 'active', title: '状态', type: 'readonly', from:'dictionary', position: name.ACTIVE}
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
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const config = {
  index,
  edit
};

export default config;
