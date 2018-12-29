import { connect } from 'react-redux';
import OrderPage from './OrderPage/OrderPage';
import helper,{fetchJson, getObject, postOption} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showEditDialog from "./EditDialogContainer";

const STATE_PATH = ['platform', 'jurisdiction', 'tenantRuleTypes'];
const action = new Action(STATE_PATH);
const URL_TENANT_LIST  = '/api/config/tenant_authority_distribution/tenant_list';
const URL_LIST  = '/api/platform/jurisdiction/tenantRuleTypes/list';
const URL_JOIN  = '/api/platform/jurisdiction/tenantRuleTypes/join';
const URL_DEL  = '/api/platform/jurisdiction/tenantRuleTypes/del';



const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
  const {filters} = getSelfState(getState());
  let res;
  switch (key) {
    case 'tenantId': {
      const body = {maxNumber:10, name: title};
      res = await fetchJson(URL_TENANT_LIST, postOption(body));
      break;
    }
    default:
      return;
  }
  if (res.returnCode !== 0) return;
  const options = res.result;
  const index = filters.findIndex(item => item.key == key);
  dispatch(action.update({options}, 'filters', index));
};


const changeActionCreator = (key, value) => (dispatch) =>{
  dispatch(action.assign({[key]: value}, 'searchData'));
};

const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch, getState) =>{
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex));
};

const searchAction = async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  if (Object.keys(searchData).length === 0) {
    helper.showError('请选择租户进行查找');
    return
  }
  const {value} = searchData.tenantId;
  const {result} = await fetchJson(`${URL_LIST}/${value}`);
  dispatch(action.assign({tableItems: result}));
};


const resetAction = (dispatch) => {
  dispatch( action.assign({searchData: {}}) );
};

const listId = (list) => {
  const arr = list.reduce((result, items) => {
    result.push({value: items.id, ruleTypeName: items.ruleTypeName});
    return result;
  }, []);
  return arr;
};


const choiceAction = async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  if (Object.keys(searchData).length === 0) {
    helper.showError('请先选择租户');
    return
  }
  const {value} = searchData.tenantId;
  const {result} = await fetchJson(`${URL_JOIN}/${value}`);
  const afterEdit = async () => {
    await searchAction(dispatch, getState);
  };
  return showEditDialog(listId(result), value, afterEdit);
};

const checkId = (tableItems) => {
  const arrId = tableItems.reduce((result, items) => {
    items.checked && result.push(items.id);
    return result;
  }, []);
  return arrId;
};

const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const newItems = tableItems.filter(item => !item.checked);
  const options = postOption(checkId(tableItems), 'delete');
  const {returnCode, returnMsg} = await fetchJson(URL_DEL, options);
  if (returnCode !== 0) {
    helper.showError(returnMsg);
    return;
  }
  dispatch(action.assign({tableItems: newItems}));
  helper.showSuccessMsg('删除成功');
};



const toolbarActions = {
  reset: resetAction,
  search: searchAction,
  choice: choiceAction,
  del: delAction,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onSearch: formSearchActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
