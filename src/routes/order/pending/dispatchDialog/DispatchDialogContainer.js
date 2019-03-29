import { connect } from 'react-redux';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';
import DispatchDialog from './DispatchDialog';
import showPopup from '../../../../standard-business/showPopup';
import {fetchAllDictionary, setDictionary2} from "../../../../common/dictionary";

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false}));
};

const okActionCreator = () => async (dispatch, getState) => {
  dispatch(action.assign({confirmLoading: true}));
  const {defaultSet, data, value} = getSelfState(getState());
  const taskList = defaultSet.taskList.map(item => {
    const subList = item.subList.map(item2 => {
      const isCheck = value.includes(item2.dictionaryCode) ? 1 : 0;
      return {...item2, isCheck};
    });
    return {...item, subList};
  });
  const body = {
    ...helper.convert(defaultSet),
    taskList,
    id: data.id
  };
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/order/pending/send`, helper.postOption(body));
  if (returnCode !== 0) {
    dispatch(action.assign({confirmLoading: false}));
    helper.showError(returnMsg);
    return;
  }
  helper.showSuccessMsg('任务派发成功');
  dispatch(action.assign({visible: false, res: true}));
};

const changeActionCreator = (arr = []) => {
  return action.assign({value: arr});
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
  onChange: changeActionCreator,
};

const buildDialogState = async (data) => {
  const config = {
    title: '任务制作',
    ok: '确定',
    cancel: '取消',
    controls: [
      {key: 'customerId', title: '客户', type: 'readonly'},
      {key: 'consignorId', title: '发货人', type: 'readonly'},
      {key: 'consigneeId', title: '收货人', type: 'readonly'},
      {key: 'businessType', title: '运输类型', type: 'readonly', dictionary: 'business_type'},
      {key: 'deptmentId', title: '部门', type: 'readonly'}
    ]
  };
  const dic = helper.getJsonResult(await fetchAllDictionary());
  setDictionary2(dic, config.controls);
  //获取默认设置
  const {returnCode, returnMsg, result:defaultSet} = await helper.fetchJson(`/api/order/pending/default_setting/${data.id}`);
  if (returnCode !== 0) {
    helper.showError(returnMsg);
    return false;
  }
  let value = [];
  const sections = defaultSet.taskList.map(item => {
    const options = item.subList.map(item2 => {
      const disabled = Number(item2.attributeNumber2 || 0) === 1;
      item2.isCheck === 1 && value.push(item2.dictionaryCode);
      return {label:item2.dictionaryName, value:item2.dictionaryCode, disabled};
    });
    return {title: item.dictionaryName, options};
  });
  global.store.dispatch(action.create({
    ...config,
    data,
    defaultSet,
    value,
    sections,
    visible: true,
    confirmLoading: false,
  }));
  return true;
};

/*
* 功能：任务派发对话框
* 参数：data: 【必需】待任务派发的记录信息
* 返回值：成功返回true，取消或关闭时返回空
*/
export default async (data) => {
  if (false === await buildDialogState(data)) return;
  const Container = connect(mapStateToProps, actionCreators)(DispatchDialog);
  return showPopup(Container, {}, true);
};
