import {districtConfig, districtEditConfig} from './districtConfig';
import {siteConfig, siteEditConfig} from './siteConfig';
import {contactConfig, contactEditConfig} from './contactConfig';
import {searchConfig} from '../../globalConfig';

const options = [
  {title: '行政区档案', value: 'district'},
  {title: '运输地点档案', value: 'TransportPlace'},
  {title: '公用地点档案', value: 'Location'},
];

const config = {
  treeConfig: {
    indexTableCols: [
      {key: 'name', title: '名称'},
      {key: 'districtId', title: '归属节点', link: true}
    ],
    indexFilters: [
      {key: 'nameType', title: '档案类型', type: 'select', options},
      {key: 'name', title: '名称', type: 'text'}
    ],
    searchConfig
  },
  districtConfig,
  siteConfig,
  contactConfig,
  districtEditConfig,
  siteEditConfig,
  contactEditConfig,
  root: '所有地址'
};

export default config;
