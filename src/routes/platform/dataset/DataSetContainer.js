import { connect } from 'react-redux';
import Dataset from './Dataset';
import {postOption, fetchJson, showSuccessMsg,showError} from '../../../common/common';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search} from '../../../common/search';
import {buildOrderPageState} from './common/orderAdapter';
import {fetchDictionary, setDictionary} from '../../../common/dictionary';



const prefix = ['config', 'dataSet'];
const action = new Action(prefix);
const URL_CONFIG = '/api/config/dataset/config';
const URL_DATA = '/api/config/dataset/data';
const URL_OUTPUT_LIST = '/api/config/dataset/outputList';
const DATASET_LIST_API = '/api/config/dataset/list';
const DATASET_DEL_API = '/api/config/dataset/del';
const DATASET_ADD_API = '/api/config/dataset/add';
const DATASET_GET_API = '/api/config/dataset/get';

const getSelfState = (rootState) => {     // 获取对应的state
  return getPathValue(rootState, prefix);
};

const buildState = (config, itemsData,config1,itemsData1) => {
  const tabs = [
    {
      key: 'data_set',
      title: '报表模板类型',
      close: false,
    },
    {
      key: 'data_set1',
      title: '输出类型定义',
      close: false,
    }
  ];
  return {
    status: 'page',
    tabs,
    ...config.result,
    tableItems: itemsData.result.data || {},
    totalItems: itemsData.result.returnTotalItems || itemsData.result.returnTotalItem || 0,
    activeKey: 'data_set',
    dataSet1: buildOrderPageState(itemsData1.result, config1.result.index, {editConfig: config1.result.edit})
  };
};

const initActionCreator = () => async (dispatch) => {    // 初始化state
  dispatch(action.assign({status: 'loading'}));
  const config = await fetchJson(URL_CONFIG);
  const config1 = await fetchJson(URL_DATA);
  if (config.returnCode === 0 && config1.returnCode === 0) {
    const itemsData = await search(DATASET_LIST_API, 0, config.result.pageSize, config.result.searchData);
    const itemsData1 = await search(URL_OUTPUT_LIST,0, config1.result.index.pageSize, {});
    if (itemsData.returnCode === 0 && itemsData1.returnCode === 0 ) {
      const {tableCols, filters} = config1.result.index;
      const {controls} = config1.result.edit;
      let data = await fetchDictionary(config1.result.dicNames);
      if (data.returnCode !== data.returnCode) {
        showError(data.returnMsg);
        dispatch(action.assign({status: 'retry'}));
        return;
      }
      setDictionary(tableCols, data.result);
      setDictionary(filters, data.result);
      setDictionary(controls, data.result);
      const payload = buildState(config,itemsData,config1,itemsData1);
      dispatch(action.create(payload));
    } else {
      dispatch(action.assign({status: 'retry'}));
    }
  } else {
    dispatch(action.assign({status: 'retry'}));
  }
};

const searchActionCreator = () => async (dispatch, getState) => {  // 搜索事件
  const state = getSelfState(getState());
  const itemsData = await search(DATASET_LIST_API, 0, state.pageSize, state.searchData);
  if (itemsData.returnCode === 0) {
    dispatch(action.assign({
      ...state,
      tableItems: itemsData.result.data,
      totalItems: itemsData.result.returnTotalItems || itemsData.result.returnTotalItem,
      currentPage: 1,
    }));
  }
}

const addActionCreator = (obj, type) => async (dispatch, getState) => {   // 记录提交事件
  const state = getSelfState(getState());
  const addResult = await fetchJson(DATASET_ADD_API, postOption(obj));
  const msg = {add: '新增', edit: '编辑', copyAdd: '复制新增'};
  if (addResult.returnCode === 0) {
    const from = state.pageSize * (state.currentPage - 1);
    const to = state.pageSize * state.currentPage;
    const itemsData = await search(DATASET_LIST_API, from, to, state.searchData);
    if (itemsData.returnCode === 0) {
      dispatch(action.assign({
        ...state,
        editData: {},
        tableItems: itemsData.result.data,
        totalItems: itemsData.result.returnTotalItems || itemsData.result.returnTotalItem,
        currentPage: state.currentPage,
      }));
      showSuccessMsg(`${msg[type]}成功`);
    }
  }
};

