import {searchConfig} from '../../globalConfig';

const filters = [
  {key: 'modelName', title: '模板名称', type: 'text'},
];

const tableCols = [
  {key: 'modelCode', title: '编码', link: true},
  {key: 'modelName', title: '模板名称'},
  {key: 'down', title: '下载', link: true},
  {key: 'insertTime', title: '创建时间'},
  {key: 'updateTime', title: '更新时间'},
];

const config = {
  filters,
  tableCols,
  searchConfig,
  buttons: [
      {key: 'import', title: '导入', bsStyle: 'primary'},
  ]
};

export default config;
