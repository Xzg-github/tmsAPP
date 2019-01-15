import { connect } from 'react-redux';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';
import {fetchDictionary2, setDictionary2} from '../../../../common/dictionary';
import DriverDialog from './DriverDialog';
import showPopup from '../../../../standard-business/showPopup';
import execWithLoading from '../../../../standard-business/execWithLoading';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false}));
};

const okActionCreator = () => async (dispatch, getState) => {
  const {data, items, checkedRows} = getSelfState(getState());
  if (items.length < 1) {
    helper.showError(`请先选择车辆记录`);
    return;
  }
  dispatch(action.assign({confirmLoading: true}));
  const body = helper.convert({...items[checkedRows.pop()], transportOrderId: data.id});
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/dispatch/todo/dispatch_driver`, helper.postOption(body));
  if (returnCode !== 0) {
    dispatch(action.assign({confirmLoading: false}));
    helper.showError(returnMsg);
    return;
  }
  dispatch(action.assign({visible: false, res: true}));
};

const radioActionCreator = (checkedRows) => {
  return action.assign({checkedRows});
};

const searchActionCreator = (key, value) => async (dispatch, getState) => {
  dispatch(action.assign({[key]: value}, 'searchData'));
  const {searchData} = getSelfState(getState());
  execWithLoading(async () => {
    const { returnCode, result, returnMsg } = await helper.fetchJson('/api/dispatch/todo/driver_list', helper.postOption(searchData));
    if (returnCode === 0) {
      dispatch(action.assign({ items: result.data || [] }));
    } else {
      helper.showError(returnMsg);
    }
  });
};

const mapStateToProps = (state) => {
  console.log(getSelfState(state))
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
  onRadio: radioActionCreator,
  onSearch: searchActionCreator,
};

const buildDialogState = async (data) => {
  const config = {
    title: '派自有车',
    ok: '确定',
    cancel: '取消',
    cols: [
      {key: 'carNumber', title: '车牌号码'},
      {key: 'carModeId', title: '车型'},
      {key: 'driverName', title: '司机'},
      {key: 'driverMobilePhone', title: '司机号码'},
      {key: 'supplierId', title: '车主'},
      {key: 'carState', title: '车辆状态', dictionary: 'car_state'},
      {key: 'firstTransportOrderId', title: '待执行运单'},
      {key: 'transportOrderId', title: '操作中运单'},
      {key: 'operationPlanDeliveryTime', title: '操作中运单预计完成时间'},
      {key: 'planPickupTime', title: '本单计划装货时间'},
      {key: 'consigneeConsignorAddress', title: '本单提货地址'},
      {key: 'operationConsigneeConsignorAddress', title: '操作中目的地址'},
      {key: 'position', title: '车辆最新位置'},
      {key: 'longitude', title: '经度'},
      {key: 'latitude', title: '纬度'},
      {key: 'positionTime', title: '位置更新时间'},
      {key: 'totalOutputValue', title: '总产值'},
      {key: 'updateTime', title: '更新时间'},
      {key: 'updateUser', title: '更新用户'},
    ],
  };
  const dic = await fetchDictionary2(config.cols);
  setDictionary2(dic.result, config.cols);
  const searchData = {
    carModeId: data.carModeId,
    carState: 'car_state_unuser',
    transportOrderId: data.id,
    carNumber: ''
  };
  let items = [];
  const {returnCode, result} = await helper.fetchJson('/api/dispatch/todo/driver_list', helper.postOption(searchData));
  if (returnCode === 0) {
    items = result.data || [];
  }
  global.store.dispatch(action.create({
    ...config,
    data,
    searchData,
    items,
    checkedRows: [0],
    visible: true,
    confirmLoading: false,
  }));
};

/*
* 功能：派车对话框
* 参数：data: 【必需】待派车的记录信息
* 返回值：成功返回true，取消或关闭时返回空
*/
export default async (data) => {
  await buildDialogState(data);
  const Container = connect(mapStateToProps, actionCreators)(DriverDialog);
  return showPopup(Container, {}, true);
};
