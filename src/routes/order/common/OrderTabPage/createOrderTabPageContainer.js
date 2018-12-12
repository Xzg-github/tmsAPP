import { connect } from 'react-redux';
import OrderTabPage from './OrderTabPage';
import helper, {showError} from '../../../../common/common';
import {search} from '../../../../common/search';
import {showColsSetting} from '../../../../common/tableColsSetting';
import {fetchAllDictionary, setDictionary2, getStatus} from "../../../../common/dictionary";
import {exportExcelFunc, commonExport} from '../../../../common/exportExcelSetting';

//实现搜索公共业务
const mySearch = async (dispatch, action, selfState, currentPage, pageSize, filter, newState={}) => {
  const {subActiveKey, urlList, isTotal, subTabs, fixedFilters={}} = selfState;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;
  const {returnCode, returnMsg, result} = await search(urlList, from, to, {...filter, ...fixedFilters[subActiveKey]}, false);
  if (returnCode === 0) {
    if (!result.tags && result.tabTotal) { //转成统一结构
      result.tags = Object.keys(result.tabTotal).map(item => ({tag: item, count: result.tabTotal[item]}));
    }
    const payload = {
      ...newState,
      currentPage: {...selfState.currentPage, [subActiveKey]: currentPage},
      pageSize: {...selfState.pageSize, [subActiveKey]: pageSize},
      tableItems: {...selfState.tableItems, [subActiveKey]: result.data},
      maxRecords: isTotal && result.tags ? subTabs.reduce((obj, tab) => {
        const {count = 0} = result.tags.filter(item => item.tag === tab.status).pop() || {};
        obj[tab.key] = count;
        return obj;
      }, {}) : {[subActiveKey]: result.returnTotalItem || result.returnTotalItems},
      sortInfo: {},
      filterInfo:{}
    };
    dispatch(action.assign(payload));
  } else {
    showError(returnMsg);
  }
};

/**
 * 功能：生成一个公共的列表页面容器组件
 * 参数：action - [必需] 由此容器组件所在位置对应的reducer路径生成
 *       getSelfState - [必需] 获取容器组件在state对应路径下的自身节点状态
 *       actionCreatorsEx - [可选] 页面需覆写和扩展的响应处理
 * 返回：带公共业务处理的列表页面容器组件
 */
const createOrderTabPageContainer = (action, getSelfState, actionCreatorsEx={}) => {

  const changeActionCreator = (key, value) => {
    return action.assign({[key]: value}, 'searchData');
  };

  //点击搜索按钮
  const searchActionCreator = () => async (dispatch, getState) => {
    const selfState = getSelfState(getState());
    const {subActiveKey, pageSize, searchData, subTabs} = selfState;
    const isRefresh = subTabs.reduce((obj, tab) => { //点击搜索按钮将其他页签都置为切换时需要刷新列表状态
      obj[tab.key] = tab.key !== subActiveKey;
      return obj;
    }, {});
    const newState = {searchDataBak: searchData, isRefresh};
    return mySearch(dispatch, action, selfState, 1, pageSize[subActiveKey], searchData, newState);
  };

  const resetActionCreator = () => (dispatch) => {
    dispatch(action.assign({searchData: {}}));
  };

  const checkActionCreator = (subActiveKey, isAll, checked, rowIndex) => {
    isAll && (rowIndex = -1);
    return action.update({checked}, ['tableItems', subActiveKey], rowIndex);
  };

  const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
    const selfState = getSelfState(getState());
    const {subActiveKey, pageSize, searchDataBak={}} = selfState;
    return mySearch(dispatch, action, selfState, currentPage, pageSize[subActiveKey], searchDataBak, {});
  };

  const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
    const selfState = getSelfState(getState());
    const {searchDataBak={}} = selfState;
    return mySearch(dispatch, action, selfState, currentPage, pageSize, searchDataBak, {});
  };

  //配置字段按钮
  const configActionCreator = () => (dispatch, getState) => {
    const {tableCols} = getSelfState(getState());
    const okFunc = (newCols) => {
      dispatch(action.assign({tableCols: newCols}));
    };
    showColsSetting(tableCols, okFunc, helper.getRouteKey());
  };

  //页面导出
  const webExportActionCreator = () => (dispatch, getState) => {
    const {tableCols, tableItems, subActiveKey} = getSelfState(getState());
    return exportExcelFunc(tableCols, tableItems[subActiveKey]);
  };

  //查询导出
  const allExportActionCreator = () => (dispatch, getState) => {
    const {tableCols, searchData, fixedFilters, subActiveKey, urlExport} = getSelfState(getState());
    const realSearchData = {...searchData, ...fixedFilters[subActiveKey]};
    return commonExport(tableCols, urlExport, realSearchData, true, false, 'post', false);
  };

  //前端表格排序和过滤
  const tableChangeActionCreator = (subActiveKey, sortInfo, filterInfo) => (dispatch, getState) => {
    const selfState = getSelfState(getState());
    dispatch(action.assign({
      sortInfo: {...selfState.sortInfo, [subActiveKey]: sortInfo},
      filterInfo: {...selfState.filterInfo, [subActiveKey]: filterInfo}
    }));
  };

  //列表页签切换
  const tabChangeActionCreator = (key) => async (dispatch, getState) => {
    dispatch(action.assign({subActiveKey: key}));
    const selfState = getSelfState(getState());
    const {isRefresh, searchDataBak={}, pageSize} = selfState;
    if (isRefresh[key]) {
      const newState = {isRefresh: {...selfState.isRefresh, [key]: false}};
      return mySearch(dispatch, action, selfState, 1, pageSize[key], searchDataBak, newState);
    }
  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const actionCreators = {
    //可覆写的响应
    onClickReset: resetActionCreator,     //点击重置按钮
    onClickSearch: searchActionCreator,   //点击搜索按钮
    onConfig: configActionCreator,        //点击配置字段按钮
    onWebExport: webExportActionCreator, //点击页面导出按钮
    onAllExport: allExportActionCreator, //点击查询导出按钮
    onChange: changeActionCreator,        //过滤条件输入改变
    onCheck: checkActionCreator,          //表格勾选响应
    onTableChange: tableChangeActionCreator,  //表格组件过滤条件或排序条件改变响应
    onPageNumberChange: pageNumberActionCreator,  //页数改变响应
    onPageSizeChange: pageSizeActionCreator,      //每页记录条数改变响应
    onSubTabChange: tabChangeActionCreator,          //列表页签切换响应
    //可扩展的响应
    // onSearch: 搜索条件为search控件时的下拉搜索响应 func(key, filter)
    // onClick: 按钮点击响应 func(tabKey, buttonKey)
    // onDoubleClick: 表格双击响应 func(tabKey, rowIndex)
    // onLink: 表格点击链接响应 func(tabKey, key, rowIndex, item)
    ...actionCreatorsEx
  };

  return connect(mapStateToProps, actionCreators)(OrderTabPage);
};

