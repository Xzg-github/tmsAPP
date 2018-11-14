const filters = [
  {key: 'tenantId', title: '租户', type:'search'}
];

const searchConfig = {
  search: '打开',
  reset: '重置'
};

const  buttons= [
  {key: 'add', title: '选择', bsStyle: 'primary', sign: 'tenantapi_add'},
  {key: 'del', title: '删除', sign: 'tenantapi_del'}
];

const tableCols = [
  {key: 'apiName', title: '名称'},
  {key: 'insertUser', title: '创建人'},
  {key: 'insertTime', title: '创建时间'}
];

const addConfig = {
  title: '选择属性',
  tableCols: [
    {key: 'apiName', title: '名称'}
  ],
  maxHeight: '400px',
  size: 'small',
  config: {ok: '确定', cancel: '取消'},
};

const config = {
  tableCols,
  filters,
  searchConfig,
  buttons,
  addConfig
};

export default config;
