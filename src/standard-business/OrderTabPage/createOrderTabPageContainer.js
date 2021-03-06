import { connect } from 'react-redux';
import OrderTabPage from './OrderTabPage';
import helper, {showError} from '../../common/common';
import {search} from '../../common/search';
import {showColsSetting} from '../../common/tableColsSetting';
import showFilterSortDialog from "../../common/filtersSort";
import {fetchAllDictionary, setDictionary2, getStatus} from "../../common/dictionary";
import {exportExcelFunc, commonExport} from '../../common/exportExcelSetting';
import showTemplateManagerDialog from "../template/TemplateContainer";

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

  const searchOptionsActionCreator = (key, filter, config) => async (dispatch) => {
    const {returnCode, result} = await helper.fuzzySearchEx(filter, config);
    dispatch(action.update({options: returnCode === 0 ? result : undefined}, 'filters', {key: 'key', value: key}));
  };

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

  //点击排序按钮
  const sortActionCreator = () => async (dispatch, getState) => {
    const {filters} = getSelfState(getState());
    const newFilters = await showFilterSortDialog(filters, helper.getRouteKey());
    newFilters && dispatch(action.assign({filters: newFilters}));
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
  const configActionCreator = () => async (dispatch, getState) => {
    const {tableCols, buttons} = getSelfState(getState());
    const okFunc = (newCols) => {
      const newButtons = Object.keys(buttons).reduce((result, key) => {
        result[key] = dealExportButtons(buttons[key], newCols);
        return result;
      }, {});
      dispatch(action.assign({tableCols: newCols, buttons: newButtons}));
    };
    showColsSetting(tableCols, okFunc, helper.getRouteKey());
  };

  //页面导出
  const webExportActionCreator = (tabKey, subKey) => (dispatch, getState) => {
    const {tableCols=[]} = JSON.parse(subKey);
    const {tableItems, subActiveKey} = getSelfState(getState());
    return exportExcelFunc(tableCols, tableItems[subActiveKey]);
  };

  //查询导出
  const allExportActionCreator = (tabKey, subKey) => (dispatch, getState) => {
    const {tableCols=[]} = JSON.parse(subKey);
    const {searchData, subActiveKey, urlExport, fixedFilters={}} = getSelfState(getState());
    const realSearchData = {...searchData, ...fixedFilters[subActiveKey]};
    return commonExport(tableCols, urlExport, realSearchData, true, false, 'post', false);
  };

  //模板管理
  const templateManagerActionCreator = () => async (dispatch, getState) => {
    const {tableCols, buttons} = getSelfState(getState());
    if(true === await showTemplateManagerDialog(tableCols, helper.getRouteKey())) {
      const newButtons = Object.keys(buttons).reduce((result, key) => {
        result[key] = dealExportButtons(buttons[key], tableCols);
        return result;
      }, {});
      dispatch(action.assign({buttons: newButtons}));
    }
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
    onClickSort: sortActionCreator,     //点击排序按钮
    onConfig: configActionCreator,        //点击配置字段按钮
    onWebExport: webExportActionCreator, //点击页面导出按钮
    onAllExport: allExportActionCreator, //点击查询导出按钮
    onTemplateManager: templateManagerActionCreator, //点击模板管理
    onChange: changeActionCreator,        //过滤条件输入改变
    onSearch: searchOptionsActionCreator, //过滤条件为search控件时的下拉搜索响应
    onCheck: checkActionCreator,          //表格勾选响应
    onTableChange: tableChangeActionCreator,  //表格组件过滤条件或排序条件改变响应
    onPageNumberChange: pageNumberActionCreator,  //页数改变响应
    onPageSizeChange: pageSizeActionCreator,      //每页记录条数改变响应
    onSubTabChange: tabChangeActionCreator,          //列表页签切换响应
    //可扩展的响应
    // onClick: 按钮点击响应 func(tabKey, buttonKey)
    // onSubClick: 按钮二级子列表点击响应 func(tabKey, buttonKey, subKey)
    // onDoubleClick: 表格双击响应 func(tabKey, rowIndex)
    // onLink: 表格点击链接响应 func(tabKey, key, rowIndex, item)
    ...actionCreatorsEx
  };

  return connect(mapStateToProps, actionCreators)(OrderTabPage);
};

