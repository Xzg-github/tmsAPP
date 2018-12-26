/**
 *编辑界面
 */
import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import helper from '../../../common/common';
import execWithLoading from '../../../standard-business/execWithLoading';
import EditPage from './EditPage';
import showDiaLog from './addDialog/AddDialogContainer';
import showEditDiaLog from './editDialog/EditDialogContainer';

const STATE_PATH =  ['receiveMonthlyBill'];
const action = new Action(STATE_PATH);

const URL_SAVE = '/api/bill/receive_monthly_bill/add';//保存
const URL_DEL = '/api/bill/receive_monthly_bill/delList';//删除明细
const URL_ONE = '/api/bill/receive_monthly_bill/one';//根据ID获取单条数据

const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, STATE_PATH);
  return parent[parent.activeKey];
};

const initActionCreator = () => async (dispatch, getState) => {
  const {editConfig} = getPathValue(getState(), STATE_PATH);
  const {tabKey,value} = getSelfState(getState());
  dispatch(action.assign({status: 'loading'}, tabKey));
  try {
    let editControls = helper.deepCopy(editConfig.controls);
    for(let e of editControls){
      if(e.key === 'customerId' || e.key === 'currency'){
        e.type = 'readonly'
      }
    }

    dispatch(action.assign({
      ...editConfig,
      controls:editControls,
      value,
      tableItems:value.detailList ? value.detailList : [],
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

const closeActionCreator = (props) => (dispatch,getState) => {
  props.close(props.tabKey);
};

//保存
const saveActionCreator = (props) => (dispatch, getState) => {
  execWithLoading(async () => {
    if (helper.validValue(props.controls, props.value)) {


      const {returnCode,returnMsg,result} = await helper.fetchJson(URL_SAVE,helper.postOption(helper.convert(props.value)));
      if(returnCode !== 0){
        helper.showError(returnMsg);
        return
      }
      helper.showSuccessMsg('保存成功');
      props.close(props.tabKey);

      return props.updateTable(dispatch,getState)
    }else {
      dispatch(action.assign({valid: true},props.tabKey));
    }

  });
};

const onLinkActionCreator = (key, rowIndex, item)  => async (dispatch,getState) => {
  const {tableItems} = getSelfState(getState());

};

//新增明细
const addActionCreator = (props) => async(dispatch,getState) => {
  const {addDialog} = getPathValue(getState(),STATE_PATH);
  const {value} = getSelfState(getState());
  const filters = {
    customerId:props.value.customerId,
    currency:props.value.currency
  };
  let json = await showDiaLog(filters,addDialog,value.id);
  if(json){
    dispatch(action.assign({tableItems:json.detailList,value:json},props.tabKey))
  }
};

//弹框关闭后 刷新表格
const editActionCreator = (props) => async(dispatch,getState) => {
  const {editDialog} = getPathValue(getState(),STATE_PATH);
  const {tableItems,value,tabKey} = getSelfState(getState());
  const items = tableItems.filter(item => item.checked);
  if(items.length === 1){
    let json = await showEditDiaLog(editDialog,tableItems[0],value);
    if(json){
      const json = await helper.fetchJson(`${URL_ONE}/${value.id}`);
      if(json.returnCode !==0 ){
        helper.showError(json.returnMsg);
        return
      }
      dispatch(action.assign({tableItems:json.result.detailList,value:json.result},tabKey))
    }

  }else {
    helper.showError('请勾选一条记录');
  }

};


//删除明细,后端返回结果
const delActionCreator = (props) => async(dispatch,getState) => {
  const {tableItems,value} = getSelfState(getState());
  const items = tableItems.filter(item => item.checked);
  if(items.length > 0) {
    const body = {
      receivableMonthBillId:value.id,
      transportOrderIdList:items.map(item => item.transportOrderId)

    };
    const {result,returnCode,returnMsg} = await helper.fetchJson(URL_DEL,helper.postOption(helper.convert(body),'delete'));
    if(returnCode !==0){
      helper.showError(returnMsg);
      return
    }
    dispatch(action.assign({tableItems:result.detailList,value:result},props.tabKey))
  }else{
    helper.showError('请勾选一条')
  }
};



const toolbarActions = {
  add:addActionCreator,
  del:delActionCreator,
  edit:editActionCreator,
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

const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch,getState) =>{
  const {tabKey} = getSelfState(getState());
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, [tabKey,'tableItems'], rowIndex));
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
  onCheck: checkActionCreator,
};

export default connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage));
