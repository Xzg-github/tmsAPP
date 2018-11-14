import { connect } from 'react-redux';
import EditDialog2 from '../../../components/EditDialog2';
import helper, {postOption, validValue, fetchJson, showError} from '../../../common/common';
import {toTableValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {filterEmpty} from './DistrictEditContainer';
import Fence from '../../../standard-business/showElectricFence';

const fence = new Fence('locationAddr');
const URL_CONTACT_SAVE = '/api/basic/area/contact';
const URL_CONTACT_CHARGE_ADDR = '/api/basic/area/place_drop_list';
const URL_CONTACT_BACK_ADDR = '/api/basic/area/location_drop_list';

const PARENT_STATE_PATH = ['basic', 'area', 'contact'];
const STATE_PATH = ['basic', 'area', 'contact', 'edit'];
const action = new Action(STATE_PATH);
const actionParent = new Action(PARENT_STATE_PATH);
const CLOSE_ACTION = action.assignParent({edit: undefined});

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildEditState = (config, data={}, isEdit=false, editIndex=-1) => {
  const {edit, add, ...otherConfig} = config;
  return {
    isEdit,
    editIndex,
    title: isEdit ? edit : add,
    ...otherConfig,
    value: isEdit ? data.baseInfo : data,
    tableItems: isEdit ? data.list : []
  };
};

const changeActionCreator = (key, value) => {
  if (key === 'locationAddr') {
    return action.assign(fence.getEmptyData(value), 'value');
  } else {
    return action.assign({[key]: value}, 'value');
  }
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
  const {controls, value} = getSelfState(getState());
  let data, options, body;
  if(key == 'billingLocation') {
    body ={
      maxNumber: 10,
      districtGuid: value.districtGuid.value,
      placeName: title
    };
    data = await fetchJson(URL_CONTACT_CHARGE_ADDR, postOption(body));
  }else if (key == 'parentLocationId') {
    body ={
      maxNumber: 10,
      locationName: title
    };
    data = await fetchJson(URL_CONTACT_BACK_ADDR, postOption(body));
  }
  if (data.returnCode != 0) {
    showError(data.returnMsg);
    return;
  };
  options = data.result;
  const index = controls.findIndex(item => item.key == key);
  dispatch(action.update({options}, 'controls', index));
};

const addRowAction = (dispatch) => {
  dispatch( action.add({}, 'tableItems') );
};

const delRowAction = (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const newItems = tableItems.filter(item => item.checked != true);
  dispatch(action.assign({tableItems: newItems}));
};

const buttonActions = {
  add: addRowAction,
  del: delRowAction
};

const clickActionCreator = (key) => {
  if (buttonActions.hasOwnProperty(key)) {
    return buttonActions[key];
  } else {
    showError(`unknown key:${key}`);
    return {type: 'unknown'};
  }
};

const contentChangeActionCreator = (rowIndex, keyName, value) => (dispatch) => {
  dispatch(action.update({[keyName]: value}, 'tableItems', rowIndex));
};

const okActionCreator = (props) => async (dispatch, getState) => {
  const {isEdit, editIndex, value, controls, tableItems} = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  let validItems = filterEmpty(tableItems);
  const body = {baseInfo:helper.convert(value), list:toTableValue(validItems)};
  const {returnCode, returnMsg, result} = await fetchJson(URL_CONTACT_SAVE, postOption(body, isEdit ? 'put': 'post'));
  if (returnCode !== 0) {
    showError(returnMsg);
    return;
  }
  isEdit ? dispatch(actionParent.update(result, 'tableItems', editIndex)) : dispatch(actionParent.add(result, 'tableItems', 0));
  props.onClose();
  dispatch(CLOSE_ACTION);
};

const cancelActionCreator = (props) => (dispatch) => {
  props.onClose();
  dispatch(CLOSE_ACTION);
};

const fenceActionCreator = () => async (dispatch, getState) => {
  const {value} = getSelfState(getState());
  if (!value.locationAddr) {
    showError('定义围栏前需要先输入地址');
  } else {
    const result = await fence.showEx(value);
    if (result) {
      dispatch(action.assign(result, 'value'));
    }
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onExitValid: exitValidActionCreator,
  onClick: clickActionCreator,
  onContentChange: contentChangeActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
  onFence: fenceActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EditDialog2);
export default Container;
export {buildEditState};
