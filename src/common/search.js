import {postOption, fetchJson, showError, convert} from './common';
import {toTableItems} from './orderAdapter';

const filterEmptyAttr = (obj) => {
  return Object.keys(obj).reduce((state, key) => {
    if (obj[key] !== '') {
      state[key] = obj[key];
    }
    return state;
  }, {});
};

const buildFilter = (itemFrom, itemTo, filterArg) => {
  const filter = filterEmptyAttr(filterArg);
  return {itemFrom, itemTo, filter};
};

const search = async (url, from, to, filter, hasFilter=true) => {
  let params = {};
  if(hasFilter) {
    params = buildFilter(from, to, convert(filter));
  }else{
    params = {
      itemFrom: from,
      itemTo: to,
      ...filterEmptyAttr(convert(filter))
    };
  }
  const option = postOption(params);
  return await fetchJson(url, option);
};

const search2 = async (dispatch, action, url, currentPage, pageSize, filter, newState={}, path=undefined, hasFilter=true) => {
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;
  const {returnCode, returnMsg, result} = await search(url, from, to, filter, hasFilter);
  if (returnCode === 0) {
    const payload = {
      ...newState,
      tableItems: toTableItems(result),
      maxRecords: result.returnTotalItem
    };
    dispatch(action.assign(payload, path));
  } else {
    showError(returnMsg);
  }
};

const bindSearchAction = (dispatch, actionType) => {
  return async (url, from, to, filters) => {
    const {returnCode, result} = await search(url, from, to, filters);
    if (returnCode === 0) {
      dispatch({type: actionType, result});
    }
  };
};

const bindSearchActionCreator = (getSelfState, url, actionType) => {
  return () => (dispatch, getState) => {
    const search = bindSearchAction(dispatch, actionType);
    const {currentPage, pageSize, searchData} = getSelfState(getState());
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize;
    return search(url, from, to, searchData);
  };
};

export {search, search2, bindSearchAction, bindSearchActionCreator,buildFilter};
