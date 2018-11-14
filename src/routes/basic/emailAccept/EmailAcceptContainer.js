import { connect } from 'react-redux';
import EmailAccept from './EmailAccept';
import {EnhanceLoading} from '../../../components/Enhance';
import {buildOrderPageState} from '../../../common/orderAdapter';
import {postOption,fetchJson, showError} from '../../../common/common';
import {dealActions} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {fetchDictionary2, setDictionary} from '../../../common/dictionary';
import {search} from '../../../common/search';

const STATE_PATH = ['config', 'emailAccept'];
const action = new Action(STATE_PATH);

const URL_CONFIG = '/api/config/emailAccept/config';
const URL_EMAIL_LIST = '/api/config/emailAccept/email_list';
const URL_ACCEPT_LIST = '/api/config/emailAccept/accept_list';
const URL_LOG_LIST = '/api/config/emailAccept/log_list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildState = (config, data) => {
  const tabs = [
    {key: 'email', title: config.emailBtn, close: false},
    {key: 'accept', title: config.acceptBtn, close: false},
    {key: 'log', title: config.logBtn, close: false}
  ];
  return {
    tabs,
    ...config,
    activeKey: 'email',
    email: buildOrderPageState(data, config.EmailConfigurationConfig.index, {editConfig: config.EmailConfigurationConfig.edit}),
    accept: buildOrderPageState({}, config.EmailAcceptConfigurationConfig.index, {editConfig: config.EmailAcceptConfigurationConfig.edit}),
    log: buildOrderPageState({}, config.AcceptLogConfig.index, {})
  };
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  let res, data, config;
  config = await fetchJson(URL_CONFIG);

  config.EmailConfigurationConfig.index.buttons = dealActions(config.EmailConfigurationConfig.index.buttons, 'emailAccept');
  config.EmailAcceptConfigurationConfig.index.buttons = dealActions(config.EmailAcceptConfigurationConfig.index.buttons, 'emailAccept');
  config.AcceptLogConfig.index.buttons = dealActions(config.AcceptLogConfig.index.buttons, 'emailAccept');

  data = await fetchDictionary2(config.EmailConfigurationConfig.index.tableCols);
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }

  const dictionary = await fetchDictionary2(config.EmailAcceptConfigurationConfig.index.tableCols);
  if (dictionary.returnCode !== 0) {
    showError(dictionary.returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }

  setDictionary(config.EmailConfigurationConfig.index.tableCols, data.result);
  setDictionary(config.EmailConfigurationConfig.edit.controls, data.result);
  setDictionary(config.EmailConfigurationConfig.edit.editControls, data.result);
  setDictionary(config.EmailAcceptConfigurationConfig.index.tableCols, dictionary.result);
  setDictionary(config.EmailAcceptConfigurationConfig.edit.tableCols, dictionary.result);
  setDictionary(config.EmailAcceptConfigurationConfig.edit.editControls, dictionary.result);
  setDictionary(config.EmailAcceptConfigurationConfig.edit.editControls1, dictionary.result);

  res = await fetchJson(URL_EMAIL_LIST, postOption({itemFrom:0, itemTo:10}));
  if (res.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    return;
  }

  data = res.result;
  dispatch(action.create(Object.assign(buildState(config, data), {status: 'page'})));
};

const tabChangeActionCreator = (key) => async (dispatch,getState) =>  {
  let res, tableItems, maxRecords;
  if (key === 'email') {
    res = await search(URL_EMAIL_LIST, 0, 10, {});
    tableItems = res.result.data;
    maxRecords = res.result.returnTotalItem;
    dispatch(action.assign({tableItems, maxRecords}, 'email'));
  } else if (key === 'accept') {
    res = await search(URL_ACCEPT_LIST, 0, 10, {});
    tableItems = res.result.data;
    maxRecords = res.result.returnTotalItem;
    dispatch(action.assign({tableItems, maxRecords}, 'accept'));
  }else if (key === 'log') {
    res = await search(URL_LOG_LIST, 0, 10, {});
    tableItems = res.result.data;
    maxRecords = res.result.returnTotalItem;
    dispatch(action.assign({tableItems, maxRecords}, 'log'));
  }
  dispatch(action.assign({activeKey: key}));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator
};

const EmailAcceptContainer = connect(mapStateToProps, actionCreators)(EnhanceLoading(EmailAccept));

export default EmailAcceptContainer;