/*
* 功能：构造带页签列表页面的公共初始化状态
 * 参数：urlConfig - [必需] 获取界面配置的url
 *       urlList - [必需] 获取列表数据的url
 *       statusNames - [可选] 需要获取的来自状态字典的表单状态下拉的表单类型值数组
* 返回：成功返回初始化状态，失败返回空
* */
const buildOrderTabPageCommonState = async (urlConfig, urlList, statusNames=[]) => {
  try {
    //获取并完善config
    const config = helper.getJsonResult(await helper.fetchJson(urlConfig));
    const dic = helper.getJsonResult(await fetchAllDictionary());
    for (let item of statusNames) {
      dic[item] = helper.getJsonResult(await getStatus(item));
    }
    setDictionary2(dic, config.filters, config.tableCols);
    const {subActiveKey, subTabs, isTotal, pageSize={}, fixedFilters={}, searchDataBak={}} = config;
    //获取列表数据
    const body = {
      itemFrom: 0,
      itemTo: pageSize[subActiveKey],
      ...fixedFilters[subActiveKey],
      ...searchDataBak
    };
    const data = helper.getJsonResult(await helper.fetchJson(urlList, helper.postOption(body)));
    if (!data.tags && data.tabTotal) { //转成统一结构
      data.tags = Object.keys(data.tabTotal).map(item => ({tag: item, count: data.tabTotal[item]}));
    }
    const maxRecords = isTotal && data.tags ? subTabs.reduce((obj, tab) => {
      const {count = 0} = data.tags.filter(item => item.tag === tab.status).pop() || {};
      obj[tab.key] = count;
      return obj;
    }, {}) : {[subActiveKey]: data.returnTotalItem || data.returnTotalItems};
    return {
      ...config,
      urlList,
      maxRecords,
      tableCols: helper.initTableCols(helper.getRouteKey(), config.tableCols),
      tableItems: {
        [subActiveKey]: data.data || []
      },
      sortInfo: {},
      filterInfo: {},
      status: 'page'
    };
  } catch (e) {
    helper.showError(e.message);
  }
};

/*
* 功能：实现公共业务-按钮操作后刷新列表
 * 参数：refreshArr - [可选] 操作后需要刷新的页签KEY数组，结构如： ['tabKey', 'tabKey2']
* */
const updateTable = (dispatch, action, selfState, refreshArr=[]) => {
  const {subActiveKey, currentPage, pageSize, searchDataBak} = selfState;
  const isRefresh = {...selfState.isRefresh};
  refreshArr.map(item => {isRefresh[item] = true});
  const newState = {isRefresh};
  return mySearch(dispatch, action, selfState, currentPage[subActiveKey], pageSize[subActiveKey], searchDataBak, newState);
};

export default createOrderTabPageContainer;
export {buildOrderTabPageCommonState, updateTable};
