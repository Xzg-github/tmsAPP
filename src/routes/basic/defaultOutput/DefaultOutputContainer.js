import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EditPageContainer from './EditPageContainer';
import {EnhanceLoading, EnhanceDialogs} from '../../../components/Enhance';
import ConfirmDialogContainer from './ConfirmDialogContainer'
import helper,{getObject, fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search} from '../../../common/search';
import {buildOrderPageState} from '../../../common/state';
import {setDictionary,fetchDictionary} from '../../../common/dictionary';
import {dealActions} from '../../../common/check';

const STATE_PATH = ['basic', 'defaultOutput'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/basic/defaultOutput/config';
const URL_LIST = '/api/basic/defaultOutput/list';


const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};


const mosaic = (listItem) => {
  let emialModeArr  = [],smsModeArr  = [],iphoneArr  = [],emailArr  = [],arrMessage;

  const listSms = listItem.notify_type_sms;
  const listEmail = listItem.notify_type_email;

  if(listSms&&listSms.length>0){
    listSms.forEach (item => {

      smsModeArr.push(item.reportConfig ? item.reportConfig.title : '');
      item.recivers.forEach( reciver => {
        reciver.phoneNumber && iphoneArr.push(reciver.phoneNumber)
      })
    });
  }

  if(listEmail&&listEmail.length>0){
    listEmail.forEach (item => {

      emialModeArr.push(item.reportConfig ? item.reportConfig.title : '');
      item.recivers.forEach( reciver => {
        reciver.recipientMail && emailArr.push(reciver.recipientMail)
      })
    });

  }

  arrMessage = {
    emialMode : emialModeArr.join(','),
    smsMode : smsModeArr.join(','),
    iphone : iphoneArr.join(','),
    email : emailArr.join(',')
  };
  return arrMessage
};

//处理list
const processingData = (list) => {
  let emialMode,smsMode,iphone,email,listResult;

  listResult = [];

  list.result.data.forEach(item => {
    let arrMessage = mosaic(item.notifyInfoMap)
    item = {...item,...arrMessage}
    listResult.push(item)
  });
  return listResult
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const config = await fetchJson(URL_CONFIG);
  if (config.returnCode !== 0) {
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  const {index, edit} = config.result;
  const list = await search(URL_LIST, 0, index.pageSize, {});
  if (list.returnCode !== 0) {
    showError(list.returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  list.result.data = processingData(list);
  const {tableCols, filters} = config.result.index;
  const {controls} = config.result.edit;
  const tableCols2 = config.result.edit.tableCols;
  let data = await fetchDictionary(config.result.dicNames);
  if(data.returnCode !=0){
    showError(data.returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  setDictionary(tableCols, data.result);
  setDictionary(filters, data.result);
  setDictionary(controls, data.result);
  setDictionary(tableCols2, data.result);


  const payload = buildOrderPageState(list.result, index, {editConfig: edit});
  payload.buttons = dealActions(payload.buttons, 'defaultOutput');
  payload.status = 'page';
  dispatch(action.create(payload));

};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), ['status', 'edit','confirm']);
};

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(EnhanceDialogs(
  OrderPageContainer,
  ['edit', 'confirm'],
  [EditPageContainer, ConfirmDialogContainer]
));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
export {processingData}

