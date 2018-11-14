import { connect } from 'react-redux';
import OrderPage from './components/OrderPage';
import helper from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import  EditContainer from './EditContainer'
import showPopup from '../../../standard-business/showPopup';
import {buildEditState} from './EditContainer'

const STATE_PATH =  ['platform', 'messageTheme'];
const URL_LIST = '/api/platform/messageTheme/list';
const URL_DEL = '/api/platform/messageTheme/del';

//刷新表格
const updateTable = async (dispatch, getState) => {
  const {tabKey} = getSelfState(getState());
  const list = helper.getJsonResult(await helper.fetchJson(URL_LIST,'post'));
  dispatch(action.assign({tableItems:list}, tabKey));
};

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, STATE_PATH);
  return parent[parent.activeKey];
};


const addActionCreator = (dispatch, getState) => {
  const {editConfig} = getPathValue(getState(), STATE_PATH);
  if(buildEditState(editConfig, {},false,dispatch)){
    showPopup(EditContainer, {refreshTable:updateTable});
  }

};

const editActionCreator = (dispatch, getState) => {
  const {editConfig} = getPathValue(getState(), STATE_PATH);
  const {tableItems} = getSelfState(getState());

  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条记录进行编辑');
    return;
  }
  if(buildEditState(editConfig, tableItems[index],true,dispatch)){
    showPopup(EditContainer, {refreshTable:updateTable});
  }

};

const delActionCreator = async(dispatch,getState) => {
  const {tableItems} = getSelfState(getState());

  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条记录进行删除');
    return;
  }

  const {returnCode,returnMsg} = await helper.fetchJson(`${URL_DEL}/${tableItems[index].id}`,'delete')
  if(returnCode != 0){
    helper.showError(returnMsg)
    return
  }
  helper.showSuccessMsg('删除成功')
  return updateTable(dispatch,getState)

}

const toolbarActions = {
  add:addActionCreator,
  edit:editActionCreator,
  del:delActionCreator
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const doubleClickActionCreator = (rowIndex) => (dispatch, getState) => {
  const {editConfig} = getPathValue(getState(), STATE_PATH);
  const {tableItems} = getSelfState(getState());
  if(buildEditState(editConfig, tableItems[rowIndex],true,dispatch)){
    showPopup(EditContainer, {refreshTable:updateTable});
  }

};

const changeActionCreator = (key, value) => (dispatch,getState) =>{
  const {tabKey} = getSelfState(getState());
  dispatch(action.assign({[key]: value}, [tabKey, 'searchData']));
};



const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch, getState) =>{
  const {tabKey} = getSelfState(getState());
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, [tabKey, 'tableItems'], rowIndex));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onDoubleClick: doubleClickActionCreator,
};

const MessageThemeContainer = connect(mapStateToProps, actionCreators)(OrderPage);
export default MessageThemeContainer;

