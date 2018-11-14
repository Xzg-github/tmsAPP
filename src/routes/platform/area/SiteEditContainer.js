import { connect } from 'react-redux';
import EditDialog2 from '../../../components/EditDialog2';
import helper, {postOption, validValue, fetchJson, showError} from '../../../common/common';
import {toTableValue} from '../../../common/check';
import {fetchDictionary} from '../../../common/dictionary';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {filterEmpty} from './DistrictEditContainer';
import Fence from '../../../standard-business/showElectricFence';

const fence = new Fence('placeName');
const URL_SITE_SAVE = '/api/basic/area/site';
const PARENT_STATE_PATH = ['basic', 'area', 'site'];
const STATE_PATH = ['basic', 'area', 'site', 'edit'];
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
  if (key === 'placeName') {
    return action.assign(fence.getEmptyData(value), 'value');
  } else {
    return action.assign({[key]: value}, 'value');
  }
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
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

//处理地点类型字段，来自字典多选
const dealPlaceType = async ({baseInfo, placeType=[]}) => {
  const dic = await fetchDictionary(['place_type']);
  if (dic.returnCode !== 0) {
    return {...baseInfo, placeType: placeType.join(',')};
  }
  const newType = placeType.map(item => {
    const index = dic.result.place_type.findIndex(dicItem => dicItem.value === item);
    return index >= 0 ? dic.result.place_type[index].title : item;
  });
  return {...baseInfo, placeType: newType.join(',')};
};

const okActionCreator = (props) => async (dispatch, getState) => {
  const {isEdit, editIndex, value, controls, tableItems} = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  if (!value.placeType || value.placeType.length < 1) {  //地点类别必填
    dispatch(action.assign({placeType: ''}, value));
    dispatch(action.assign({valid: true}));
    return;
  }
  let validItems = filterEmpty(tableItems);
  const body = {baseInfo:helper.convert(value), list:toTableValue(validItems)};
  const {returnCode, returnMsg, result} = await fetchJson(URL_SITE_SAVE, postOption(body, isEdit ? 'put': 'post'));
  if (returnCode !== 0) {
    showError(returnMsg);
    return;
  }
  const newRecord = await dealPlaceType(result);
  isEdit ? dispatch(actionParent.update(newRecord, 'tableItems', editIndex)) : dispatch(actionParent.add(newRecord, 'tableItems', 0));
  props.onClose();
  dispatch(CLOSE_ACTION);
};

const cancelActionCreator = (props) => (dispatch) => {
  props.onClose();
  dispatch(CLOSE_ACTION);
};

const fenceActionCreator = () => async (dispatch, getState) => {
  const {value} = getSelfState(getState());
  if (!value.placeName) {
    showError('定义围栏前需要先输入运输地点名称');
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
