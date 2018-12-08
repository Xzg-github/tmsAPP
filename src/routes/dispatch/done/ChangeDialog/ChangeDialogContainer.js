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
  const {value} = getSelfState(getState());
  const ownerCarTag = Number(value.ownerCarTag);
  let data, url, body, options=[];
  switch (key) {
    case 'newCarInfoId': {
      url = '/api/dispatch/done/car_drop_list';
      body = ownerCarTag === 1 ?
        {maxNumber: 10, carNumber: filter, enabledType: 'enabled_type_enabled', isOwner: 1} :
        {maxNumber: 10, carNumber: filter, enabledType: 'enabled_type_enabled', supplierId: value.supplierId.value};
      data = await helper.fetchJson(url, helper.postOption(body));
      break;
    }
    case 'newDriverId': {
      url = '/api/dispatch/done/driver_drop_list';
      body = ownerCarTag === 1 ?
        {maxNumber: 10, diverName: filter, enabledType: 'enabled_type_enabled', isOwner: 1} :
        {maxNumber: 10, diverName: filter, enabledType: 'enabled_type_enabled', supplierId: value.supplierId.value};
      data = await helper.fetchJson(url, helper.postOption(body));
      break;
    }
    default:
      return;
  }
  if (data.returnCode === 0) {
    options = data.result;
  }
  dispatch(action.update({options}, 'controls', {key:'key', value: key}));
};

const changeActionCreator = (key, value) => async (dispatch, getState) => {
  const selfState = getSelfState(getState());
  const ownerCarTag = Number(selfState.value.ownerCarTag);
  let data, url, obj;
  obj = {[key]: value};
  switch (key) {
    case 'newCarInfoId': {
      obj.newDriverId = '';
      obj.newDriverMobilePhone = '';
      obj.newSupplierId = '';
      if (value) {
        url = `/api/dispatch/done/car_info/${value.value}`;
        data = await helper.fetchJson(url);
        if (data.returnCode === 0) {
          obj.newDriverId = data.result.driverId;
          if (ownerCarTag === 1) {
            obj.newSupplierId = data.result.supplierId;
          }else {
            obj.newSupplierId = selfState.value.supplierId;
          }
          url = `/api/dispatch/done/driver_info/${obj.newDriverId.value}`;
          data = await helper.fetchJson(url);
          if (data.returnCode === 0) {
            obj.newDriverMobilePhone = data.result.driverMobilePhone;
          }
        }
      }
      break;
    }
    case 'newDriverId': {
      obj.newDriverMobilePhone = '';
      if (value) {
        url = `/api/dispatch/done/driver_info/${value.value}`;
        data = await helper.fetchJson(url);
        if (data.returnCode === 0) {
          obj.newDriverMobilePhone = data.result.driverMobilePhone;
        }
      }
      break;
    }
  }
  dispatch(action.assign(obj, 'value'));
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
      {key: 'newSupplierId', title: '新供应商', type: 'readonly'},
      {key: 'ownerCarTag', title: '是否自有车', type: 'readonly', dictionary: 'zero_one_type'},
      {key: 'carNumber', title: '车牌号码', type: 'readonly'},
      {key: 'newCarInfoId', title: '新车牌', type: 'search', required: true},
      {key: 'driverName', title: '司机', type: 'readonly'},
      {key: 'newDriverId', title: '新司机', type: 'search', props:{searchWhenClick: true}, required: true},
      {key: 'driverMobilePhone', title: '司机电话', type: 'readonly'},
      {key: 'newDriverMobilePhone', title: '新司机电话', type: 'readonly'},
      {key: 'trackingInformation', title: '变更原因', type: 'textArea', span: 2},
    ],
    hideControls: Number(data.ownerCarTag) === 1 ? [] : ['newSupplierId']
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
* 功能：变更车辆和司机对话框
* 参数：data: 【必需】待变更的记录信息
* 返回值：成功返回true，取消或关闭时返回空
*/
export default async (data) => {
  await buildDialogState(data);
  const Container = connect(mapStateToProps, actionCreators)(ChangeDialog);
  return showPopup(Container, {}, true);
};
