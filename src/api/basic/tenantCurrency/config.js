const buttons = [
  {key: 'new', title: '加入', bsStyle: 'primary'},
  {key: 'set', title: '设置为主币种'},
  {key: 'delete', title: '移除'}
];

const tableCols = [
  {key: 'currencyTypeCode', title: '币种编码'},
  {key: 'isMainCurrency', title: '是否主币种'},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateTime', title: '更新时间'},
];

const index = {
  buttons,
  tableCols
};

const join = {
  join: '加入',
  config: {ok: '确定', cancel: '取消'},
  tableCols
};

const config = {
  index,
  join
};

export default config;