//初始化导出按钮下拉项模板列表，参数tableCols需为初始化配置后的
const dealExportButtons = (buttons, tableCols) => {
  return buttons.map(btn => {
    if (btn.key !== 'export' || !btn.menu) {
      return btn;
    }else {
      let newBtn = {...btn};
      newBtn.menu = newBtn.menu.map(menu => {
        if (['webExport', 'allExport'].includes(menu.key)) {
          const subMenu = helper.getTemplateList(helper.getRouteKey(), tableCols);
          return {...menu, subMenu};
        }else {
          return menu;
        }
      });
      return newBtn;
    }
  });
};

/*
* 功能：构造带页签列表页面的公共初始化状态
 * 参数：urlConfig - [必需] 获取界面配置的url
 *       urlList - [必需] 获取列表数据的url
 *       statusNames - [可选] 需要获取的来自状态字典的表单状态下拉的表单类型值数组
 *       home - [可选] 是否来自任务看板的跳转，当为任务看板跳转过来时，home的值为子页签subTabs的key值
 *       isSort - [可选] 是否需要查询排序
* 返回：成功返回初始化状态，失败返回空
* */
const buildOrderTabPageCommonState = async (urlConfig, urlList, statusNames=[], home=false, isSort=false) => {
  try {
    //获取并完善config
    const config = helper.getJsonResult(await helper.fetchJson(urlConfig));
    const dic = helper.getJsonResult(await fetchAllDictionary());
    for (let item of statusNames) {
      dic[item] = helper.getJsonResult(await getStatus(item));
    }
    setDictionary2(dic, config.filters, config.tableCols);
    //初始化查询列表配置
    config.filters = isSort ? helper.initFilters(helper.getRouteKey(), config.filters) : config.filters;
    //初始化列表配置
    config.tableCols = helper.initTableCols(helper.getRouteKey(), config.tableCols);
    //获取列表数据
    let {subActiveKey, subTabs, isTotal, initPageSize, fixedFilters={}, searchDataBak={}, buttons={}} = config;
    if (home && subTabs.filter(item => item.key === home).length === 1) {
      subActiveKey = home;
    }
    const body = {
      itemFrom: 0,
      itemTo: initPageSize,
      ...fixedFilters[subActiveKey],
      ...searchDataBak
    };
    const data = helper.getJsonResult(await helper.fetchJson(urlList, helper.postOption(body)));
    if (!data.tags && data.tabTotal) { //转成统一结构
      data.tags = Object.keys(data.tabTotal).map(item => ({tag: item, count: data.tabTotal[item]}));
    }

    //初始化maxRecords
    const maxRecords = isTotal && data.tags ? subTabs.reduce((obj, tab) => {
      const {count = 0} = data.tags.filter(item => item.tag === tab.status).pop() || {};
      obj[tab.key] = count;
      return obj;
    }, {}) : {[subActiveKey]: data.returnTotalItem || data.returnTotalItems};

    //初始化tableItmes\pageSize\currentPage\isRefresh\buttons
    let tableItems = {}, pageSize={}, currentPage={}, isRefresh={}, finalButtons={};
    subTabs.map(tab => {
      tableItems[tab.key] = [];
      pageSize[tab.key] = initPageSize;
      currentPage[tab.key] = 1;
      isRefresh[tab.key] = true;
      //处理按钮权限(要求按钮权限的资源代码结构为"上级资源代码_按钮key")
      finalButtons[tab.key] = buttons[tab.key] ? buttons[tab.key].filter(btn => helper.getActions(helper.getRouteKey(), true).includes(btn.key)) : [];
      //处理导出按钮模板列表初始化
      finalButtons[tab.key] = dealExportButtons(finalButtons[tab.key], config.tableCols);
    });
    tableItems[subActiveKey] = data.data || [];
    isRefresh[subActiveKey] = false;
    return {
      searchData:{},
      searchDataBak: {},
      ...config,
      subActiveKey,
      urlList,
      isSort,
      pageSize,
      currentPage,
      maxRecords,
      isRefresh,
      tableItems,
      buttons: finalButtons,
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
