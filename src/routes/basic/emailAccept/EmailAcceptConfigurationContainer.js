import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {postOption, getObject, fetchJson, showError, showSuccessMsg} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildEditState} from './EmailAcceptConfigurationEditDialogContainer';
import {EnhanceEditDialog} from '../../../components/Enhance';
import EmailAcceptConfigurationEditDialogContainer from './EmailAcceptConfigurationEditDialogContainer';
import {search, search2} from '../../../common/search';
import {toFormValue} from '../../../common/check';

const STATE_PATH = ['config', 'emailAccept', 'accept'];
const action = new Action(STATE_PATH);
const URL_ACCEPT_LIST = '/api/config/emailAccept/accept_list';
const URL_ACCEPT_DEL = '/api/config/emailAccept/accept_del';
const URL_ISACTIVE = '/api/config/emailAccept/accept_is_active';
const URL_EMAIL_DROP = '/api/config/emailAccept/email_drop';
const URL_LEAD_LIST ='/api/config/emailAccept/lead_list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const checkedOne = (tableItems) => {
  const index = tableItems.reduce((result, item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return index.length !== 1 ? -1 : index[0];
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'searchData');
};

const resetActionCreator = (dispatch) => {
  dispatch(action.assign({searchData: {}}));
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_ACCEPT_LIST, currentPage, pageSize, toFormValue(searchDataBak));
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_ACCEPT_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_ACCEPT_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
};

// 根据过滤条件请求列表
const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_ACCEPT_LIST, 1, pageSize, toFormValue(searchData), newState);
};

const addActionCreator = async(dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const payload = buildEditState(editConfig, {}, false);
  dispatch(action.assign(payload, 'edit'));
};

const editActionCreator = async (dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index !== -1) {
    if(tableItems[index].active !== 'active_unactivated'){
      if(tableItems[index].uploadMode !== 'upload_mode_epld_excel'){
        editConfig.editControls.map(item => {
          if (item.key === 'excelModelConfigId') {
            item.type = 'readonly';
            item.required = false;
          }
        });
      }else{
        editConfig.editControls.map(item => {
          if (item.key === 'excelModelConfigId') {
            item.type = 'search';
            item.required = true;
          }
        });
      }
    }else {
      if(tableItems[index].uploadMode !== 'upload_mode_epld_excel'){
        editConfig.editControls1.map(item => {
          if (item.key === 'excelModelConfigId') {
            item.type = 'readonly';
            item.required = false;
          }
        });
      }else{
        editConfig.editControls1.map(item => {
          if (item.key === 'excelModelConfigId') {
            item.type = 'search';
            item.required = true;
          }
        });
      }
    }

    const payload = buildEditState(editConfig, tableItems[index], true, index);
    dispatch(action.assign(payload, 'edit'));
  }else{
    showError('只能编辑一条');
    return;
  }
};

const doubleClickActionCreator = (rowIndex) => async(dispatch, getState) => {
  const {tableItems, editConfig} = getSelfState(getState());
  if (rowIndex !== -1) {
    if(tableItems[rowIndex].active !== 'active_unactivated'){
      if(tableItems[rowIndex].uploadMode !== 'upload_mode_epld_excel'){
        editConfig.editControls.map(item => {
          if (item.key === 'excelModelConfigId') {
            item.type = 'readonly';
            item.required = false;
          }
        });
      }else{
        editConfig.editControls.map(item => {
          if (item.key === 'excelModelConfigId') {
            item.type = 'search';
            item.required = true;
          }
        });
      }
    }else {
      if(tableItems[rowIndex].uploadMode !== 'upload_mode_epld_excel'){
        editConfig.editControls1.map(item => {
          if (item.key === 'excelModelConfigId') {
            item.type = 'readonly';
            item.required = false;
          }
        });
      }else{
        editConfig.editControls1.map(item => {
          if (item.key === 'excelModelConfigId') {
            item.type = 'search';
            item.required = true;
          }
        });
      }
    }
    const payload = buildEditState(editConfig, tableItems[rowIndex], true, rowIndex);
    dispatch(action.assign(payload, 'edit'));
  }else{
    showError('只能编辑一条');
    return;
  }
};

// 激活
const activeAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  let ids=[];
  tableItems.map(item => {if(item.checked){ids.push(item.id)}});
  if (ids.length === 0) {
    showError('请勾选记录');
    return;
  }
  const {returnCode, returnMsg} = await fetchJson(URL_ISACTIVE, postOption({active: 'active_activated', ids}, 'put'));
  if (returnCode === 0) {
    return updateTable(dispatch, getState);
  } else {
    showError(returnMsg);
  }
};

// 失效
const inactiveAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  let ids=[];
  tableItems.map(item => {if(item.checked){ids.push(item.id)}});
  if (ids.length === 0) {
    showError('请勾选记录');
    return;
  }
  const {returnCode, returnMsg} = await fetchJson(URL_ISACTIVE, postOption({active: 'active_invalid', ids}, 'put'));
  if (returnCode === 0) {
    return updateTable(dispatch, getState);
  } else {
    showError(returnMsg);
  }
};

const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = checkedOne(tableItems);
  if (index === -1) {
    showError("只能删除一条");
    return;
  }
  const item = tableItems[index];
  if(item.active === 'active_unactivated'){
    const json = await fetchJson(`${URL_ACCEPT_DEL}/${item.id}`, 'delete');
    if (json.returnCode) {
      showError(json.returnMsg);
    } else {
      showSuccessMsg('删除成功！');
      dispatch(action.del('tableItems', index));
      return updateTable(dispatch, getState);
    }
  }else{
    showError('只能删除未激活状态');
  }
};

const buttons = {
  reset: resetActionCreator,
  search: searchClickActionCreator,
  add:addActionCreator,
  edit: editActionCreator,
  active: activeAction,
  inactive: inactiveAction,
  del: delAction
};

const clickActionCreator = (key) => (dispatch, getState) => {
  if (buttons[key]) {
    return buttons[key](dispatch, getState);
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
  const {filters} = getSelfState(getState());
  let body, res;
  if(key === 'emailAddressConfigId'){
    body = {maxNumber: 10, filter: title};
    res = await fetchJson(URL_EMAIL_DROP, postOption(body));
    let index = {key: 'key', value: 'emailAddressConfigId'};
    dispatch(action.update({options: res.result}, 'filters', index));
  } else if(key ==='importTemplateConfigId'){
    body = {maxNumber: 10, filter: title};
    res = await fetchJson(URL_LEAD_LIST, postOption(body));
    let options = [];
    res.result.map((item) => {
      options.push({
        value: item.id,
        title: item.uploadSubject
      })
    });
    let index = {key: 'key', value: 'importTemplateConfigId'};
    dispatch(action.update({options}, 'filters', index));
  }
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS.concat('edit'));
};

const actionCreators = {
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onClick: clickActionCreator,
  onSearch: formSearchActionCreator,
  onDoubleClick: doubleClickActionCreator
};

const Component = EnhanceEditDialog(OrderPage, EmailAcceptConfigurationEditDialogContainer);
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
export {updateTable};
