import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import ShortcutSet from './ShortcutSet';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import showAddDialog from "./AddDialog";
import helper from "../../../common/common";

const STATE_PATH = ['shortcutSet'];
const action = new Action(STATE_PATH);
const layoutAction = new Action(['layout']);

const initActionCreator = () => async (dispatch, getState) => {
  const tableCols = [
    {key: 'first', title: '一级菜单', filter: true},
    {key: 'second', title: '二级菜单', filter: true},
    {key: 'third', title: '三级菜单', filter: true},
  ];
  const buttons = [
    {key: 'add', title: '添加快捷菜单', bsStyle: 'primary'},
    {key: 'del', title: '删除', confirm: `确认删除勾选快捷菜单？`},
    {key: 'up', title: '上移'},
    {key: 'down', title: '下移'},
  ];
  const {tableColsSetting, pageTitles, privilege} = getState().layout;
  const {shortcut={}} = tableColsSetting;
  const tableItems = shortcut.shortcuts ? shortcut.shortcuts.filter(item => privilege[item.key] === true).map(item => {
    let {...newItem} = item;
    newItem.first = pageTitles[item.key][0];
    newItem.second = pageTitles[item.key][1];
    pageTitles[item.key].length > 2 && (newItem.third = pageTitles[item.key][2]);
    return newItem;
  }) : [];
  const payload = {
    tableCols,
    tableItems,
    buttons,
    filterInfo: {},
    status: 'page'
  };
  dispatch(action.create(payload));
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const updateSidebar = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const shortcut = tableItems.concat([{key: 'shortcut_set', title: '快捷设置', href: '/shortcut/shortcut_set'}]);
  dispatch(layoutAction.assign({shortcut}, ['sidebars']));
  const URL_SETTING = '/api/permission/table_cols_setting';
  await helper.fetchJson(URL_SETTING, helper.postOption({code:'shortcut', config: {shortcuts: tableItems}}));
};

const addActionCreator = async (dispatch, getState) => {
  const {pageTitles={}} = getState().layout;
  const {tableItems, tableCols} = getSelfState(getState());
  const arr = tableItems.map(item => item.key);
  const addItems = Object.keys(pageTitles).reduce((result, key) => {
    if (key === 'shortcut_set' || arr.includes(key)) {
      return result;
    }
    const first = pageTitles[key][0];
    const second = pageTitles[key][1];
    const third = pageTitles[key].length > 2 ? pageTitles[key][2] : '';
    const title = `${third || second}`;
    const href = `/shortcut/${key}`;
    result.push({key, title, first, second, third, href});
    return result;
  }, []);
  const result = await showAddDialog(addItems, tableCols);
  if (result) {
    const newItems = tableItems.concat(result);
    dispatch(action.assign({tableItems: newItems}));
    return updateSidebar(dispatch, getState);
  }
};

const delActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const newTableItems = tableItems.filter(item => item.checked !== true);
  if (newTableItems.length === tableItems.length) return helper.showError(`请先勾选记录`);
  dispatch(action.assign({tableItems: newTableItems}));
  return updateSidebar(dispatch, getState);
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
  return updateSidebar(dispatch, getState);
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
  return updateSidebar(dispatch, getState);
};

const buttons = {
  add: addActionCreator,
  del: delActionCreator,
  up: upActionCreator,
  down: downActionCreator,
};

const clickActionCreator = (key) => {
  if (buttons[key]) {
    return buttons[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const tableChangeActionCreator = (sortInfo, filterInfo) => {
  return action.assign({filterInfo});
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onClick: clickActionCreator,
  onCheck: checkActionCreator,
  onTableChange: tableChangeActionCreator
};

export default connect(mapStateToProps, actionCreators)(EnhanceLoading(ShortcutSet));

