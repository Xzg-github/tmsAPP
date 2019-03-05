import fs from 'fs';
import path from 'path';

const pageSize = 10;
const pageSizeType = ['10', '20', '30', '40', '50', '100', '200', '500'];
const description = '共有{maxRecords}条记录';
const okText = '确定';
const cancelText = '取消';

// 该配置将被废弃
const paginationConfig = {
  pageDesp: description,
  pageGoto: {placeholder: '跳转页数', btnTitle: '确定'},
  pageSize: {start: '每页显示', end: '条'},
  prevPage: '上一页',
  nextPage: '下一页',
  firstPage: '首页',
  lastPage: '尾页'
};

// 搜索配置
const searchConfig = {
  search: '搜索',
  more: '更多',
  reset: '重置',
  sort: '排序'
};

// 是否放开权限代码
const privilege = true;

// 下拉搜索的最大条数
const maxSearchCount = 20;


// node转发请求所用的地址
let hostname = '10.10.10.240';
let trackMapUrl;
const readConfig = () => {
  try {
    const filePath = path.join(__dirname, 'api_config.json');
    const config = JSON.parse(fs.readFileSync(filePath,'utf-8'));
    hostname = config.hostname;
    trackMapUrl = config.trackMapUrl;
  }catch (e) {
    console.log('can not read config file');
  }
};

readConfig();

const port = '5555';
const host = `http://${hostname}:${port}`;

//跟踪管理-轨迹信息的扩展页面地址
const trackMapUrlEx = trackMapUrl ? trackMapUrl : `http://${hostname}:9108/trace/map/showMapFrame?apiId=get&truckNumbers=auto&systemId=epld&orderGuid=`;

export {
  pageSize,
  pageSizeType,
  description,
  paginationConfig,
  okText,
  cancelText,
  searchConfig,
  host,
  hostname,
  port,
  privilege,
  maxSearchCount,
  trackMapUrlEx
};
