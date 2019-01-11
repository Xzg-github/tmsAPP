import SetColDialog from '../components/SetColDialog/SetColDialog';
import {fetchJson, postOption, showError, convert, download, deepCopy} from './common';
import showPopup from '../standard-business/showPopup';
import ExportJsonExcel from 'js-export-excel';
import {buildFilter} from './search';

const URL_GET_ID = '/api/permission/custom_export_table';
const URL_COMMON_EXPORT = '/api/permission/common_export';

const gridConfigHandler = (cols) => {
  return cols.map(col => {
    const newCol = { title: col.title, dataPath: col.key };
    (col.type === 'number') && (newCol.isNumber = true);
    (!col.option) && (newCol.dataSource = col.dictionary || col.position);
    return newCol;
  });
};

const exportGridConfigHandler = (tableCols) => {
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

const exportExcelFunc = async (newCols, items, byFront=true) => {
  if(items.length < 1) return showError('导出数据为空！');
  const gridConfig = gridConfigHandler(newCols);
  const hasDictionaryData = newCols.filter(col=>col.options && col.options.length);
  const checkItems = items.filter(o=>o.checked);
  const srcData = checkItems.length == 0 ? items : checkItems;
  const data = deepCopy(srcData).map(o=>{
    for(let v in o) {
      if(typeof o[v] == 'object'){
        o[v] = o[v].title;
      }
      hasDictionaryData.map(a=>{
        if(a.key == v){
          const value = a.options.filter(b=>b.value == o[v]);
          o[v] = value.length > 0 ? value[0].title : '';
        }
      });
    }
    return o;
  });
  if(byFront){  //前端导出
    const D = new Date();
    const option = {
      fileName: `${D.getFullYear()}${D.getMonth()+1}${D.getDate()}${D.getHours()}${D.getMinutes()}${D.getSeconds()}`,
      datas: [{
          sheetHeader: gridConfig.map(o=>o.title),
          sheetFilter: gridConfig.map(o=>o.dataPath),
          sheetData: data
      }]
    };
    const file = new ExportJsonExcel(option);
    file.saveExcel();
  }else{  //后端导出,这是确认数据源的后端导出，还有一种是通过查询条件去后端查询并由后端导出
    const {returnCode, result, returnMsg} = await fetchJson(URL_GET_ID, postOption({gridConfig, data}));
    if(returnCode !== 0) return showError(returnMsg);
    download(`/api/proxy/integration_service/load/excel_datasource/${result.id}`, result.id);
  }
};

/**
 * 查询后端导出
 * @param tableCols 导出列表的config对象
 * @param api  查询导出数据的后端API地址，一般为列表的搜索API（无需host:port部分）
 * @param searchData 导出数据的查询条件
 * @param isFilter 要求的参数是否需要filter包装，默认为true
 * @param method 请求方式，默认为post
 * @param pageResult 返回的结果是否为分页的结果，默认为true
 */
const commonExport = async (tableCols=[], api='', searchData={}, isExcelReport=true, isFilter=true, method='post', pageResult=true) => {
  let search = isFilter ? buildFilter(0, 65535, convert(searchData)) : {...convert(searchData), itemFrom: 0, itemTo: 65535};
  const params = {
    search: method.toLowerCase() == 'post' ? isExcelReport ? {...search, needPaging: 0} : search : {},
    gridConfig: exportGridConfigHandler(tableCols),
    api,
    method,
    pageResult
  };
  const {returnCode, returnMsg, result} = await fetchJson(URL_COMMON_EXPORT, postOption(params));
  if (returnCode !== 0) return showError(returnMsg);
  download(`/api/proxy/integration_service/load/excel/${result.id}`, result.id);
};

// cols:表格字段配置，items：表格数据源(自定义字段导出)
const showExcelDialog = (cols, items) => {
  const onOk = (newCols) => {exportExcelFunc(newCols, items)};
  const props = {
    ok: '确定',
    cancel: '取消',
    title: 'Excel',
    buttons: [
      {key:'up', title: '前移'},
      {key:'down', title: '后移'},
      {key:'remove', title: '移除'}
    ],
    tableCols:[
      {key: 'checked', title: '', type: 'checkbox'},
      {key: 'index', title: '序号', type: 'index'},
      {key:'title', title: '字段名', type: 'readonly'},
    ],
    cols,
    onOk
  };
  return showPopup(SetColDialog, props);
};

export {showExcelDialog, exportExcelFunc, commonExport};
