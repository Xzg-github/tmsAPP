import { connect } from 'react-redux';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';
import ConfirmSupplierDialog from './ConfirmSupplierDialog';
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
  const {value, controls, info} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  dispatch(action.assign({confirmLoading: true}));
  const body = {
    ...helper.convert(value),
    carNumber: value.carInfoId.title,
    driverName: value.driverId.title,
    transportOrderId: info.id
  };
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/dispatch/todo/confirm_supplier`, helper.postOption([body]));
  if (returnCode !== 0) {
    dispatch(action.assign({confirmLoading: false}));
    helper.showError(returnMsg);
    return;
  }
  dispatch(action.assign({visible: false, res: true}));
};

const searchActionCreator = (key, filter) => async (dispatch, getState) => {
  const {value, info} = getSelfState(getState());
  let data, url, body, options=[];
  switch (key) {
    case 'carInfoId': {
      url = '/api/dispatch/done/car_drop_list';
      body = {maxNumber: 10, carNumber: filter, enabledType: 'enabled_type_enabled', supplierId: info.supplierId.value};
      data = await helper.fetchJson(url, helper.postOption(body));
      break;
    }
    case 'driverId': {
      url = '/api/dispatch/done/driver_drop_list';
      body = {maxNumber: 10, diverName: filter, enabledType: 'enabled_type_enabled', supplierId: info.supplierId.value};
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
  let data, url, obj;
  obj = {[key]: value};
  switch (key) {
    case 'carInfoId': {
      obj.driverId = '';
      obj.driverMobilePhone = '';
      if (value) {
        url = `/api/dispatch/done/car_info/${value.value}`;
        data = await helper.fetchJson(url);
        if (data.returnCode === 0) {
          obj.driverId = data.result.driverId;
          url = `/api/dispatch/done/driver_info/${obj.driverId.value}`;
          data = await helper.fetchJson(url);
          if (data.returnCode === 0) {
            obj.driverMobilePhone = data.result.driverMobilePhone;
          }
          if (data.result.enabledType !== 'enabled_type_enabled') {
            obj.driverId = '';
            obj.driverMobilePhone = '';
          }
        }
      }
      break;
    }
    case 'driverId': {
      obj.driverMobilePhone = '';
      if (value) {
        url = `/api/dispatch/done/driver_info/${value.value}`;
        data = await helper.fetchJson(url);
        if (data.returnCode === 0) {
          obj.driverMobilePhone = data.result.driverMobilePhone;
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
    title: '供应商确认',
    ok: '确定',
    cancel: '取消',
    controls: [
      {key: 'carInfoId', title: '车牌号码', type: 'search', required: true},
      {key: 'driverId', title: '司机', type: 'search', props:{searchWhenClick: true}, required: true},
      {key: 'driverMobilePhone', title: '司机电话', type: 'text', required: true}
    ]
  };
  global.store.dispatch(action.create({
    ...config,
    info: data,
    value: {},
    visible: true,
    confirmLoading: false,
  }));
};

/*
* 功能：供应商确认对话框
* 参数：data: 【必需】待供应商确认的记录信息
* 返回值：成功返回true，取消或关闭时返回空
*/
export default async (data) => {
  await buildDialogState(data);
  const Container = connect(mapStateToProps, actionCreators)(ConfirmSupplierDialog);
  return showPopup(Container, {}, true);
};
