import { connect } from 'react-redux';
import { Action } from '../../../action-reducer/action';
import { EnhanceLoading } from '../../../components/Enhance';
import helper from '../../../common/common';
import {getPathValue} from '../../../action-reducer/helper';
import { search } from '../../../common/search';
import {buildOrderPageState} from '../../../common/state';
import createTabPage from '../../../standard-business/createTabPage';
import NewModelContainer from './New/NewModelContainer';
import OrderPageContainer from './OrderPageContainer';

const STATE_PATH = ['basic', 'excelConfigLib'];
const URL_CONFIG = '/api/basic/excelConfigLib/config';
const URL_LIST = '/api/basic/excelConfigLib/list';
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

//初始化
const initActionCreator = () => async (dispatch) => {
  try{
    dispatch(action.assign({status: 'loading'}));
    const {index, edit} = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    const list = helper.getJsonResult(await search(URL_LIST, 0, index.pageSize, {}));
    const tabs = [{ key: 'index', title: index.title, close: false }];
    const searchData = {};
    const other = { tabs, activeKey: 'index', currentPage: 1, searchData, editConfig: edit, status: 'page'};
    const payload = buildOrderPageState(list, index, other);
    payload.editConfig.tabs = [{key: 'baseInfo', title: 'Sheet 1'}];
    payload.editConfig.CURRNT_TABLE_CODE = 'baseInfo';
    dispatch(action.create(payload));
  }catch (e){
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

//Tab页签切换
const tabChangeActionCreator = (key) => {
  return action.assign({activeKey: key})
};

//关闭页签
const tabCloseActionCreator = (key) => (dispatch, getState) => {
  const {activeKey, tabs} = getSelfState(getState());
  const newTabs = tabs.filter(tab => tab.key !== key);
  let index = tabs.findIndex(tab => tab.key === key);
  // 如果tab刚好是最后一个，则直接减一，
  (newTabs.length === index) && (index--);
  if (key !== 'index') {
    dispatch(action.assign({ tabs: newTabs, [key]: undefined, activeKey: newTabs[index].key}));
  } else {
    dispatch(action.assign({}));
  }
};

const getComponent = (activeKey) => {
  if(activeKey === 'index'){
    return OrderPageContainer
  }else{
    return NewModelContainer
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator,
  onTabClose: tabCloseActionCreator,
};

const ExcelConfigLibContainer = connect(mapStateToProps, actionCreators)(EnhanceLoading(createTabPage(getComponent)));
export default ExcelConfigLibContainer;
