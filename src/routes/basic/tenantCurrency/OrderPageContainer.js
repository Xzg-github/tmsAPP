import { connect } from 'react-redux';
import TenantCurrency from './TenantCurrency';
import helper, {postOption, getObject,fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildEditPageState} from './common/state';


const STATE_PATH = ['basic', 'tenantCurrency'];
const action = new Action(STATE_PATH);

const URL_JOIN = '/api/basic/tenantCurrency/join'; //获取币种编码
const URL_SETUP = '/api/basic/tenantCurrency/set_up'; //设置主币种
const URL_DELETE = '/api/basic/tenantCurrency/delete'; //移除数据

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};


const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};



const newActions = async (dispatch, getState) => {
  const {joinConfig, tableItems} = getSelfState(getState());
  const list = await fetchJson(URL_JOIN);
  if (list.returnCode !== 0 ) {
    showError(list.returnMsg);
    return;
  }
  joinConfig.options = list.result;
  const payload = buildEditPageState(joinConfig, {});
  dispatch(action.assign(payload, 'join'));

};


const setActions = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const {id} = tableItems[index];
    const {returnCode, result, returnMsg} = await fetchJson(`${URL_SETUP}/${id}`, 'put');
    if (returnCode !== 0) {
      showError(returnMsg);
      return;
    }
    dispatch(action.assign({tableItems: result}));
  }
};

const idList = (items) => {
  const list = items.reduce((result, item) => {
    item.checked && result.push(item.id);
    return result;
  }, []);
  return list;
};

const deleteActions = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const newItems = tableItems.filter(items => !items.checked);
  const idArray = idList(tableItems);
  const {returnCode, returnMsg} = await fetchJson(URL_DELETE, postOption(idArray));
  if (returnCode !== 0) {
    showError(returnMsg);
    return
  }
  dispatch(action.assign({tableItems: newItems}));
};

const toolbarActions = {
  new: newActions,
  set: setActions,
  delete: deleteActions
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
  return getObject(getSelfState(state), TenantCurrency.PROPS);
};

const actionCreators = {
  onClick: clickActionCreator,
  onCheck: checkActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(TenantCurrency);
export default Container;



