import { connect } from 'react-redux';
import Tenantapi from './Tenantapi';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import AddDialogContainer, {buildEditState} from './AddDialogContainer';
import showPopup from '../../../standard-business/showPopup';
import {fetchJson, getActions, showError, postOption} from "../../../common/common";

const STATE_PATH = ['config', 'tenantapi'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/config/tenantapi/config';
const URL_LIST = '/api/config/tenantapi/list';
const URL_TENANT_LIST  = '/api/config/tenant_authority_distribution/tenant_list';
const URL_DEL = '/api/config/tenantapi';
const URL_ALL_NAME = '/api/config/tenantapi/all_name';

const getSelfState = (state) => {
  return getPathValue(state, STATE_PATH);
};

const buildState = (config, []) => {
  return {
    ...config,
    tableItems: []
  };
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  let res, config;
  res = await fetchJson(URL_CONFIG);
  if (!res) {
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  config = res;

  const buttons = config.buttons;
  const actions = getActions('tenantapi');
  config.buttons = buttons.filter(button => actions.findIndex(item => item === button.sign)!==-1);
  const payload = Object.assign(buildState(config, []), {status: 'page'});
  dispatch(action.create(payload));
};

const checkedOne = (tableItems) => {
  const index = tableItems.reduce((result, item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return index.length !== 1 ? -1 : index[0];
};

//选择
const addActionCreator = async(dispatch, getState) => {
  const {addConfig, searchData, tableItems} = getSelfState(getState());
  let tenantId = searchData.tenantId.value;
  const json = await fetchJson(`${URL_ALL_NAME}?tenantId=${tenantId}`);
  if(json.returnCode !== 0) return showError(json.returnMsg);
  const selectItem = json.result;
  const filterItems = json.result;
  const okFunc = (addItems=[]) => {
    const newItems = addItems.concat(tableItems);
    dispatch(action.assign({tableItems: newItems}));
  };
  buildEditState(addConfig, filterItems, selectItem, tenantId, true, dispatch, okFunc);
  showPopup(AddDialogContainer);
};

// 删除
const delActionCreator = async(dispatch, getState) => {
  const checkId = [];
  const {tableItems} = getSelfState(getState());
  const items = tableItems.filter(item => !item.checked);
  tableItems.filter(item => {
    if (item.checked) {
      return item.id ? checkId.push(item.id) : '';
    }
  });
  if (checkId.length === 0) {
    dispatch(action.assign({tableItems: items}));
  } else {
    const json = await fetchJson(URL_DEL, postOption({ids: checkId}, 'delete'));
    if (json.returnCode) {
      showError(json.returnMsg);
    } else {
      dispatch(action.assign({tableItems: items}));
    }
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const changeActionCreator = (key, value) => (dispatch) => {
  if(key ==='tenantId'){
    dispatch(action.assign({tableItems: []}));
  }
  dispatch(action.assign({[key]: value}, 'searchData'));
};

const resetActionCreator = (dispatch) => {
  dispatch(action.assign({searchData: {}}));
};

const searchClickActionCreator = async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  if (searchData !== undefined) {
    const postData = {tenantId: searchData.tenantId.value};
    const json = await fetchJson(URL_LIST, postOption(postData));
    if (json.returnCode) {
      showError(json.returnMsg);
    } else {
      dispatch(action.assign({tableItems: json.result}));
    }
  } else {
    showError('请搜索一个打开');
  }
};

const toolbarActions = {
  search: searchClickActionCreator,
  reset: resetActionCreator,
  add: addActionCreator,
  del: delActionCreator
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
  if (key === 'tenantId') {
    const {filters} = getSelfState(getState());
    const postData = {maxNumber:10, name: title};
    const json = await fetchJson(URL_TENANT_LIST, postOption(postData));
    if (json.returnCode) {
      showError(json.returnMsg);
    } else {
      const index = filters.findIndex(item => item.key === key);
      dispatch(action.update({options: json.result}, 'filters', index));
    }
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onClick: clickActionCreator,
  onCheck: checkActionCreator,
  onInit: initActionCreator,
  onSearch: formSearchActionCreator,
  onChange: changeActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(Tenantapi));
export default Container;
