import { connect } from 'react-redux';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';
import SetDialog from './SetDialog';
import showEditItemDialog from '../EditItemDialog/EditItemDialog';
import showPopup from "../../../../standard-business/showPopup";

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const buildSetDialogState = (item, config) => {
  const items = getPathValue(item, ['propertyConfig', 'controls']) || [];
  global.store.dispatch(action.create({
    ...config,
    item,
    tableItems: items.map(({...control}) => {
      control = {...control, ...control.props, itemKey: control.key};
      delete control.key;
      delete control.props;
      return control;
    }),
    visible: true
  }));
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, res: false}));
};

const okActionCreator = () => async (dispatch, getState) => {
  const {item, tableItems=[]} = getSelfState(getState());
  const propsKeys = ['showTime', 'real', 'precision', 'sign', 'zero', 'searchWhenClick', 'noSearchWhenTypo', 'mode', 'rule'];
  const body = {
    id: item.id,
    tablePropertyCode: item.tablePropertyCode,
    propertyConfig: {
      controls: tableItems.map(({...item}) => {
        item.key = item.itemKey;
        item.props = {};
        delete item.itemKey;
        delete item.checked;
        propsKeys.map(propsKey => {
          if (item[propsKey]) {
            item.props[propsKey] = item[propsKey];
          }
          delete item[propsKey];
        });
        return item;
      })
    }
  };
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/basic/formExpand`, helper.postOption(body, 'put'));
  if (returnCode !== 0) {
    helper.showError(returnMsg);
    return;
  }
  helper.showSuccessMsg('设置成功');
  dispatch(action.assign({visible: false, res: true}));
};

const addActionCreator = async (dispatch, getState) => {
  const {item, tableItems=[], editItemConfig} = getSelfState(getState());
  let {returnCode, result, returnMsg} = await helper.fetchJson(`/api/basic/formExpand/allProperties/${item.tablePropertyCode}`);
  if (returnCode !== 0) return helper.showError(returnMsg);
  result = result.map(item => ({key: item.propertyKey, title: item.propertyName, type: item.componentType}));
  const existKeys = tableItems.map(item => item.itemKey);
  const fileds = result.filter(item => !existKeys.includes(item.key));
  const res = await showEditItemDialog(editItemConfig, {}, fileds, false);
  if (res.isOk) {
    dispatch(action.assign({tableItems: tableItems.concat(res.items)}));
  }
};

const editActionCreator = async (dispatch, getState) => {
  const {tableItems=[], editItemConfig} = getSelfState(getState());
  let checkIndex;
  const checkedItems = tableItems.filter((item, index) => {
    if (item.checked === true) {
      checkIndex = index;
      return true;
    }
    return false;
  });
  if (checkedItems.length !== 1) return helper.showError('请勾选一条记录');
  const item = checkedItems.pop();
  const res = await showEditItemDialog(editItemConfig, item, [], true);
  if (res.isOk) {
    const [...items] = tableItems;
    items[checkIndex] = res.items.pop();
    dispatch(action.assign({tableItems: items}));
  }
};

const delActionCreator = (dispatch, getState) => {
  const {tableItems=[]} = getSelfState(getState());
  const newItems = tableItems.filter(item => item.checked !== true);
  dispatch(action.assign({tableItems: newItems}));
};

const upActionCreator = async (dispatch, getState) => {
  const {tableItems=[]} = getSelfState(getState());
  let checkIndex = -1;
  const checkItems = tableItems.filter((item, index) => {
    if (item.checked === true) {
      checkIndex = index;
      return true;
    }
    return false;
  });
  if (checkItems.length !== 1) {
    helper.showError('请勾选一条记录');
    return;
  }
  if (checkIndex === 0) return;
  const checkedItem = checkItems.pop();
  let items = [...tableItems];
  items[checkIndex] = items[checkIndex-1];
  items[checkIndex-1] = checkedItem;
  dispatch(action.assign({tableItems: items}));
};

const downActionCreator = async (dispatch, getState) => {
  const {tableItems=[]} = getSelfState(getState());
  let checkIndex = -1;
  const checkItems = tableItems.filter((item, index) => {
    if (item.checked === true) {
      checkIndex = index;
      return true;
    }
    return false;
  });
  if (checkItems.length !== 1) {
    helper.showError('请勾选一条记录');
    return;
  }
  if (checkIndex === tableItems.length-1) return;
  const checkedItem = checkItems.pop();
  let items = [...tableItems];
  items[checkIndex] = items[checkIndex+1];
  items[checkIndex+1] = checkedItem;
  dispatch(action.assign({tableItems: items}));
};

const buttons = {
  add: addActionCreator,
  edit: editActionCreator,
  del: delActionCreator,
  up: upActionCreator,
  down: downActionCreator
};

const clickActionCreator = (key) => {
  if (buttons[key]) {
    return buttons[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => (dispatch, getState) => {
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
  onClick: clickActionCreator,
  onCheck: checkActionCreator
};

/*
* 功能：设置表单字段对话框
* 参数：item: 记录信息
*       config: 界面配置
* 返回值：成功返回true，取消返回false
*/
export default (item, config) => {
  buildSetDialogState(item, config);
  const Container = connect(mapStateToProps, actionCreators)(SetDialog);
  return showPopup(Container, {}, true);
};
