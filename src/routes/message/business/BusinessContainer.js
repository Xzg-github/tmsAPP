import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import helper, {fetchJson, getJsonResult,deepCopy,postOption} from '../../../common/common';
import {fetchDictionary, setDictionary} from '../../../common/dictionary';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import Business from './Business';
import showDialog from '../../../standard-business/showDialog';
import {createContainer} from './SendInfoDialog/SendInfoDialogContainer';
import {sendInfoConfig,MESSAGE_TYPES} from '../../../api/message/business/config';


const STATE_PATH = ['message', 'businessMessage'];
const action = new Action(STATE_PATH);

const URL_CONFIG = '/api/message/business/msg_config';
const URL_UNREAD = '/api/message/business/msg_unread';
const URL_LIST = '/api/message/business/msg_list';
const URL_setToRead = '/api/message/business/msg_setToRead';
const URL_delete = '/api/message/business/msg_delete';
const URL_send_list = '/api/message/business/msg_send_list';

let CURRENT_KEY;
// type: 0:系统消息，1:订单消息，2:派单消息，3:跟踪消息，4:异常消息
const TYPES = ['msg_system','msg_order','msg_dispatch','msg_track','msg_abnormal'];
const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, STATE_PATH);
  return parent[CURRENT_KEY];
};

const assignPrivilege = (payload) => {
  const actions = helper.getActions(CURRENT_KEY);
  if (actions.length > 0) {
    const keys = payload.tabs.map(o=>o.key);
    keys.map(o=>{
      const btns = [...payload[o].buttons];
      payload[o].buttons = btns.filter(({key}) => actions.includes(key));
    });
  }
};

const getUnreadData = async (dispatch, getState) => {
  const path = ['layout'];
  const action = new Action(path);
  const unreadList = getJsonResult(await fetchJson(URL_UNREAD));
  const unread = {};
  unreadList.map(o=>{unread[TYPES[o.type]] = o.unRead});
  const layout = deepCopy(getPathValue(getState(),path));
  layout.sidebars.message[0].children.forEach(o=>{
    o.unreadTotal = unread[o.key];
  });
  layout.messageCount = unreadList.reduce((count,item)=>(count += Number(item.unRead)),0);
  dispatch(action.assign(layout));
};

const search = (activeKey,currentPage=1,pageSize=10) => async (dispatch, getState) => {
  const {...state} = getSelfState(getState());
  const {searchData={}} = state[activeKey] ? state[activeKey] : state;
  let url, options= {
    type: TYPES.findIndex((val)=>val == CURRENT_KEY),
    insertTimeFrom: searchData.insertTimeFrom || '',
    insertTimeTo: searchData.insertTimeTo || '',
    content: searchData.content || '',
    pageDto: {
      pageNum: currentPage,
      pageSize
    }
  };
  if(activeKey == 'inBox'){
    url = URL_LIST;
    options.senderInfo = searchData.senderInfo || '';
  }else if(activeKey == 'outBox'){
    url = URL_send_list;
    options.recipientInfo = searchData.recipientInfo || '';
  };
  const {returnCode,result,returnMsg} = await fetchJson(url, postOption(options));
  if(returnCode == 0){
    dispatch(action.assign({tableItems: result.data, maxRecords: result.returnTotalItem,currentPage,pageSize},[CURRENT_KEY,activeKey]));
    return result;
  }else {
    dispatch(action.assign({tableItems: [], maxRecords: 0,currentPage,pageSize},[CURRENT_KEY,activeKey]));
    helper.showError(returnMsg);
    return {};
  }
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    dispatch(action.assign({status: 'loading'},CURRENT_KEY));
    const config = getJsonResult(await fetchJson(URL_CONFIG));
    const activeKey = config[CURRENT_KEY].activeKey;
    const dictionarys = getJsonResult(await fetchDictionary(config.names));
    dictionarys['MESSAGE_TYPES'] = MESSAGE_TYPES;
    config.KEYS.map(key=>{
      setDictionary(config[key][activeKey].tableCols, dictionarys);
      setDictionary(config[key][activeKey].filters, Object.assign({},dictionarys));
      assignPrivilege(config[key]);
    });
    getUnreadData(dispatch, getState);
    const list = await search(activeKey)(dispatch, getState);
    let newState = {...config[CURRENT_KEY]};
    newState[activeKey].tableItems = list.data;
    newState[activeKey].maxRecords = list.returnTotalItem;
    const payload = {
        status: 'page',
        sendInfoData: {...sendInfoConfig},
        ...newState
    };
    dispatch(action.assign(payload,CURRENT_KEY));
    dispatch(action.assign({currentKey: CURRENT_KEY}));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'},CURRENT_KEY));
  }
};

