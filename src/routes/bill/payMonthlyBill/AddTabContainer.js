/**
 *新增界面
 */
import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import helper from '../../../common/common';
import execWithLoading from '../../../standard-business/execWithLoading';
import EditPage from './EditPage';
import {buildPageState} from './OrderPageContainer'

const STATE_PATH =  ['payMonthlyBill'];
const action = new Action(STATE_PATH);

const URL_SAVE = '/api/bill/pay_monthly_bill/add';//保存
const URL_CURRENCY = '/api/bill/pay_monthly_bill/supplierId';//根据id获取对账币种

const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, STATE_PATH);
  return parent[parent.activeKey];
};

const initActionCreator = () => async (dispatch, getState) => {
  const {editConfig} = getPathValue(getState(), STATE_PATH);
  const {tabKey,value} = getSelfState(getState());
  dispatch(action.assign({status: 'loading'}, tabKey));
  try {

    dispatch(action.assign({
      ...editConfig,
      value,
      tableItems:[],
      status: 'page',
      options: {},
      valid:false
    }, tabKey));


  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}, tabKey));
  }
};

const changeActionCreator = (key, value) => async(dispatch, getState) => {
  const {tabKey} = getSelfState(getState());
  if(key === 'supplierId' && value){
    const {returnCode,returnMsg,result} = await helper.fetchJson(`${URL_CURRENCY}/${value.value}`);
    if(returnCode !== 0){
      helper.showError(returnMsg);
      return
    }
    //币种由结算单温带出
    dispatch(action.assign({['currency']: result.balanceCurrency}, [tabKey, 'value']));
  }

  dispatch(action.assign({[key]: value}, [tabKey, 'value']));
};

const searchActionCreator = (key, value, control) => async (dispatch, getState) => {
  const {tabKey} = getSelfState(getState());
  const path = [tabKey, 'options'];
  const json = await helper.fuzzySearchEx(value,control);
  if (!json.returnCode) {
    dispatch(action.assign({[key]: json.result}, path));
  }
};

const exitValidActionCreator = () => (dispatch, getState) => {
  const {tabKey} = getSelfState(getState());
  dispatch(action.assign({valid: false}, tabKey));
};

const closeActionCreator = (props) => () => {
  props.close(props.tabKey);
};


const saveActionCreator = (props) => (dispatch, getState) => {
  const {tabs} = getPathValue(getState(),STATE_PATH);
  execWithLoading(async () => {
    if (helper.validValue(props.controls, props.value)) {


      const {returnCode,returnMsg,result} = await helper.fetchJson(URL_SAVE,helper.postOption(helper.convert(props.value)));
      if(returnCode !== 0){
        helper.showError(returnMsg);
        return
      }
      helper.showSuccessMsg('保存成功');
      //新增保存后进入编辑页面
      let key = 'edit_'+result.billNumber;
      let title =  result.billNumber;
      let newTabs = tabs.filter (tab => tab.key!=='add');
      dispatch(action.assign(buildPageState (newTabs, key,title,false,result)));


    }else {
      dispatch(action.assign({valid: true},props.tabKey));
    }

  });
};

const onLinkActionCreator = (key, rowIndex, item)  => async (dispatch,getState) => {
  const {tableItems} = getSelfState(getState());

};


const toolbarActions = {
  close: closeActionCreator,
  save: saveActionCreator
};

const clickActionCreator = (props, key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key](props);
  } else {
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onChange: changeActionCreator,
  onSearch: searchActionCreator,
  onExitValid: exitValidActionCreator,
  onClick: clickActionCreator,
  onLink: onLinkActionCreator,
};

export default connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage));