const getActionCreator = (obj, type) => async (dispatch) => {
  const getResult = await fetchJson(DATASET_GET_API, postOption(obj));
  const editData = getResult.result;
  if (getResult.returnCode === 0) {
    if (type === 'copyAdd') {
      delete editData.modeName;
      delete editData.modeCode;
      dispatch(action.assign({editData: editData}));
    } else {
      dispatch(action.assign({editData: editData}));
    }
  }

}

const clearEditDataActionCreator = () => async (dispatch) => {
  dispatch(action.assign({editData: {}}));
}

const delActionCreator = (obj) => async (dispatch, getState) => {   // 删除记录事件
  const state = getSelfState(getState());
  const delResult = await fetchJson(DATASET_DEL_API, postOption(obj));
  if (delResult.returnCode === 0) {
    const from = state.pageSize * (state.currentPage - 1);
    const to = state.pageSize * state.currentPage;
    const itemsData = await search(DATASET_LIST_API, from, to, state.searchData);
    if (itemsData.returnCode === 0) {
      dispatch(action.assign({
        ...state,
        tableItems: itemsData.result.data,
        totalItems: itemsData.result.returnTotalItems || itemsData.result.returnTotalItem,
        currentPage: state.currentPage,
      }));
      showSuccessMsg('删除成功');
    }
  }
}

const pageNumberChangeActionCreator =  (page) => async (dispatch, getState) => {  // 修改当前页数
  const state = getSelfState(getState());
  const from = state.pageSize * (page - 1);
  const to = state.pageSize * page;
  const itemsData = await search(DATASET_LIST_API, from, to, state.searchData);
  if (itemsData.returnCode === 0) {
    dispatch(action.assign({
      ...state,
      tableItems: itemsData.result.data,
      totalItems: itemsData.result.returnTotalItems || itemsData.result.returnTotalItem,
      currentPage: page,
    }));
  }
  dispatch(action.assign({currentPage: page}))
}

const pageSizeChangeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {  // 修改分页条数
  const state = getSelfState(getState());
  const itemsData = await search(DATASET_LIST_API, 0, pageSize, state.searchData);
  if (itemsData.returnCode === 0) {
    dispatch(action.assign({
      ...state,
      pageSize: pageSize,
      tableItems: itemsData.result.data,
      totalItems: itemsData.result.returnTotalItems || itemsData.result.returnTotalItem,
      currentPage: 1,
    }));
  }
  dispatch(action.assign({pageSize: pageSize}))
}


const searchDataOnChangeActionCreator = (obj) => (dispatch) => {  // 搜索数据更新
  dispatch(action.assign({searchData: obj}));
}

const checkActionCreator = (isAll, checked, rowIndex) => (dispatch, getState) =>{  // 列表数据勾选事件
  // isAll && (rowIndex = -1);
  if (isAll) return;
  const state = getSelfState(getState());
  state.tableItems.forEach((item, index) => {
    if (item.checked) {
      dispatch(action.update({checked: false}, 'tableItems', index)) ;
    }
  });
  dispatch(action.update({checked}, 'tableItems', rowIndex)) ;
};

const tabChangeActionCreator = (key) => async (dispatch,getState) =>  {
  dispatch(action.assign({activeKey: key}));
};


const mapStateToProps = (state) => {     // 返回state
  return getSelfState(state);
};

const actionCreators = {   // 返回action
  onInit: initActionCreator,
  onSearch: searchActionCreator,
  onSearchDataOnChange: searchDataOnChangeActionCreator,
  onPageNumberChange:pageNumberChangeActionCreator,
  onPageSizeChange: pageSizeChangeActionCreator,
  onCheck: checkActionCreator,
  onDel: delActionCreator,
  onGet: getActionCreator,
  onAdd: addActionCreator,
  onClearEditData: clearEditDataActionCreator,
  onTabChange: tabChangeActionCreator
};



const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(Dataset));
export default Container;
