import { connect } from 'react-redux';
import TreePage from '../../../components/TreePage';
import EditDialogContainer from './EditDialogContainer';
import ConfirmDialogContainer from './ConfirmDialogContainer';
import {EnhanceLoading, EnhanceDialogs} from '../../../components/Enhance';
import helper,{getActions, fetchJson, postOption} from '../../../common/common';
import Tree from '../../../common/tree';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {fetchDictionary, setDictionary} from '../../../common/dictionary';
import {buildEditPageState, buildDeleteState} from './state';

const STATE_PATH = ['basic', 'sysDictionary'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/basic/sysDictionary/config';
const URL_TREE_LIST = '/api/basic/sysDictionary/tree_list';
const URL_LIST = '/api/basic/sysDictionary/list';
const URL_ACTIVE = '/api/basic/sysDictionary/active';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildState = (config, treeData=[], tableItems=[]) => {
  const tree = Tree.createWithInsertRoot(treeData, config.root, {guid: 'root', districtType:0});
  const key = Tree.getRootKey(tree);
  return {
    ...config.index,
    tree,
    select: key,
    expand: {[key]: true},
    tableItems,
    editConfig: config.edit,
    root: config.root,
    newObj: {
      title: config.root,
      value: null
    }
  };
};

const convertToTree = (data, pid) => {
  let result = [], temp;
  for (let i = 0; i < data.length; i++) {
    if ((!pid && !data[i].pid) || (data[i].pid && data[i].pid.value === pid)) {
      let obj = {title: data[i].id.title, value: data[i].id.value};
      temp = convertToTree(data, data[i].id.value);
      if (temp.length > 0) {
        obj.children = temp;
      }
      result.push(obj);
    }
  }
  return result;
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const config = helper.getJsonResult(await fetchJson(URL_CONFIG));
    const {index, names} = config;
    const newAction = getActions('sysDictionary', true);
    index.buttons = index.buttons.filter(items => newAction.indexOf(items.key) !== -1);

    const items = helper.getJsonResult(await fetchJson(URL_TREE_LIST));
    const tree = convertToTree(items);
    const dictionary = helper.getJsonResult(await fetchDictionary(names));
    const list = helper.getJsonResult(await fetchJson(URL_LIST, postOption({})));
    const payload = buildState(config, tree, list.data);
    setDictionary(config.index.tableCols, dictionary);
    setDictionary(config.edit.tableCols, dictionary);
    payload.status = 'page';
    payload.allItems = items;
    payload.indexTableItems = items;
    dispatch(action.create(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const inputChangeActionCreator = (value) => {
  return action.assign({inputValue: value});
};

// 在树中搜索字典名称(模糊搜索)
const searchAction = (dispatch, getState) => {
  const {allItems, tree, inputValue} = getSelfState(getState());
  if (inputValue) {
    const indexTableItems = allItems.filter(item => item.id.title.includes(inputValue));
    dispatch(action.assign({searchValue: inputValue, expand: Tree.search(tree, inputValue), indexTableItems}));
  } else {
    dispatch(action.assign({searchValue: inputValue, indexTableItems: allItems}));
  }
};

const addAction = (dispatch, getState) => {
  const {editConfig, dictionaryCode, newObj} = getSelfState(getState());
  const needState = {
    parentDictionaryCode: newObj,
  };
  editConfig.id = dictionaryCode;
  const payload = buildEditPageState(editConfig, [], needState, false);
  dispatch(action.assign(payload, 'edit'));
};

// 深拷贝
const deepCopy = (obj) => {
  let str, newObj = obj.constructor === Array ? [] : {};
  if (typeof obj !== 'object') {
    return;
  } else if (window.JSON) {
    str = JSON.stringify(obj),
      newObj = JSON.parse(str);
  } else {
    for (let i in obj) {
      newObj[i] = typeof obj[i] === 'object' ?
        deepCopy(obj[i]) : obj[i];
    }
  }
  return newObj;
};


const editAction = (dispatch, getState) => {
  const {editConfig, tableItems, newObj} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if(index !== -1) {
    const {dictionaryLanguage} = tableItems[index];
    const newEditConfig = deepCopy(editConfig);
    const {controls} = newEditConfig;
    controls[0].type = 'readonly';
    const data = helper.getObjectExclude(tableItems[index], ['checked']);
    data.parentDictionaryCode = newObj;
    const payload = buildEditPageState(newEditConfig, dictionaryLanguage, data, true, index);
    dispatch(action.assign(payload, 'edit'));
  }else {
    const msg = '请勾选一个';
    helper.showError(msg)
  }
};

const checkedId = (tableItems) => {
  const arrId = tableItems.reduce((result, items) => {
    items.checked && result.push(items.dictionaryCode);
    return result;
  }, []);
  return arrId;
};


// 批量
const batchHandle = (tableItems, dispatch, func) => {
  let listCode = [];
  tableItems.map((item)=> {if (item.checked === true) {listCode.push(item.dictionaryCode)}});
  func(listCode, dispatch);
};


const activeAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const ajax = async (listCode, dispatch) => {
    const {returnCode, result, returnMsg} = await fetchJson(URL_ACTIVE, postOption(listCode, 'put'));
    if (returnCode !== 0 ) {
      helper.showError(returnMsg);
      return;
    }
    for (let i = 0; i < listCode.length; i++) {
      for (let j = 0; j < result.data.length; j++) {
        dispatch(action.update(result.data[j],'tableItems', {key: "dictionaryCode", value: listCode[i]}));
      }
    }
  };
  batchHandle(tableItems, dispatch, ajax);
};


const delAction = (dispatch, getState) => {
  const {tableItems, expand, root, dictionaryCode} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if(index !== -1) {
    const codeItems = checkedId(tableItems);
    const confirm = buildDeleteState();
    dispatch(action.assign({codeItems, dictionaryCode, expand, root, ...confirm}, 'confirm'));
  }else {
    const msg = '请勾选一个';
    helper.showError(msg)
  }
};


const toolbarActions = {
  search: searchAction,
  add: addAction,
  edit: editAction,
  active: activeAction,
  del: delAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
  const {editConfig, tableItems, newObj} = getSelfState(getState());
  const {dictionaryLanguage} = tableItems[rowIndex];
  const newEditConfig = deepCopy(editConfig);
  const {controls} = newEditConfig;
  controls[0].type = 'readonly';
  const data = helper.getObjectExclude(tableItems[rowIndex], ['checked']);
  data.parentDictionaryCode = newObj;
  const payload = buildEditPageState(newEditConfig, dictionaryLanguage, data, true);
  dispatch(action.assign(payload, 'edit'));
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  const index = isAll ? -1 : rowIndex;
  return action.update({checked}, 'tableItems', index);
};

const expandActionCreator = (key, expand) => {
  return action.assign({[key]: expand}, 'expand');
};

const selectActionCreator = (key) => async (dispatch, getState) => {
  let tableItems, dictionaryCode, newObj;
  const state = getSelfState(getState());
  if (state.tree[key].value.guid === 'root') {
    newObj = {
      title: state.tree[key].title,
      value: null,
    };
    dictionaryCode = '';
    const data = await fetchJson(URL_LIST, postOption({}));
    tableItems = data.result.data
  }else {
    dictionaryCode = state.tree[key].value;
    newObj = {
      title: state.tree[key].title,
      value: state.tree[key].value,
    };
    const data = await fetchJson(URL_LIST, postOption({dictionaryCode}));
    if(data.returnCode !== 0) return;
    tableItems = data.result.data;
  }

  dispatch(action.assign({tableItems, select: key, dictionaryCode, newObj}));

};

const tabChangeActionCreator = (activeKey) => (dispatch, getState) => {
  dispatch(action.assign({activeKey}));
  if (activeKey === 'tree') {
    const {select} = getSelfState(getState());
    return selectActionCreator(select)(dispatch, getState);
  }
};

const linkActionCreator = (key, rowIndex, item) => async (dispatch) => {
  const dictionaryCode = item.id.code;
  const newObj = {
    title: item.id.title,
    value: item.id.code,
  };
  const data = await fetchJson(URL_LIST, postOption({dictionaryCode}));
  if(data.returnCode !== 0) return;
  const tableItems = data.result.data;

  dispatch(action.assign({tableItems, dictionaryCode, newObj}));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onInputChange: inputChangeActionCreator,
  onClick: clickActionCreator,
  onCheck: checkActionCreator,
  onExpand: expandActionCreator,
  onSelect: selectActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onTabChange: tabChangeActionCreator,
  onLink: linkActionCreator
};


const Component = EnhanceLoading(EnhanceDialogs(
  TreePage,
  ['edit', 'confirm'],
  [EditDialogContainer, ConfirmDialogContainer]
));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
