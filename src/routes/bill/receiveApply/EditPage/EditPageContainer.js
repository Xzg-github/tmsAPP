import { connect } from 'react-redux';
import EditPage from './EditPage';
import helper, {postOption, showError, fetchJson, getJsonResult, showSuccessMsg, fuzzySearchEx, convert} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {EnhanceLoading} from '../../../../components/Enhance';
import showJoinDialog from './JoinDialog/JoinDialogContainer';
import execWithLoading from '../../../../standard-business/execWithLoading';
import {updateOne} from '../../../../action-reducer/array';
import showAddInvoiceDialog from '../../../config/customerInvoice/EditDialogContainer';
import showChangeRateDialog from './ChangeRateDialog/ChangeRateDialog';

const PARENT_STATE_PATH = ['receiveApply'];
const STATE_PATH = ['receiveApply', 'edit'];
const action = new Action(STATE_PATH);
const URL_DETAIL = '/api/bill/receiveApply/detail';
const URL_JION = '/api/bill/receiveApply/joinDetail';
const URL_REMOVE = '/api/bill/receiveApply/removeDetail';
const URL_SAVE = '/api/bill/receiveApply/save';
const URL_SUBMIT = '/api/bill/receiveApply/submit';
const URL_RECEIVABLE_OPENINGBANK = `/api/bill/receiveApply/receivable_openingBank`;
const URL_HEADER_INDO = `/api/bill/receiveApply/invoiceHeaderInfo`;
const URL_CHANGE_RATE = `/api/bill/receiveApply/changeRate`;
const URL_CURRENCY_RATE = `/api/bill/receiveApply/currencyRate`;


const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, PARENT_STATE_PATH);
  return parent[parent.activeKey];
};

const changeActionCreator = (KEY, key, value) => async (dispatch, getState) =>  {
  let payload = {[key]: value};
  switch (key) {
    case 'invoiceHeaderInformation': {
      payload['taxpayerIdentificationNumber'] = value['taxpayerIdentificationNumber'];
      payload['addressPhone'] = value['addressPhone'];
      payload['openingBank'] = value['openingBank'];
      payload['accountNumber'] = value['accountNumber'];
      payload['postAddress'] = value['postAddress'];
    }
  }
  dispatch(action.assign(payload, 'value'));
};

const formSearchActionCreator = (KEY, key, filter, control) => async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  let result = [];
  if (control.searchType) {
    result = getJsonResult(await fuzzySearchEx(filter, control));
  } else {
    switch (key) {
      case 'receivableOpeningBank': {
        result = getJsonResult(await fetchJson(URL_RECEIVABLE_OPENINGBANK, postOption({filter, maxNumber: 65536})));
        break;
      }
      case 'invoiceHeaderInformation': {
        result = getJsonResult(await fetchJson(URL_HEADER_INDO, postOption({filter, maxNumber: 65536})));
        break;
      }
    }
  }
  const options = result.data ? result.data : result ? result : [];
  const controlsIndex = controls.findIndex(o => o.key === KEY);
  const index = controls[controlsIndex].cols.findIndex(item => item.key === key);
  const cols = updateOne(controls[controlsIndex].cols, index, {options});
  dispatch(action.update({cols}, ['controls'], controlsIndex));
};

const checkActionCreator = (KEY, isAll, checked, rowIndex) => action.update({checked}, ['value', KEY], rowIndex);

