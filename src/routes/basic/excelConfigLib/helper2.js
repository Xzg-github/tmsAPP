import { getObject, postOption, fetchJson, showError ,convert} from '../../../common/common';
const ORDER_PAGE = ['filters', 'buttons', 'tableCols', 'pageSize', 'pageSizeType', 'description', 'searchConfig'];

export const buildPageState = (config = {}, other = {}) => {
  const { index } = config;
  return { ...other, ...config, ...getObject(index, ORDER_PAGE) };
};

export const searchAction = async (dispatch, action, state, url,isJoin) => {
  const {searchData,joinSearchData} =state;
  let filter={};
  if(isJoin){
    filter = {...convert(joinSearchData) };
  }else{
    filter = { itemFrom: 0, itemTo: 10, ...convert(searchData) };
  }
  const option = postOption(filter, 'post');
  const { result, returnCode, returnMsg } = await fetchJson(url, option);
  if (returnCode !== 0) {
    showError(returnMsg);
    return;
  }
  const { data: tableItems = [], returnTotalItems = 0, returnTotalItem = 0 } = result || {};
  tableItems.map(item => {
    if (item.taskOrderCode) {
      item.taskOrderCode = item.taskOrderCode.title;
    }
  });
  if(isJoin){
    dispatch(action.assign({ joinTableItems:result,currentPage:1}));
  }else{
    dispatch(action.assign({ tableItems, maxRecords: returnTotalItems || returnTotalItem,currentPage:1 }));
  }
};

export const pageNumberAction = async (dispatch, action, state, currentPage, pageSize, url) => {
  const {searchData} =JSON.parse(JSON.stringify(state));
  if(searchData){
    if(searchData.logisticsOrderGuid){
      searchData.logisticsOrderGuid=searchData.logisticsOrderGuid.value
    }
  }
  const newState = { currentPage, pageSize };
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;
  const filter = { itemFrom: from, itemTo: to, ...searchData };
  const option = postOption(filter, 'post');
  const { returnCode, result, returnMsg } = await fetchJson(url, option);
  if (returnCode !== 0) {
    showError(returnMsg);
    return;
  }
  const { data = [], returnTotalItems = 0, returnTotalItem = 0 } = result || {};
  const maxRecords = returnTotalItems || returnTotalItem;
  const sps=['billNumber','customerDelegateCode','logisticsOrderNumber',"balanceNumber"];
  data.forEach(x=>{
    for(let key in x){
      if(sps.indexOf(key)!=-1&&x[key].split(",").length&&x[key].split(",").length>1){
        x[key]=x[key].split(",")[0]+'...';
      }
    }
  });
  const payload = { ...newState, tableItems: data, maxRecords, currentPage, pageSize };
  dispatch(action.assign(payload));
};

export const ConfirmDialog = { title: '请确认操作', ok: '确认', cancel: '取消' };

export const cancelConfirmActionCreator = (dispatch, getState, action, key = 'tableItems') => {
  dispatch(action.assign({ confirmType: '' }));
  dispatch(action.update({ checked: false }, key, -1));
};
