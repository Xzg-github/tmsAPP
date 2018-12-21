import { connect } from 'react-redux';
import EditDialog2 from '../../../components/EditDialog2';
import {postOption, validValue, fetchJson, showError} from '../../../common/common';
import {toFormValue, toTableValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {updateTree} from './AreaContainer';

const URL_DISTRICT_SAVE = '/api/basic/area/district';
const URL_DISTRICT_DROP_LIST = `/api/basic/area/district_drop_list`;
const URL_DISTRICT_DROP_LIST_ALL = `/api/basic/area/district_drop_list_all`;
const URL_DISTRICT_INFO = '/api/basic/area/district_info';

const PARENT_STATE_PATH = ['basic', 'area', 'district'];
const STATE_PATH = ['basic', 'area', 'district', 'edit'];
const action = new Action(STATE_PATH);
const actionParent = new Action(PARENT_STATE_PATH);
const CLOSE_ACTION = action.assignParent({edit: undefined});

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildEditState = (config, data={}, isEdit=false, editIndex=-1) => {
  const {edit, add, controls, ...otherConfig} = config;
  return {
    isEdit,
    editIndex,
    title: isEdit ? edit : add,
    controls: isEdit && Number(data.baseInfo.districtType) === 1
      ? controls.map(item => item.key === 'parentDistrictGuid'
      ? {...item, type:'readonly', required: false} : item) : controls,
    ...otherConfig,
    value: isEdit ? data.baseInfo : data,
    tableItems: isEdit ? data.list : [],
    nodeGuid: isEdit && data.baseInfo.parentDistrictGuid ? data.baseInfo.parentDistrictGuid.value : ''
  };
};

const bindEmpty = (ignores = []) => {
  if (ignores.length === 0) {
    return obj => Object.keys(obj).every(key => !obj[key]);
  } else {
    const keys = obj => Object.keys(obj).filter(key => ignores.indexOf(key) === -1);
    return obj => keys(obj).every(key => !obj[key]);
  }
};

const isEmpty = bindEmpty(['checked', 'languageVersion']);
const filterEmpty = (items=[]) => {
  return items.filter(item => !isEmpty(item));
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const searchActionCreator = (key, title) => async (dispatch, getState) => {
  const {value, isEdit} = getSelfState(getState());
  if (key === 'parentDistrictGuid') {
    const body = isEdit ? {
      guid: value.guid,
      maxNumber: 20,
      districtName: title
    } : {
      districtName: title,
      maxNumber: 20,
    };
    const url = isEdit ? URL_DISTRICT_DROP_LIST : URL_DISTRICT_DROP_LIST_ALL;
    const {returnCode, returnMsg, result} = await fetchJson(url, postOption(body));
    if (returnCode !== 0) {
      showError(`${returnCode}${returnMsg}`);
      return;
    }
    dispatch(action.update({options: result}, 'controls', {key:'key', value: 'parentDistrictGuid'}));
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
  const newItems = tableItems.filter(item => item.checked !== true);
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
  const {isEdit, editIndex, value, controls, tableItems, nodeGuid} = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  //获取新记录级别信息
  let districtType = 1;
  if (value.parentDistrictGuid && value.parentDistrictGuid.value) {
    const data = await fetchJson(`${URL_DISTRICT_INFO}/${value.parentDistrictGuid.value}`);
    if(data.returnCode !== 0) {
      showError(data.returnMsg);
      return;
    }
    districtType = Number(data.result.districtType) + 1;
  }
  if (districtType > 6) {
    return showError(`上级不能为叶子节点，请重新填写`);
  }

  let validItems = filterEmpty(tableItems);
  const body = {baseInfo:{...toFormValue(value), districtType}, list:toTableValue(validItems)};
  const {returnCode, returnMsg, result} = await fetchJson(URL_DISTRICT_SAVE, postOption(body, isEdit ? 'put': 'post'));
  if (returnCode !== 0) {
    showError(returnMsg);
    return;
  }
  isEdit ? dispatch(actionParent.update(result, 'tableItems', editIndex)) : dispatch(actionParent.add(result, 'tableItems', 0));
  props.onClose();
  dispatch(CLOSE_ACTION);
  // if (!(!nodeGuid || (isEdit && nodeGuid === value.parentDistrictGuid.value))) {
    return updateTree(dispatch, getState);
  // }
};

const cancelActionCreator = (props) => (dispatch) => {
  props.onClose();
  dispatch(CLOSE_ACTION);
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onSearch: searchActionCreator,
  onExitValid: exitValidActionCreator,
  onClick: clickActionCreator,
  onContentChange: contentChangeActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EditDialog2);
export default Container;
export {buildEditState, filterEmpty};
