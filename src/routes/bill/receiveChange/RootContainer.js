import {connect} from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import helper, {fetchJson, getJsonResult, initTableCols, postOption, showError} from "../../../common/common";
import {Action} from "../../../action-reducer/action";
import {search} from "../../../common/search";
import {fetchDictionary, setDictionary} from "../../../common/dictionary";
import {getStatus} from "../../../common/commonGetStatus";
import {buildOrderPageState} from "../../../common/state";
import {getPathValue} from "../../../action-reducer/helper";
import {createCommonTabPage} from "../../../standard-business/createTabPage";

const STATE_PATH = ['receiveChange'];
const action = new Action(STATE_PATH);

const URL_CONFIG = '/api/bill/change_receive/config';
const URL_LIST = '/api/bill/change_receive/list';
const URL_CURRENCY = '/api/bill/change_receive/currency';

/**
 * @description 获取改单原因, 来自于系统字典responsible_party下级
 * @param {Array} partyOptions 字典责任方第一级
 * @return {Array}
 */
const getRenewalReson = async (partyOptions) => {
  const names = partyOptions.map(option => option.value);
  const dictionaryValue = getJsonResult(await fetchDictionary(names));
  return names.reduce((result, name) => result.concat(dictionaryValue[name]), []);
};

/**
 * @description 控制权限
 * @param payload
 */
const assignPrivilege = (payload) => {
  const actions = helper.getActions('change_receive', true);
  if (actions.length > 0) {
    payload.buttons = payload.buttons.filter(({key}) => actions.includes(key));
    payload.pageReadonly = !actions.includes('edit');
    if (!actions.includes('commit')){
      delete payload.editConfig.footerButtons[2];
    }
  }
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch) => {
  try{
    dispatch(action.assign({status: 'loading'}));
    const {index, editConfig, dicNames, tabs, activeKey} = getJsonResult(await fetchJson(URL_CONFIG));
    const list = getJsonResult(await search(URL_LIST, 0, index.pageSize, {}));
    const dictionary = getJsonResult(await fetchDictionary(dicNames));
    dictionary['statusType'] = getJsonResult(await getStatus('renewal'));
    const currency = getJsonResult(await fetchJson(URL_CURRENCY, postOption({currencyTypeCode: '', maxNumber: 65536})));
    const renewalReasonOptions = await getRenewalReson(dictionary['responsible_party']);
    const newState = {tabs, activeKey, editConfig, status: 'page'};
    const payload = buildOrderPageState(list, index, newState);

    setDictionary(payload.filter, dictionary);
    setDictionary(payload.tableCols, dictionary);
    setDictionary(payload.editConfig.controls[0].data, dictionary);
    setDictionary(payload.editConfig.tables[0].cols, dictionary);
    helper.setOptions('currency', payload.editConfig.tables[0].cols, currency);
    helper.setOptions('renewalReason', payload.tableCols, renewalReasonOptions);
    helper.setOptions('renewalReason', payload.editConfig.controls[0].data, renewalReasonOptions);

    payload.tableCols = initTableCols('receiveChange', payload.tableCols);
    assignPrivilege(payload);

    dispatch(action.create(payload));
  } catch (e) {
    showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const tabChangeActionCreator = (key) => {
  return action.assign({activeKey: key});
};

const tabCloseActionCreator = (key) => (dispatch, getState) => {
  const { tabs, activeKey } = getSelfState(getState());
  const newTabs = tabs.filter(tab => tab.key !== key);
  if (activeKey === key) {
    let index = tabs.findIndex(tab => tab.key === key);
    (newTabs.length === index) && (index--);
    dispatch(action.assign({tabs: newTabs, [activeKey]: undefined, activeKey: newTabs[index].key}));
  } else{
    dispatch(action.assign({tabs: newTabs, [key]: undefined}));
  }
};

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator,
  onTabClose: tabCloseActionCreator
};

const UIComponent = EnhanceLoading(createCommonTabPage(OrderPageContainer, EditPageContainer));
const Container = connect(mapStateToProps, actionCreators)(UIComponent);
export default Container;