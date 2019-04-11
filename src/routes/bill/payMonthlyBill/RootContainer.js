import React from 'react';
import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import createTabPage from '../../../standard-business/createTabPage';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from '../../../action-reducer/action';
import helper from '../../../common/common';
import {search} from '../../../common/search';
import {buildOrderPageState} from '../../../common/state';
import {getDictionaryNames, fetchDictionary, setDictionary2,getStatus} from '../../../common/dictionary';


const URL_CONFIG =  '/api/bill/pay_monthly_bill/config';
const URL_LIST = '/api/bill/pay_monthly_bill/list';//查询列表


const STATE_PATH = ['payMonthlyBill'];
const action = new Action(STATE_PATH);

import OrderPageContainer from './OrderPageContainer';
import AddContainer from './AddTabContainer';
import EditContainer from './EditTabContainer';


const getSelfState = (rootState) => {
  return getPathValue(rootState,STATE_PATH)
};

const initActionCreator = () => async (dispatch) => {
  try{
    let date,year,oldYear,allYear;
    dispatch(action.assign({status: 'loading'}));
    //初始化数据
    const { index ,edit,addDialog ,editDialog} = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    //页面数据
    const list = helper.getJsonResult(await search(URL_LIST, 0, index.pageSize, {}));
    //字典
    const names = getDictionaryNames(index.tableCols,index.filters,edit.cols,editDialog.cols);

    const dictionary = helper.getJsonResult(await fetchDictionary(names));
    //获取状态字典
    const status = helper.getJsonResult(await getStatus("payable_month_bill"));
    const dictResult = {...dictionary, status_type1:status};
    setDictionary2(dictResult, index.tableCols,index.filters,edit.cols,addDialog.tableCols,editDialog.cols);
    //设置年份下拉 从2018年到当前年份
    date = new Date;
    year = date.getFullYear();

    oldYear = 2018;
    allYear = [];
    while (oldYear <= year) {
      allYear.push({
        title: oldYear,
        value: oldYear
      });
      oldYear++
    }

    helper.setOptions('periodOfyear', index.filters, allYear);
    helper.setOptions('periodOfyear', edit.controls, allYear);

    dispatch(action.assign({
      status: 'page',
      index: buildOrderPageState(list, index, {tabKey: 'index'}),
      activeKey: 'index',
      tabs: [{key: 'index', title: '应付月帐单', close: false}],
      editConfig:edit,
      addDialog,
      editDialog
    }));

  }catch (e){
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }


};

//tab切换事件
const tabChangeActionCreator = (key) => {
  return action.assign({activeKey: key});
};

//tab关闭事件
const tabCloseActionCreator = (key) => (dispatch, getState) => {
  const {activeKey, tabs} = getSelfState(getState());
  const newTabs = tabs.filter(tab => tab.key !== key);
  if (activeKey === key) {
    let index = tabs.findIndex(tab => tab.key === key);
    (newTabs.length === index) && (index--);
    dispatch(action.assign({tabs: newTabs, [activeKey]: undefined, activeKey: newTabs[index].key}));
  } else {
    dispatch(action.assign({tabs: newTabs, [key]: undefined}));
  }
};



const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator,
  onTabClose: tabCloseActionCreator
};


const mapStateToProps = (state) => {
  return getSelfState(state)
};

//根据activeKey不同显示不同的组件
const getComponent = (activeKey) => {
  if (activeKey === 'index') {
    return OrderPageContainer;
  }else if(activeKey === 'add'){
    return AddContainer
  }else if(activeKey.indexOf('edit_') === 0){
    return EditContainer
  }
};



const RootContainer = connect(mapStateToProps, actionCreators)(EnhanceLoading(createTabPage(getComponent)));
export default RootContainer;
