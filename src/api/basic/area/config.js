import {districtConfig, districtEditConfig} from './districtConfig';
import {searchConfig} from '../../globalConfig';

const config = {
  treeConfig: {
    indexTableCols: [
      {key: 'name', title: '名称'},
      {key: 'districtId', title: '归属节点', link: true}
    ],
    indexFilters: [
      {key: 'name', title: '名称', type: 'text'}
    ],
    searchConfig
  },
  districtConfig,
  districtEditConfig,
  root: '所有地址'
};

export default config;
