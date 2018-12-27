import {pageSize, pageSizeType, description} from '../../globalConfig';

const buttons = [
  {key: 'import', title: '导入', bsStyle: 'primary'},
  {key: 'batch', title: '获取经纬度'},
  {key: 'adjust', title: '调整经纬度'},
  {key: 'export', title: '导出'},
];

const cols = [
  {key: 'city', title: '城市'},
  {key: 'area', title: '行政区'},
  {key: 'address', title: '地址'},
  {key: 'longitude', title: '经度'},
  {key: 'latitude', title: '纬度'},
];

const config = {
  pageSize,
  pageSizeType,
  description,
  buttons,
  cols
};

export default config;
