import { connect } from 'react-redux';
import OrderPage from './OrderPage';
import helper from '../../common/common';
import {search2} from '../../common/search';
import {showColsSetting} from '../../common/tableColsSetting';
import {fetchAllDictionary, setDictionary2, getStatus} from "../../common/dictionary";
import {exportExcelFunc, commonExport} from '../../common/exportExcelSetting';
import showFilterSortDialog from "../../common/filtersSort";

/**
 * 功能：生成一个公共的列表页面容器组件
 * 参数：action - [必需] 由此容器组件所在位置对应的reducer路径生成
 *       getSelfState - [必需] 获取容器组件在state对应路径下的自身节点状态
 *       actionCreatorsEx - [可选] 页面需覆写和扩展的响应处理
 * 返回：带公共业务处理的列表页面容器组件
 */
const createOrderPageContainer = (action, getSelfState, actionCreatorsEx={}) => {

  const searchOptionsActionCreator = (key, filter, config) => async (dispatch) => {
    const {returnCode, result} = await helper.fuzzySearchEx(filter, config);
    dispatch(action.update({options: returnCode === 0 ? result : undefined}, 'filters', {key: 'key', value: key}));
  };

  const changeActionCreator = (key, value) => {
    return action.assign({[key]: value}, 'searchData');
  };

  //点击搜索按钮
  const searchActionCreator = () => async (dispatch, getState) => {
    const {pageSize, searchData, urlList} = getSelfState(getState());
    const newState = {searchDataBak: searchData, currentPage: 1, sortInfo:{}, filterInfo:{}};
    return search2(dispatch, action, urlList, 1, pageSize, searchData, newState, undefined, false);
  };

  //点击排序按钮
  const sortActionCreator = () => async (dispatch, getState) => {
    const {filters} = getSelfState(getState());
    const newFilters = await showFilterSortDialog(filters, helper.getRouteKey());
    newFilters && dispatch(action.assign({filters: newFilters}));
  };

  const resetActionCreator = () => (dispatch) => {
    dispatch(action.assign({searchData: {}}));
  };

  const checkActionCreator = (isAll, checked, rowIndex) => {
    isAll && (rowIndex = -1);
    return action.update({checked}, ['tableItems'], rowIndex);
  };

  const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
    const {pageSize, searchDataBak={}, urlList} = getSelfState(getState());
    const newState = {currentPage, sortInfo:{}, filterInfo:{}};
    return search2(dispatch, action, urlList, currentPage, pageSize, searchDataBak, newState, undefined, false);
  };

  const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
    const {searchDataBak={}, urlList} = getSelfState(getState());
    const newState = {pageSize, currentPage, sortInfo:{}, filterInfo:{}};
    return search2(dispatch, action, urlList, currentPage, pageSize, searchDataBak, newState, undefined, false);
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
    const {tableCols, tableItems} = getSelfState(getState());
    return exportExcelFunc(tableCols, tableItems);
  };

  //查询导出
  const allExportActionCreator = () => (dispatch, getState) => {
    const {tableCols, searchData, fixedFilters, urlExport} = getSelfState(getState());
    const realSearchData = {...searchData, ...fixedFilters};
    return commonExport(tableCols, urlExport, realSearchData, true, false, 'post', false);
  };

  //前端表格排序和过滤
  const tableChangeActionCreator = (sortInfo, filterInfo) => (dispatch) => {
    dispatch(action.assign({sortInfo, filterInfo}));
  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const actionCreators = {
    //可覆写的响应
    onClickReset: resetActionCreator,     //点击重置按钮
    onClickSearch: searchActionCreator,   //点击搜索按钮
    onClickSort: sortActionCreator,   //点击排序按钮
    onConfig: configActionCreator,        //点击配置字段按钮
    onWebExport: webExportActionCreator, //点击页面导出按钮
    onAllExport: allExportActionCreator, //点击查询导出按钮
    onChange: changeActionCreator,        //过滤条件输入改变
    onSearch: searchOptionsActionCreator, //过滤条件为search控件时的下拉搜索响应
    onCheck: checkActionCreator,          //表格勾选响应
    onTableChange: tableChangeActionCreator,  //表格组件过滤条件或排序条件改变响应
    onPageNumberChange: pageNumberActionCreator,  //页数改变响应
    onPageSizeChange: pageSizeActionCreator,      //每页记录条数改变响应
    //可扩展的响应
    // onClick: 按钮点击响应 func(tabKey, buttonKey)
    // onDoubleClick: 表格双击响应 func(tabKey, rowIndex)
    // onLink: 表格点击链接响应 func(tabKey, key, rowIndex, item)
    ...actionCreatorsEx
  };

  return connect(mapStateToProps, actionCreators)(OrderPage);
};

/*
* 功能：构造列表页面的公共初始化状态
 * 参数：urlConfig - [必需] 获取界面配置的url
 *       urlList - [必需] 获取列表数据的url
 *       statusNames - [可选] 需要获取的来自状态字典的表单状态下拉的表单类型值数组
 *       isSort - [可选] 是否需要查询排序
* 返回：成功返回初始化状态，失败返回空
* */
const buildOrderPageCommonState = async (urlConfig, urlList, statusNames=[], isSort=false) => {
  try {
    //获取并完善config
    const config = helper.getJsonResult(await helper.fetchJson(urlConfig));
    const dic = helper.getJsonResult(await fetchAllDictionary());
    for (let item of statusNames) {
      dic[item] = helper.getJsonResult(await getStatus(item));
    }
    setDictionary2(dic, config.filters, config.tableCols);
    //处理按钮权限(要求按钮权限的资源代码结构为"上级资源代码_按钮key")
    config.buttons = config.buttons.filter(btn => helper.getActions(helper.getRouteKey(), true).includes(btn.key));
    //获取列表数据
    const {pageSize, fixedFilters={}, searchDataBak={}} = config;
    const body = {
      itemFrom: 0,
      itemTo: pageSize,
      ...fixedFilters,
      ...searchDataBak
    };
    const data = helper.getJsonResult(await helper.fetchJson(urlList, helper.postOption(body)));
    return {
      searchData:{},
      searchDataBak: {},
      ...config,
      urlList,
      isSort,
      maxRecords: data.returnTotalItem || data.returnTotalItems,
      tableCols: helper.initTableCols(helper.getRouteKey(), config.tableCols),
      filters: helper.initFilters(helper.getRouteKey(), config.filters),
      tableItems: data.data || [],
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
* */
const updateTable = (dispatch, action, selfState) => {
  const {currentPage, pageSize, searchDataBak={}, urlList} = selfState;
  const newState = {sortInfo:{}, filterInfo:{}};
  return search2(dispatch, action, urlList, currentPage, pageSize, searchDataBak, newState, undefined, false);
};

export default createOrderPageContainer;
export {buildOrderPageCommonState, updateTable};
