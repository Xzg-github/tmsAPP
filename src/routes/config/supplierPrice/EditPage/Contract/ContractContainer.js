import {connect} from 'react-redux';
import Contract from './Contract';
import {Action} from '../../../../../action-reducer/action';
import {EnhanceLoading} from '../../../../../components/Enhance';
import {getPathValue} from '../../../../../action-reducer/helper';
import helper, {getJsonResult, postOption, fetchJson, showError, showSuccessMsg} from '../../../../../common/common';
import execWithLoading from '../../../../../standard-business/execWithLoading';
import {updateTable} from '../../OrderPageContainer';

const PARENT_PATH = ['supplierPrice'];
const STATE_PATH = ['supplierPrice', 'edit'];

const URL_DETAIL = '/api/config/supplierPrice/detail';
const URL_SUPPLIER = '/api/config/supplierPrice/supplier';
const URL_SAVE_NEWADD = '/api/config/supplierPrice/contractSave';
const URL_SAVE_COMMIT = '/api/config/supplierPrice/contractCommit';

const action = new Action(STATE_PATH);
const PATH = 'contract';  // PATH与tab页签的key值一致

const getParentState = (rootState) => {
  const parent = getPathValue(rootState, PARENT_PATH);
  return parent[parent.activeKey];
};

const getSelfState = (rootState) => {
  const parent = getParentState(rootState);
  return parent[parent.activeKey];
};

const changeActionCreator = (key, value) => async (dispatch, getState) => {
  dispatch(action.assign({[key]: value}, [PATH, 'value']));
};

const formSearchActionCreator = (key, value) => async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  let result = [], params = {maxNumber: 20, filter: value};
  switch (key) {
    case 'supplierId':
    case 'balanceCompany': {
       result = getJsonResult(await fetchJson(URL_SUPPLIER, postOption(params)));
       break;
    }
  }
  const index = controls.findIndex(item => item.key === key);
  dispatch(action.update({options: result}, [PATH, 'controls'], index));
};

const saveActionCreator = async (dispatch, getState) => {
  execWithLoading(async () => {
    const {editType, fileList, value={}, controls} = getSelfState(getState());
    if (!helper.validValue(controls, value)) {
      return dispatch(action.assign({valid: true}, [PATH]));
    }
    const url = editType === 2 ? URL_SAVE_COMMIT : URL_SAVE_NEWADD;
    const params = {fileList, value};
    const {returnCode, returnMsg} = await fetchJson(url, helper.postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    await updateTable();
  });
};

const commitActionCreator = async (dispatch, getState) => {
  execWithLoading(async () => {
    const {fileList, value={}, controls} = getSelfState(getState());
    if (!helper.validValue(controls, value)) {
      return dispatch(action.assign({valid: true}, [PATH]));
    }
    const params = {fileList, value};
    const {returnCode, returnMsg} = await fetchJson(URL_SAVE_COMMIT, helper.postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    await updateTable();
  });
};

const toolbarActions = {
  save: saveActionCreator,
  commit: commitActionCreator
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    return {type: 'unknown'};
  }
};

const onExitValidActionCreator = () => async (dispatch, getState) => {
  dispatch(action.assign({valid: false}, [PATH]));
};

const handleImgChange = (data) => async (dispatch, getState) => {
  // 控制最多上传10个
  const list = data.fileList.filter(o => o.status);
  const fileList = list.length > 10 ? list.slice(0, 10) : list;
  dispatch(action.assign({fileList}, [PATH]));
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    dispatch(action.assign({status: 'loading'}, [PATH]));
    const {item={}, tabs, editType} = getParentState(getState());
    let state = {};
    if (editType === 2) {
      const data = getJsonResult(await fetchJson(`${URL_DETAIL}/${item.id}`));
      const {total={}, fileList=[], ...other={}} = data;
      state = {fileList, value: other};
      const newTabs = tabs.map(tab => {
        (tab.key === 'freight') && (tab.title = `${tab.title}（${total.masterTotal || 0}）`);
        (tab.key === 'extraCharge') && (tab.title = `${tab.title}（${total.additionalTotal || 0}）`);
        return tab;
      });
      dispatch(action.assign({tabs: newTabs}));
    } else {
      state = item;
    }
    if (state.fileList && state.fileList.length > 0) {
      state.fileList = await getFiles(state.fileList);
    }
    const payload = {editType, ...state, status: 'page'};
    dispatch(action.assign(payload, [PATH]));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}, [PATH]));
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onExitValid: onExitValidActionCreator,
  handleImgChange
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(Contract));
export default Container;
