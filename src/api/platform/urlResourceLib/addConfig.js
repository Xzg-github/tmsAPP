import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';

const controls = [
  {key: 'serviceName', title: '所属服务名', type: 'text', required: true},
  {key: 'serviceExplain', title: '服务名说明', type: 'text', required: true}
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

const addConfig = {
  index,
  edit
};

export default addConfig;
