import {connect} from 'react-redux';
import { Action } from '../../../action-reducer/action';
import { EnhanceLoading ,EnhanceDialogs } from '../../../components/Enhance';
import helper,{fetchJson} from '../../../common/common';
import {getPathValue} from '../../../action-reducer/helper';
import OrderPageContainer from './OrderPageContainer'
import EditDialogContainer from './EditDialogContainer'
import {dealActions} from '../../../common/check';
import {setDictionary2,fetchDictionary,getDictionaryNames} from '../../../common/dictionary';
import {search} from '../../../common/search';
import {toTableItems} from '../../../common/orderAdapter';


const STATE_PATH = ['basic','SMSmail'];
const action = new Action(STATE_PATH);
const URL_SMS_LIST = '/api/basic/SMSmail/smsList';
const URL_MAIL_LIST = '/api/basic/SMSmail/mailList';

const URL_CONFIG = '/api/basic/SMSmail/config';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildOrderPageState = (result,config,keys='SMS') => {
  const {filters,tableCols,controls} = config[keys];
  return {
    ...config,
    filters,
    tableCols,
    keys,
    maxRecords: result.returnTotalItem,
    currentPage: 1,
    tableItems: toTableItems(result),
    searchData: {}
  };
};

const initActionCreator = () => async(dispatch,getState) => {
  let SMSControls,SMSFilters,SMSTableCols,mailControls,mailFilters,mailTableCols,res,data;
  try{
    dispatch(action.assign({status: 'loading'}));
    //页面初始化数据
    const config = await fetchJson(URL_CONFIG);
    //权限
    config.result.buttons = dealActions(config.result.buttons, 'SMSmail');
    //字典
    SMSControls = config.result.SMS.controls;
    SMSFilters = config.result.SMS.filters;
    SMSTableCols = config.result.SMS.tableCols;

    mailControls = config.result.mail.controls;
    mailFilters = config.result.mail.filters;
    mailTableCols = config.result.mail.tableCols;
    const names = getDictionaryNames(SMSTableCols,SMSFilters);

    data = await fetchDictionary(names);

    setDictionary2(data.result,SMSFilters,SMSControls,SMSTableCols,mailFilters,mailControls,mailTableCols);


    //表数据
    res = await search(URL_SMS_LIST, 0, config.result.pageSize, {});
    if(res.returnCode !=0){
      helper.showError(res.returnMsg);
      return;
    }

    //配置表
    const payload =  buildOrderPageState(res.result, config.result);
    payload.tabs = [
      {
        key: 'SMS',
        title: '短信',
        close: false,
      },
      {
        key: 'mail',
        title: '邮箱',
        close: false,
      }
    ];
    payload.activeKey ='SMS';
    payload.status = 'page';
    dispatch(action.create(payload));
  }catch (e){
    helper.showError(e.message);
    dispatch(action.assign({status:'retry'}))

  }
};

const search2 = async (dispatch, action, url, currentPage, pageSize, filter, newState={},stateKey, path=undefined) => {
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;
  const {returnCode, returnMsg, result} = await search(url, from, to, filter);
  if (returnCode === 0) {
    const {filters,tableCols} = stateKey;

    const payload = {
      ...newState,
      filters,
      tableCols,
      tableItems: toTableItems(result),
      maxRecords: result.returnTotalItem
    };
    dispatch(action.assign(payload, path));
  } else {
    helper.showError(returnMsg);
  }
};

const tabChangeActionCreator = (key) => async (dispatch,getState) =>  {
  const state =  getSelfState(getState());
  const {pageSize, searchData} = getSelfState(getState());
  dispatch(action.assign({activeKey: key}));
  const newState = {searchDataBak: searchData, currentPage: 1};
  const url = key === 'SMS' ? URL_SMS_LIST : URL_MAIL_LIST;
  return search2(dispatch, action, url, 1, pageSize, searchData, newState,state[key]);

};


const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator
};


const Component = EnhanceLoading(EnhanceDialogs(
  OrderPageContainer,
  ['edit'],
  [EditDialogContainer]
));
const ContractContainer = connect(mapStateToProps, actionCreators)(Component);
export default ContractContainer;
export {search2}


