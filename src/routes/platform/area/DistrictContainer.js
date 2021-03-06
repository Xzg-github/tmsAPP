import { connect } from 'react-redux';
import helper, {fetchJson, showError} from '../../../common/common';
import {hasSign} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import DistrictEditContainer, {buildEditState} from './DistrictEditContainer';
import TabPage from './TabPage';
import showPopup from '../../../standard-business/showPopup';

const URL_DISTRICT_INFO = '/api/basic/area/district_info';

const STATE_PATH = ['basic', 'area', 'district'];
const action = new Action(STATE_PATH);

export const buildDistrictState = (config, editConfig, tableItems=[]) => {
  return {
    ...config,
    editConfig,
    tableItems,
    checkedRows: []
  };
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const checkActionCreator = (checkedRows) => {
  return action.assign({checkedRows});
};

const addAction = (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const payload = buildEditState(editConfig, {}, false);
  dispatch(action.assign(payload, 'edit'));
  showPopup(DistrictEditContainer, {inset: false});
};

const editAction = async (dispatch, getState) => {
  const {tableItems, editConfig, checkedRows} = getSelfState(getState());
  if (checkedRows.length !== 1) return helper.showError('请勾选一条记录');
  const data = await fetchJson(`${URL_DISTRICT_INFO}/${tableItems[checkedRows[0]].guid}`);
  if(data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  const payload = buildEditState(editConfig, data.result, true, checkedRows[0]);
  dispatch(action.assign(payload, 'edit'));
  showPopup(DistrictEditContainer, {inset: false});
};

const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
  if(!hasSign('area', 'platform_area_district_edit')) return;
  const {tableItems, editConfig} = getSelfState(getState());
  const data = await fetchJson(`${URL_DISTRICT_INFO}/${tableItems[rowIndex].guid}`);
  if(data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  const payload = buildEditState(editConfig, data.result, true, rowIndex);
  dispatch(action.assign(payload, 'edit'));
  showPopup(DistrictEditContainer, {inset: false});
};

const toolbarActions = {
  add: addAction,
  edit: editAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onCheck: checkActionCreator,
  onClick: clickActionCreator,
  onDoubleClick: doubleClickActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(TabPage);

export default Container;

