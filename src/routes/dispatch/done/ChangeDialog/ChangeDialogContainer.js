import { connect } from 'react-redux';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';
import {fetchDictionary2, setDictionary2} from '../../../../common/dictionary';
import ChangeDialog from './ChangeDialog';
import showPopup from '../../../../standard-business/showPopup';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false}));
};

const okActionCreator = () => async (dispatch, getState) => {
  const {value, controls} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  dispatch(action.assign({confirmLoading: true}));
  const body = {
    ...helper.convert(value),
    newCarInfoName: value.newCarInfoId.title,
    newDriverName: value.newDriverId.title
  };
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/dispatch/done/change`, helper.postOption(body));
  if (returnCode !== 0) {
    dispatch(action.assign({confirmLoading: false}));
    helper.showError(returnMsg);
    return;
  }
  dispatch(action.assign({visible: false, res: true}));
};

const searchActionCreator = (key, filter) => async (dispatch, getState) => {
  switch (key) {
    case 'newCarInfoId': {
      break;
    }
    case 'newDriverId': {
      break;
    }
    default:
      return;
  }
};

const changeActionCreator = (key, value) => async (dispatch, getState) => {
  dispatch(action.assign({[key]: value}, 'value'));
};

const exitValidActionCreator = () => (dispatch) => {
  dispatch(action.assign({valid: false}));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
  onChange: changeActionCreator,
  onSearch: searchActionCreator,
  onExitValid : exitValidActionCreator,
};

const buildDialogState = async (data) => {
  const config = {
    title: '变更车辆及司机',
    ok: '确定',
    cancel: '取消',
    controls: [
      {key: 'supplierId', title: '供应商', type: 'readonly'},
      {key: 'ownerCarTag', title: '是否自有车', type: 'readonly', dictionary: 'zero_one_type'},
      {key: 'carNumber', title: '车牌号码', type: 'readonly'},
      {key: 'newCarInfoId', title: '新车牌', type: 'search', required: true},
      {key: 'driverName', title: '司机', type: 'readonly'},
      {key: 'newDriverId', title: '新司机', type: 'search', required: true},
      {key: 'driverMobilePhone', title: '司机电话', type: 'readonly'},
      {key: 'newDriverMobilePhone', title: '新司机电话', type: 'readonly'},
      {key: 'trackingInformation', title: '变更原因', type: 'textArea', span: 2},
    ]
  };
  const dic = await fetchDictionary2(config.controls);
  setDictionary2(dic.result, config.controls);
  global.store.dispatch(action.create({
    ...config,
    value: data,
    visible: true,
    confirmLoading: false,
  }));
};

/*
* 功能：选择商品对话框
* 参数：data: 【必需】当业务需求为不允许重复添加同一商品时，该参数为已存在的商品编码字符串数组，用于校验
* 返回值：成功返回true，取消或关闭时返回空
*/
export default async (data) => {
  await buildDialogState(data);
  const Container = connect(mapStateToProps, actionCreators)(ChangeDialog);
  return showPopup(Container, {}, true);
};
