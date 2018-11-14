import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';

const controls = [
  {key: 'controllerExplain', title: '所属控制层说明', type: 'text', required: true},
  {key: 'controllerName', title: '所属控制层名称', type: 'text', required: true},
  {key: 'controllerUrl', title: '所属控制层路径', type: 'text', required: true},
  {key: 'controllerPath', title: '所属控制层代码路径', type: 'text', required: true},
];

const index = {
  pageSize,
  pageSizeType,
  description,
  searchConfig
};

const edit = {
  controls,
  edit: '编辑',
  add: '新增',
  config: {ok: '确定', cancel: '取消'}
};

const addController = {
  index,
  edit
};

export default addController;