const tabChangeActionCreator = (key) => async (dispatch,getState) => {
  search(key)(dispatch,getState);
  dispatch(action.assign({activeKey: key},CURRENT_KEY));
};

const changeActionCreator = (key, value) => async (dispatch, getState) => {
  const {activeKey} = getSelfState(getState());
  dispatch(action.assign({[key]: value}, [CURRENT_KEY,activeKey,'searchData']));
};

const searchActionCreator = async (dispatch, getState) => {
  const {activeKey} = getSelfState(getState());
  search(activeKey)(dispatch, getState);
};

const resetActionCreator = async (dispatch,getState) => {
  const {activeKey} = getSelfState(getState());
  dispatch(action.assign({searchData: {}},[CURRENT_KEY,activeKey]));
};

const setToReadActionCreator = async (dispatch,getState) => {
  const state = getSelfState(getState());
  const {tableItems} = state[state.activeKey];
  const checkedList = tableItems.filter(o=>o.checked && o.state!=1);
  if(checkedList.length<1){
    return helper.showError('请勾选一条未读消息！');
  }
  const options = {
    type: TYPES.findIndex((val)=>val == CURRENT_KEY),
    idList: checkedList.map(o=>o.id)
  };
  const {returnCode,result,returnMsg} = await fetchJson(URL_setToRead, postOption(options,'put'));
  if(returnCode == 0){
    helper.showSuccessMsg(returnMsg);
    await getUnreadData(dispatch, getState);
    await searchActionCreator(dispatch, getState);
  }else{
    return helper.showError(returnMsg);
  }
};

const deleteActionCreator = async (dispatch,getState) => {
  const state = getSelfState(getState());
  const {tableItems} = state[state.activeKey];
  const checkedList = tableItems.filter(o=>o.checked);
  if(checkedList.length<1){
    return helper.showError('未勾选数据！');
  }
  const options = {
    type: TYPES.findIndex((val)=>val == CURRENT_KEY),
    idList: checkedList.map(o=>o.id)
  };
  const {returnCode,result,returnMsg} = await fetchJson(URL_delete, postOption(options,'delete'));
  if(returnCode == 0){
    helper.showSuccessMsg(returnMsg);
    await getUnreadData(dispatch, getState);
    await searchActionCreator(dispatch, getState);
  }else{
    helper.showError(returnMsg);
  }
};

const sendInfoActionCreator = async (dispatch, getState) => {
  const {sendInfoData,activeKey} = getSelfState(getState());
  sendInfoData.CURRENT_KEY = TYPES.findIndex((val)=>val == CURRENT_KEY);
  sendInfoData.activeKey = activeKey;
  showDialog(createContainer,{...sendInfoData});
};

const buttons = {
  search: searchActionCreator,
  reset: resetActionCreator,
  setToRead: setToReadActionCreator,
  delete: deleteActionCreator,
  sendInfo: sendInfoActionCreator
};
const clickActionCreator = (key) => {
  const trueKey = key.includes('_') ? key.split('_')[0] : key;
  if (buttons[trueKey]) {
    return buttons[trueKey];
  } else {
    console.log('unknown key:', trueKey);
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => async (dispatch, getState) =>  {
  isAll && (rowIndex = -1);
  const {activeKey} = getSelfState(getState());
  dispatch(action.update({checked}, [CURRENT_KEY,activeKey,'tableItems'], rowIndex));
};

const pageNumberActionCreator = (currentPage) => async (dispatch, getState) => {
  const {activeKey} = getSelfState(getState());
  search(activeKey,currentPage)(dispatch, getState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {activeKey} = getSelfState(getState());
  search(activeKey, currentPage,pageSize)(dispatch, getState);
};

const mapStateToProps = (state, { rootKey }) => {
  const parent = getPathValue(state, STATE_PATH);
  const selfState = {...parent[rootKey]};
  CURRENT_KEY = rootKey;
  return selfState;
};

const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator,
  onChange: changeActionCreator,
  onClick: clickActionCreator,
  onCheck: checkActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
};

const Component = EnhanceLoading(Business);
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
export {search,getUnreadData};
