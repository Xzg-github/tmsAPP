import { connect } from 'react-redux';
import EditPage from './EditPage';
import helper, {postOption, showError, fetchJson, getJsonResult, showSuccessMsg, fuzzySearchEx, convert} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {EnhanceLoading} from '../../../../components/Enhance';
import showJoinDialog from './JoinDialog/JoinDialog';
import execWithLoading from '../../../../standard-business/execWithLoading';
import {updateOne} from '../../../../action-reducer/array';

const PARENT_STATE_PATH = ['receiveBill'];
const STATE_PATH = ['receiveBill', 'edit'];
const action = new Action(STATE_PATH);
const URL_DETAIL = '/api/bill/receiveBill/detail';
const URL_JION_LIST = '/api/bill/receiveBill/joinList';
const URL_JION = '/api/bill/receiveBill/joinDetail';
const URL_REMOVE = '/api/bill/receiveBill/removeDetail';
const URL_SAVE = '/api/bill/receiveBill/save';
const URL_SEND = '/api/bill/receiveBill/send';
const URL_CURRENCY = `/api/bill/receiveMake/currency`;
const URL_CONTACTS = `/api/bill/receiveBill/cunstomer_contacts`;
const URL_HEADER_INDO = `/api/bill/receiveBill/consignee_consignor`;


const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, PARENT_STATE_PATH);
  return parent[parent.activeKey];
};

const changeActionCreator = (key, value) => async (dispatch, getState) =>  {
  dispatch(action.assign({[key]: value}, 'value'));
};

const formSearchActionCreator = (KEY, key, filter, control) => async (dispatch, getState) => {
  const {controls, value} = getSelfState(getState());
  const customerId = value['payCustomerId'].value;
  let result;
  if (control.searchType) {
    result = getJsonResult(await fuzzySearchEx(filter, control));
  } else {
    switch (key) {
      case 'currency': {
        result = getJsonResult(await fetchJson(URL_CURRENCY, postOption({currencyTypeCode: filter, maxNumber: 65536})));
        break;
      }
      case 'customerContact': {
        result = getJsonResult(await fetchJson(URL_CONTACTS, postOption({customerId})));
        break;
      }
      case 'customerHeaderInformation': {
        result = getJsonResult(await fetchJson(URL_HEADER_INDO, postOption({customerId, name: filter})));
        break;
      }
    }
  }
  const options = result.data ? result.data : result;
  const controlsIndex = controls.findIndex(o => o.key === KEY);
  const index = controls[controlsIndex].data.findIndex(item => item.key === key);
  const data = updateOne(controls[controlsIndex].data, index, {options});
  dispatch(action.update({data}, ['controls'], controlsIndex));
};

const onContentChangeActionCreator = (KEY, rowIndex, keyName, keyValue) => async (dispatch, getState) =>  {
  dispatch(action.update({[keyName]: keyValue}, ['value', KEY], rowIndex));
};

const checkActionCreator = (KEY, rowIndex, key, checked) => (dispatch, getState) => {
  dispatch(action.update({checked}, ['value', KEY], rowIndex));
};

const joinActionCreator = (KEY) => async (dispatch, getState) => {
  const {value, joinDialogTableCols, id} = getSelfState(getState());
  const {returnCode, result, returnMsg} = await helper.fetchJson(`${URL_JION_LIST}/${id}`);
  if (returnCode !== 0) return showError(returnMsg);
  const params = {
    cols: joinDialogTableCols,
    items: result,
  };
  const onOk = async (resultItems=[]) => {
    if (!resultItems) return;
    const params = {incomeDetailIdList: resultItems, id};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_JION, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    const newItems = value[KEY].concat(resultItems);
    dispatch(action.assign({[KEY]: newItems}, 'value'));
  };
  await showJoinDialog(params, onOk);
};

const removeActionCreator = (KEY) => async (dispatch, getState) =>  {
  const {value} = getSelfState(getState());
  const checkList = value[KEY].filter(item => item.checked);
  if (checkList.length === 0) return showError('请勾选一条数据！');
  const params = {incomeDetailIdList: checkList, id};
  const {returnCode, result, returnMsg} = await helper.fetchJson(URL_REMOVE, postOption(params));
  if (returnCode !== 0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  const notCheckList = value[KEY].filter(item => !item.checked);
  dispatch(action.assign({[KEY]: notCheckList}, 'value'));
};

const changeSortActionCreator  = (KEY) => async (dispatch, getState) => {
  const {value} = getSelfState(getState());
  const newItems = value[KEY].sort((a, b) => a.sequence > b.sequence);
  dispatch(action.assign({[KEY]: newItems}, 'value'));
};

const closeActionCreator = () => (dispatch, getState) => {
  const { tabs, activeKey } = getPathValue(getState(), PARENT_STATE_PATH);
  const newTabs = tabs.filter(tab => tab.key !== activeKey);
  let index = tabs.findIndex(tab => tab.key === activeKey);
  index--;
  dispatch(action.assignParent({ tabs: newTabs, activeKey: newTabs[index].key, [activeKey]: undefined }));
};

const saveActionCreator = () => async (dispatch, getState) => {
  execWithLoading(async () => {
    const {value} = getSelfState(getState());
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_SAVE, postOption(...convert(value)));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    closeActionCreator()(dispatch, getState);
  });
};

const sendActionCreator = () => async (dispatch, getState) => {
  execWithLoading(async () => {
    const {value} = getSelfState(getState());
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_SEND, postOption(...convert(value)));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    closeActionCreator()(dispatch, getState);
  });
};

const buttons = {
  join: joinActionCreator,
  remove: removeActionCreator,
  changeSort: changeSortActionCreator,
  close: closeActionCreator,
  save: saveActionCreator,
  send: sendActionCreator
};

const clickActionCreator = (KEY, key) => {
  if (buttons.hasOwnProperty(key)) {
    return buttons[key](KEY);
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const exitValidActionCreator = (KEY) => action.assign({valid: KEY});

const buildEditPageState = async (config, itemData, readonly) => {
  const detailData = getJsonResult(await fetchJson(`${URL_DETAIL}/${itemData.id}`));
  const {receivableBillChargeList: costInfo, ...formValue} = detailData;
  return {
    ...config,
    ...itemData,
    readonly,
    value: {...formValue, costInfo, orderNumber: itemData.orderNumber},
    status: 'page'
  };
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    const {readonly, config, itemData} = getSelfState(getState());
    dispatch(action.assign({status: 'loading'}));
    const payload = await buildEditPageState(config, itemData, readonly);
    dispatch(action.assign(payload));
  } catch (e) {
    showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onInit: initActionCreator,
  onCheck: checkActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onContentChange: onContentChangeActionCreator,
  onExitValid: exitValidActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage));
export default Container;