const joinActionCreator = (KEY) => async (dispatch, getState) => {
  const {costInfoConfig, id} = getSelfState(getState());
  const okResult = await showJoinDialog({...costInfoConfig.joinDialogConfig, id});
  if (okResult) {
    const params = {chargeList: okResult, id};
    const {returnCode, result=[], returnMsg} = await helper.fetchJson(URL_JION, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    dispatch(action.assign({[KEY]: result}, 'value'));
  }
};

const removeActionCreator = (KEY) => async (dispatch, getState) =>  {
  const {value} = getSelfState(getState());
  const checkList = value[KEY].filter(item => item.checked);
  if (checkList.length === 0) return showError('请勾选一条数据！');
  const {returnCode, result, returnMsg} = await helper.fetchJson(URL_REMOVE, postOption(checkList.map(o => o.id)));
  if (returnCode !== 0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  const notCheckList = value[KEY].filter(item => !item.checked);
  dispatch(action.assign({[KEY]: notCheckList}, 'value'));
};

const changeExchangeRateActionCreator  = (KEY) => async (dispatch, getState) => {
  const {value, costInfoConfig} = getSelfState(getState());
  const tableItems = value[KEY] || [];
  const checkList = tableItems.filter(item => item.checked);
  if (checkList.length === 0) return showError('请勾选一条数据！');
  const items = checkList.reduce((res, o) => {
    if (!res.find(it => it.currencyTypeCode === o.currencyTypeCode)) {
      res.push({...o});
    }
    return res;
  }, []);
  const onOk = async (data=[]) => {
    const params = {ids: checkList.map(o => o.id), currencyList: data};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_CHANGE_RATE, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    const newTableItems = tableItems.map(o => {
      const item = data.find(it => it.currencyTypeCode === o.currencyTypeCode);
      item && (o.invoiceExchangeRate = item.invoiceExchangeRate);
      return o;
    });
    dispatch(action.assign({[KEY]: newTableItems}, 'value'));
  };
  await showChangeRateDialog({
    ...costInfoConfig.changeRateDialogConfig,
    items,
    onOk
  });
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
    const params = {...convert(value)};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_SAVE, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    closeActionCreator()(dispatch, getState);
  });
};

const commitActionCreator = () => async (dispatch, getState) => {
  execWithLoading(async () => {
    const {value} = getSelfState(getState());
    const params = {...convert(value)};
    const {returnCode, result, returnMsg} = await helper.fetchJson(URL_SUBMIT, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    closeActionCreator()(dispatch, getState);
  });
};

const buttons = {
  join: joinActionCreator,
  remove: removeActionCreator,
  changeExchangeRate: changeExchangeRateActionCreator,
  close: closeActionCreator,
  save: saveActionCreator,
  commit: commitActionCreator
};

const clickActionCreator = (KEY, key) => {
  if (buttons.hasOwnProperty(key)) {
    return buttons[key](KEY);
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

// 发票抬头的新增
const onAddActionCreator = () => async (dispatch, getState) => {
  const {addInvoiceConfig, controls} = getSelfState(getState());
  const flag = await showAddInvoiceDialog({}, addInvoiceConfig);
  if (flag) {
    const result = getJsonResult(await fetchJson(URL_HEADER_INDO, postOption({filter: '', maxNumber: 65536})));
    const options = result.data ? result.data : result ? result : [];
    const cols = updateOne(controls[1].cols, 1, {options});
    dispatch(action.update({cols}, ['controls'], 1));
  }
}

// 发票表格值变化
const onInvoiceChange = (KEY, keyName, keyValue, index) => action.update({[keyName]: keyValue}, ['value', KEY], index);

// 发票表格币种下拉值变化
const onInvoiceSelect = (KEY, keyName, keyValue, index) => async (dispatch, getState) => {
  dispatch(action.update({[keyName]: keyValue}, ['value', KEY], index));
  const {value, currencyList} = getSelfState(getState());
  const {price=0, itemCount=0} = value[KEY][0];
  const currencyItem = currencyList.find(o => o.value = keyValue);
  const amount = price * itemCount * currencyItem.exchangeRate;
  dispatch(action.update({
    currency: keyValue,
    exchangeAmount: amount
  }, ['value', KEY], 0));
};

const onTabChangeActionCreator = (activeKey) => action.assign({activeKey});

const exitValidActionCreator = (KEY) => action.assign({valid: KEY});

const buildEditPageState = async (config, itemData) => {
  const detailData = getJsonResult(await fetchJson(`${URL_DETAIL}/${itemData.id}`));
  const {chargeList, invoice={}} = detailData;
  const invoiceInfo = helper.getObject(invoice, config.invoiceInfoConfig.cols.map(o => o.key));
  const rateList = getJsonResult(await fetchJson(`${URL_CURRENCY_RATE}/${invoiceInfo['currency']}`));
  return {
    ...config,
    ...itemData,
    currencyList: rateList.map(o => ({value: o.currencyTypeCode, title: o.currencyTypeCode, exchangeRate: o.exchangeRate})),
    value: {
      ...invoice,
      costInfo: chargeList,
      invoiceInfo: [invoiceInfo]
    },
    status: 'page'
  };
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    const {config, itemData} = getSelfState(getState());
    dispatch(action.assign({status: 'loading'}));
    const payload = await buildEditPageState(config, itemData);
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
  onAdd: onAddActionCreator,
  onTabChange: onTabChangeActionCreator,
  onExitValid: exitValidActionCreator,
  onInvoiceChange,
  onInvoiceSelect
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage));
export default Container;
