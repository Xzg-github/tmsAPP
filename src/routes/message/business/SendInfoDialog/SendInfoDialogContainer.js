import { connect } from 'react-redux';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import SendInfoDialog from './SendInfoDialog';
import {showSelectDialog} from './SelectDialog';
import { fetchJson, showSuccessMsg, showError,postOption } from '../../../../common/common';
import {search,getUnreadData} from '../BusinessContainer';

const URL_send = '/api/message/business/msg_send';

const createContainer = (statePath, onCancel) => {
  const action = new Action(statePath);

  const getSelfState = (rootState) => {
    return getPathValue(rootState, statePath);
  };

  const getParentState = (rootState) => {
    const grantParent = getPathValue(rootState, ['message', 'businessMessage']);
    const grants = grantParent[grantParent.currentKey];
    const parent = grants[grants.activeKey];
    return parent;
  };

  const assignArray = (oldData,assignData) => {
    const repeatData = assignData.filter(o=>oldData.map(a=>a.id).includes(o.id));
    const noRepeatData = assignData.filter(o=>!(oldData.map(a=>a.id).includes(o.id)));
    let newData = oldData.concat(noRepeatData)
    newData.forEach(o=>{
      repeatData.map(a=>{
        if(o.id == a.id){
          o.sendType = Array.from(new Set(o.sendType.concat(a.sendType)));
        }
      });
    });
    return newData;
  };

  const fromMailBookActionCreator = async (dispatch,getState) => {
    const {fromMailBook,items} = getSelfState(getState());
    const onSelectDialogOk = async (data) => {
      const newItems = assignArray(items,data);
      dispatch(action.assign({items:newItems}));
    };
    showSelectDialog(fromMailBook,onSelectDialogOk,'fromMailBook', true);
  };

  const fromArchivesActionCreator = async (dispatch,getState) => {
    const {fromArchives,items} = getSelfState(getState());
    const onSelectDialogOk = async (data) => {
      const newItems = assignArray(items,data);
      dispatch(action.assign({items:newItems}));
    };
    showSelectDialog(fromArchives,onSelectDialogOk,'fromArchives', false);
  };

  const deleteActionCreator = async (dispatch,getState) => {
    const {items} = getSelfState(getState());
    const checkedList = items.filter(o=>o.checked);
    if(checkedList.length==0){
      return showError('未勾选数据！');
    }
    const newList = items.filter(o=>!o.checked);
    dispatch(action.assign({items: newList}));
  };

  const buttons = {
    fromMailBook: fromMailBookActionCreator,
    fromArchives: fromArchivesActionCreator,
    delete: deleteActionCreator
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

  const onOk = () => async (dispatch,getState) => {
    const {items,messageContent,CURRENT_KEY,activeKey} = getSelfState(getState());
    const options = {
      type: CURRENT_KEY,
      content: messageContent.val
    };
    if(CURRENT_KEY != 0){
      if(items.length==0){
        return showError('未勾选数据！');
      }
      if(items.some(o=>!o.mobile && o.sendType.includes('sms'))){
        return showError('存在不支持短信方式发送的数据！');
      }
      if(items.some(o=>!o.email && o.sendType.includes('email'))){
        return showError('存在不支持邮箱方式发送的数据！');
      }
      options.recipientInfo = items.map(item=>{
        // 这里跟sendInfoConfig里的平台方式是对应的，如果以后要更改，请一并更改
        const sendTypeInfo = [
          { type: 'web', key: 'username', value: item.contactName },
          { type: 'sms', key: 'userPhone', value: item.mobile },
          { type: 'email', key: 'userEmail', value: item.email }
        ];
        let sendInfo = {
          userId: item.id,
          sendMethod: item.sendType
        };
        item.sendType.map(o => {
          sendTypeInfo.map(k=>{
            if (o === k.type) {
              sendInfo[k.key] = k.value;
            }
          })
        });
        return sendInfo;
      });
    }else{
      options.sendMethod = ['web'];
    }
    if(messageContent.val==''){
      return showError('请填写消息内容！');
    }
    const {returnCode,returnMsg} = await fetchJson(URL_send, postOption(options));
    if(returnCode == 0){
      showSuccessMsg(returnMsg);
    }else {
      return showError(returnMsg);
    };
    onCancel()();
    await search(activeKey)(dispatch,getState);
    await getUnreadData(dispatch,getState);
  };

  const onChange = (key, val) => async (dispatch,getState) => {
    dispatch(action.assign({val}, [key]));
  };

  const onCheck = (isAll, checked, rowIndex) => async (dispatch,getState) => {
    isAll && (rowIndex = -1);
    dispatch(action.update({checked}, ['items'], rowIndex));
  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const actionCreators = {
    onCancel,
    onClick: clickActionCreator,
    onOk,
    onChange,
    onCheck
  };
  return connect(mapStateToProps, actionCreators)(SendInfoDialog);
};

export {createContainer};
