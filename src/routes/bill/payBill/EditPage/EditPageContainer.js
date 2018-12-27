import { connect } from 'react-redux';
import EditPage from './EditPage';
import helper, {postOption, showError, fetchJson, getJsonResult, showSuccessMsg, fuzzySearchEx, convert} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {EnhanceLoading} from '../../../../components/Enhance';
import showJoinDialog from './JoinDialog/JoinDialog';
import execWithLoading from '../../../../standard-business/execWithLoading';
import {updateOne} from '../../../../action-reducer/array';
import {showAddCustomerFactoryDialog} from '../../../config/customerFactory/EditDialogContainer';

const PARENT_STATE_PATH = ['payBill'];
const STATE_PATH = ['payBill', 'edit'];
const action = new Action(STATE_PATH);
const URL_DETAIL = '/api/bill/payBill/detail';
const URL_JION_LIST = '/api/bill/payBill/joinList';
const URL_JION = '/api/bill/payBill/joinDetail';
const URL_REMOVE = '/api/bill/payBill/removeDetail';
const URL_SAVE = '/api/bill/payBill/save';
const URL_SEND = '/api/bill/payBill/send';
const URL_CURRENCY = `/api/bill/receiveMake/currency`;
const URL_CONTACTS = `/api/bill/payBill/cunstomer_contacts`;
const URL_HEADER_INDO = `/api/bill/payBill/consignee_consignor`;


const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, PARENT_STATE_PATH);
  return parent[parent.activeKey];
};

const changeActionCreator = (KEY, keyName, keyValue) => async (dispatch, getState) =>  {
  let payload = {[keyName]: keyValue};
  if (keyValue && keyName === 'supplierHeaderInformation') {
    payload['customerAddress'] = keyValue.address;
  } else if (keyValue && keyName === 'customerContact') {
    payload['customerContactPhone'] = keyValue.contactMobile;
    payload['customerContactFax'] = keyValue.contactFax;
  }
  dispatch(action.assign(payload, 'value'));
};

const formSearchActionCreator = (KEY, key, filter, control) => async (dispatch, getState) => {
  const {controls, value} = getSelfState(getState());
  let result;
  if (control.searchType) {
    result = getJsonResult(await fuzzySearchEx(filter, control));
  } else {
    const supplierId = value['supplierId'].value;
    switch (key) {
      case 'currency': {
        result = getJsonResult(await fetchJson(URL_CURRENCY, postOption({currencyTypeCode: filter, maxNumber: 65536})));
        break;
      }
      case 'supplierContact': {
        result = getJsonResult(await fetchJson(URL_CONTACTS, postOption({supplierId})));
        break;
      }
      case 'supplierHeaderInformation': {
        result = getJsonResult(await fetchJson(URL_HEADER_INDO, postOption({supplierId, name: filter})));
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
    const incomeDetailIdList = resultItems.map(o => Number(o.id));
    const {returnCode, result, returnMsg} = await helper.fetchJson(`${URL_JION}/${id}`, postOption(incomeDetailIdList));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    const list = value[KEY] || [];
    const newItems = list.concat(resultItems);
    dispatch(action.assign({[KEY]: newItems}, 'value'));
  };
  await showJoinDialog(params, onOk);
};

const removeActionCreator = (KEY) => async (dispatch, getState) =>  {
  const {value, id} = getSelfState(getState());
  const checkList = value[KEY].filter(item => item.checked);
  if (checkList.length === 0) return showError('请勾选一条数据！');
  const costDetailIdList = checkList.map(o => Number(o.transportOrderCostId));
  const {returnCode, result, returnMsg} = await helper.fetchJson(`${URL_REMOVE}/${id}`, postOption(costDetailIdList));
  if (returnCode !== 0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  const notCheckList = value[KEY].filter(item => !item.checked);
  dispatch(action.assign({[KEY]: notCheckList}, 'value'));
};

const changeSortActionCreator  = (KEY) => async (dispatch, getState) => {
  const {value} = getSelfState(getState());
  const newItems = value[KEY].sort((a, b) => a.sequence - b.sequence);
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
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_SAVE, postOption({...convert(value)}));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    closeActionCreator()(dispatch, getState);
  });
};

const sendActionCreator = () => async (dispatch, getState) => {
  execWithLoading(async () => {
    const {value} = getSelfState(getState());
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_SEND, postOption({...convert(value)}));
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

const onAddActionCreator = (KEY) => async (dispatch, getState) => {
  execWithLoading(async () => {
    showAddCustomerFactoryDialog();
  });
};

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
  onAdd: onAddActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage));
export default Container;
