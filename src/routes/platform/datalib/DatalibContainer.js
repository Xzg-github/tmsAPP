import { connect } from 'react-redux';
import Datalib from './Datalib';
import {EnhanceLoading} from '../../../components/Enhance';
import {buildOrderPageState} from '../../../common/orderAdapter';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search} from '../../../common/search';
import {fetchJson, getActions, postOption} from "../../../common/common";

const STATE_PATH = ['config', 'datalib'];
const action = new Action(STATE_PATH);

const URL_CONFIG = '/api/config/datalib/config';
const URL_TRANS_LIST = '/api/config/datalib/trans_list';
const URL_STAN_LIST = '/api/config/datalib/stan_list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildState = (config, data) => {
  const tabs = [
    {key: 'transform', title: config.transform, close: false},
    {key: 'standard', title: config.standard, close: false}
  ];
  return {
    tabs,
    ...config,
    activeKey: 'transform',
    transform: buildOrderPageState(data, config.transformConfig.index, {editConfig: config.transformConfig.edit}),
    standard: buildOrderPageState({}, config.standardConfig.index, {editConfig: config.standardConfig.edit})
  };
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  let res, data, config;
  res = await fetchJson(URL_CONFIG);
  if (!res) {
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  config = res;

  const buttons = config.transformConfig.index.buttons;
  const actions = getActions('datalib');
  config.transformConfig.index.buttons = buttons.filter(button => actions.findIndex(item => item === button.sign)!==-1);

  const buttons1 = config.standardConfig.index.buttons;
  const actions1 = getActions('datalib');
  config.standardConfig.index.buttons = buttons1.filter(button => actions1.findIndex(item => item === button.sign)!==-1);

  const postData = {itemFrom:0, itemTo:10};
  const json = await fetchJson(URL_TRANS_LIST, postOption(postData));
  if (json.returnCode) {
    dispatch(action.assign({status: 'retry'}));
    return;
  }

  const payload = Object.assign(buildState(config, json.result), {status: 'page'});
  dispatch(action.create(payload));
};

const tabChangeActionCreator = (key) => async (dispatch,getState) =>  {
  let res, tableItems, maxRecords;
  if (key === 'transform') {
    res = await search(URL_TRANS_LIST, 0, 10, {});
    tableItems = res.result.data;
    maxRecords = res.result.returnTotalItem;
    dispatch(action.assign({tableItems, maxRecords}, 'transform'));
  } else if (key === 'standard') {
    res = await search(URL_STAN_LIST, 0, 10, {});
    tableItems = res.result.data;
    maxRecords = res.result.returnTotalItem;
    dispatch(action.assign({tableItems, maxRecords}, 'standard'));
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

const DatalibContainer = connect(mapStateToProps, actionCreators)(EnhanceLoading(Datalib));

export default DatalibContainer;





