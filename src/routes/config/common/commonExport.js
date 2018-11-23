import helper, {fetchJson, showError, getObjectExclude, postOption, convert} from '../../../common/common';
import {buildFilter} from '../../../common/search';
const EXPORTTOEXCEL = '/api/basic/common/export'; // 导出

/**
 * 获取需要导出的列及导出相关配置
 * 根据isExport属性判断该列是否需要导出(默认为true)
 * 根据dataPath属性确定导出时取数据的json路径，默认为key
 * 根据from属性指定导出的dataSource配置
 * @param tableCols 导出列表的config对象
 * @returns {Array} 导出配置
 */
export const gridConfigHandler = (tableCols) => {
  let gridConfig = [];
  tableCols.filter((obj) => {
    return (typeof obj.isExport == 'undefined') || obj.isExport;
  }).forEach((obj) => {
    let columnConfig = {};
    columnConfig['title'] = obj.title;
    columnConfig['dataPath'] = obj.dataPath ? obj.dataPath : obj.key;
    columnConfig['dataSource'] = obj.dataSource ? obj.dataSource : obj.from ? obj.from : obj.dictionary ? "dictionary" : "";
    gridConfig.push(columnConfig);
  });
  return gridConfig;
};

export const filterObj = (obj) => {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== '') {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

function buildSearchForPost(searchData, isFilter,isExcelReport) {
  let search = {};
  if (searchData instanceof Array) {
    search.filter = searchData;
  } else {
    search = isExcelReport ? convert(searchData) : buildFilter(0, 65535, convert(searchData));
  }
  if (isFilter != true) {
    search = search.filter;
    if (!(search instanceof Array)) {
      search.itemFrom = 0;
      search.itemTo = 65535;
      search.needPaging = 0;
    }
  } else {
    search.needPaging = 0;
  }
  return search;
}
/**
 * excel导出公共方法
 * @param exportDataApi  查询导出数据的后端API地址，一般为列表的搜索API（无需host:port部分）
 * @param searchData 导出数据的查询条件
 * @param isFilter {@link exportDataApi }要求的参数是否需要filter包装
 * @param method  {@link exportDataApi} 请求方式，默认为post
 * @param tableCols 导出列表的config对象，默认取{@link state}中的tableCols对象
 * @param pageResult {@link exportDataApi} 返回的结果是否为分页的结果，默认为true
 * @param isExcelReport {@link exportDataApi} 是否是excel导出页面进入，默认为false
 * @returns {Promise.<void>}
 */
export const commonExport = async (dispatch, getState, state, action, exportDataApi, searchData, isFilter, method, tableCols,
                                   pageResult,isExcelReport=false) => {
  // const {tableCols, searchData} = state;
  tableCols = tableCols ? tableCols : state.tableCols;
  searchData = searchData ? searchData : state.searchData;
  let search = {};
  if (method && method.toLowerCase() == 'get') {
    search = {};
  }else{
    search = buildSearchForPost(searchData, isFilter, isExcelReport);
  }

  const gridConfig = gridConfigHandler(tableCols);
  const exportResult = await fetchJson(EXPORTTOEXCEL, postOption({
    search,
    gridConfig,
    api: exportDataApi,
    method: method,
    pageResult: pageResult
  }));
  if (exportResult.returnCode === 0) {
    const url = `/api/proxy/integration_service/load/excel/${exportResult.result.id}`;
    window.open(url);
  }
  dispatch && dispatch(action.assign({}));
};
