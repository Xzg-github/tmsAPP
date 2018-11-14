import { connect } from 'react-redux';
import {fetchJson, showError, showSuccessMsg} from '../../../common/common';
import {hasSign} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import ContactEditContainer, {buildEditState} from './ContactEditContainer';
import TabPage from './TabPage';
import showPopup from '../../../standard-business/showPopup';

const URL_CONTACT_INFO = '/api/basic/area/contact_info';
const URL_CONTACT_DEL = '/api/basic/area/contact';
const URL_CONTACT_ACTIVE = '/api/basic/area/contact_active';

const PARENT_STATE_PATH = ['basic', 'area'];
const STATE_PATH = ['basic', 'area', 'contact'];
const action = new Action(STATE_PATH);

export const buildContactState = (config, editConfig, tableItems=[]) => {
  return {
    ...config,
    editConfig,
    tableItems
  };
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const getParentState = (rootState) => {
  return getPathValue(rootState, PARENT_STATE_PATH);
};

const checkedOne = (tableItems) => {
  const index = tableItems.reduce((result, item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return index.length !== 1 ? -1 : index[0];
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  const index = isAll ? -1 : rowIndex;
  return action.update({checked}, 'tableItems', index);
};

const addAction = (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const {select, tree} = getParentState(getState());
  const value = getPathValue(tree, [select, 'value', 'guid']);
  if(value === 'root') {
    showError('不允许在所有地址上新建，请先在树上选择要新建地址的节点');
    return;
  }
  const title = getPathValue(tree, [select, 'title']);
  const data = {districtGuid: {value, title}};
  const payload = buildEditState(editConfig, data, false);
  dispatch(action.assign(payload, 'edit'));
  showPopup(ContactEditContainer, {inset: false});
};

const editAction = async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index !== -1) {
    const data = await fetchJson(`${URL_CONTACT_INFO}/${tableItems[index].guid}`);
    if(data.returnCode !== 0) {
      showError(data.returnMsg);
      return;
    }
    const payload = buildEditState(editConfig, data.result, true, index);
    dispatch(action.assign(payload, 'edit'));
    showPopup(ContactEditContainer, {inset: false});
  }
};

const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
  if(!hasSign('area', 'platform_area_location_edit')) return;
  const {tableItems, editConfig} = getSelfState(getState());
  const data = await fetchJson(`${URL_CONTACT_INFO}/${tableItems[rowIndex].guid}`);
  if(data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  const payload = buildEditState(editConfig, data.result, true, rowIndex);
  dispatch(action.assign(payload, 'edit'));
  showPopup(ContactEditContainer, {inset: false});
};

const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index === -1) {
    showError('请勾选单条记录进行删除');
    return;
  }
  const item = tableItems[index];
  const {returnCode, returnMsg, result} = await fetchJson(`${URL_CONTACT_DEL}/${item.guid}`, 'delete');
  if (returnCode === 0) {
    if (result.active) {
      dispatch(action.update(result, 'tableItems', index));
    } else {
      dispatch(action.del('tableItems', index));
    }
    showSuccessMsg('删除成功');
  }else {
    showError(returnMsg);
  }
};

const activeAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index === -1) {
    showError('请勾选单条记录进行激活');
    return;
  }
  const item = tableItems[index];
  const {returnCode, returnMsg, result} = await fetchJson(`${URL_CONTACT_ACTIVE}/${item.guid}`, 'put');
  if (returnCode === 0) {
    dispatch(action.update(result, 'tableItems', index));
    showSuccessMsg('激活成功');
  }else {
    showError(returnMsg);
  }
};

const toolbarActions = {
  add: addAction,
  edit: editAction,
  del: delAction,
  active: activeAction
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

