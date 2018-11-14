import { connect } from 'react-redux';
import AccountManager from './AccountManager';
import {postOption, convert, fetchJson, showSuccessMsg, showError} from '../../../common/common';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search} from '../../../common/search';
import {fetchDictionary, setDictionary} from '../../../common/dictionary';

const prefix = ['config', 'accountManager'];
const action = new Action(prefix);
const URL_CONFIG = '/api/config/account_manager/config';
const URL_LIST  = '/api/config/account_manager/list';
const URL_SEARCH  = '/api/config/account_manager/search';
const URL_ROLE_LIST = '/api/config/account_manager/role_list';
const URL_ROLES_LIST = '/api/config/account_manager/roles_list';
const URL_SET_ROLE = '/api/config/account_manager/set_role';
const URL_DEL_ROLE = '/api/config/account_manager/del_role';
const URL_DATA_ROLES = '/api/config/account_manager/data_roles';
const URL_DATA_ROLES_OK = '/api/config/account_manager/data_roles_ok';
const URL_DATA_ROLES_DELETE = '/api/config/account_manager/data_roles_delete';
const DEPARTMENT= '/api/basic/user/department';
const INSTITUTION='/api/basic/user/institution';

const itemsRoleLHandler = (items) => {  // 用户列表角色字段数据的处理
  items.forEach((user) => {
    if(user.roles && user.roles.length > 0) {
      let roleList = [];
      user.roles.forEach((role) => {
        roleList.push(role.roleName);
      });
      user.roleList = roleList.join(',');
    }
  });
};

const getSelfState = (rootState) => {     // 获取对应的state
  return getPathValue(rootState, prefix);
};

const initActionCreator = () => async (dispatch) => {    // 初始化state
  dispatch(action.assign({status: 'loading'}));
  const config = await fetchJson(URL_CONFIG);
  if (config.returnCode === 0) {
    const {returnCode, result} = await search(URL_LIST, 0, 10, {});
    if(returnCode === 0) {
      itemsRoleLHandler(result.data);
      result.data.map((item) => {
        if (item.dataRoles) {
          item.dataRoles = item.dataRoles.map( item => item.dataRoleName);
          item.dataRoles = item.dataRoles.join(' , ');
        }
      });
      const dictionary = await fetchDictionary(config.result.names);
      setDictionary(config.result.itemCols, dictionary.result);
      setDictionary(config.result.filters, dictionary.result);
      dispatch(action.assign({status: 'page', ...config.result, tableItems: result.data, returnTotalItems: result.returnTotalItems}));
    } else {
      dispatch(action.assign({status: 'retry'}));
    }
  } else {
    dispatch(action.assign({status: 'retry'}));
  }
};

const onSearch = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const searchData = state.searchData;
  const filter = Object.keys(searchData).reduce((state, key) => {
    if (searchData[key] !== '') {
      state[key] = searchData[key];
    }
    return state;
  }, {});
  const body = {
    itemFrom:0,
    itemTo:state.pageSize,
    ...filter
  };
  const {result, returnCode} = await fetchJson(URL_SEARCH, postOption(convert(body)));
  if(returnCode === 0) {
    itemsRoleLHandler(result.data);
    result.data.map((item) => {
      if (item.dataRoles) {
        item.dataRoles = item.dataRoles.map( item => item.dataRoleName);
        item.dataRoles = item.dataRoles.join(' , ');
      }
    });
    dispatch(action.assign({tableItems: result.data, returnTotalItems: result.returnTotalItems}));
  }
};

const onPageSizeChange = (size, current) => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const itemFrom = (current - 1) * size;
  const itemTo = (current) * size;
  const searchData = state.searchData;
  const {result, returnCode} = await search(URL_LIST, itemFrom, itemTo, searchData);
  if(returnCode === 0) {
    itemsRoleLHandler(result.data);
    result.data.map((item) => {
      if (item.dataRoles) {
        item.dataRoles = item.dataRoles.map( item => item.dataRoleName);
        item.dataRoles = item.dataRoles.join(' , ');
      }
    });
    dispatch(action.assign({tableItems: result.data, returnTotalItems: result.returnTotalItems, pageSize: size}));
  }
};

const onPageNumberChange = (page) => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const itemFrom = (page - 1) * state.pageSize;
  const itemTo = (page) * state.pageSize;
  const searchData = state.searchData;
  const {result, returnCode} = await search(URL_LIST, itemFrom, itemTo, searchData);
  if(returnCode === 0) {
    itemsRoleLHandler(result.data);
    result.data.map((item) => {
      if (item.dataRoles) {
        item.dataRoles = item.dataRoles.map( item => item.dataRoleName);
        item.dataRoles = item.dataRoles.join(' , ');
      }
    });
    dispatch(action.assign({tableItems: result.data, returnTotalItems: result.returnTotalItems, currentPage: page}));
  }
};

const searchDataChange = (key, value) => async(dispatch, getState) => {
  if(key === 'institutionGuid'){
    dispatch(action.assign({'departmentGuid': ''}, 'searchData'));
    dispatch(action.update({options: []}, 'filters', {key: 'key', value: 'departmentGuid'}));
  }
  dispatch(action.assign({[key]: value}, 'searchData'));
};

const searchJG = (key, title) => async (dispatch) => {
  let opts=[];
  const {returnCode, returnMsg, result} = await fetchJson(INSTITUTION, postOption({
    "filter": {
      "institutionName":title
    },
    "itemFrom": 0,
    "itemTo": 10
  }, 'post'));
  if(returnCode!==0){return showError(returnMsg)}
  result.data.map(x=>opts.push({value:x.guid,title:x.institutionName}));
  dispatch(action.update({options: opts}, 'filters', {key: 'key', value: key}));
};

const searchBM = (key, title) => async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  if (!searchData.institutionGuid) {
    return showError("请先填写归属机构！")
  }
  let opts=[];
  const {returnCode, returnMsg, result} = await fetchJson(DEPARTMENT, postOption({
    "filter": {
      "departmentName": title,
      "institutionGuid": searchData.institutionGuid.value
    },
    "itemFrom": 0,
    "itemTo": 10
  }, 'post'));
  if (returnCode !== 0) {
    return showError(returnMsg)
  }
  result.data.map(x => opts.push({value: x.guid, title: x.departmentName}));
  dispatch(action.update({options: opts}, 'filters', {key: 'key', value: key}));
};

const searchDataSearch = (key, title) => {
  if (key === 'institutionGuid') {
    return searchJG(key, title);
  } else if (key === 'departmentGuid') {
    return searchBM(key, title);
  }
};

const resetSearchData = () => (dispatch) => {
  dispatch(action.assign({searchData: {}}));
};

const onCheck = (isAll, checked, rowIndex) => (dispatch) => {
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex));
};

const getRoleList = (checkedUserIds) => async (dispatch) => {
  const {returnCode, result} = await fetchJson(URL_ROLES_LIST);
  if(returnCode === 0){
    dispatch(action.assign({roleList: result, filterItems: result, checkedUserIds}));
  }
  // const {returnCode, result} = await fetchJson(URL_ROLE_LIST, postOption({id}));
  // if(returnCode === 0) {
  //   dispatch(action.assign({roleList: result.roles}));
  //   // result.roles.forEach((role) => {
  //   //   if(result.selectedRoleKeys.indexOf(role.id) > -1) {
  //   //     role.checked = true;
  //   //   }
  //   // });
  //   // dispatch(action.assign({checkedList: result.roles}));
  // }
};

const getDataRoles = (checkedUserIds) => async (dispatch, getState) => {
  // const {tableItems} = getSelfState(getState());
  // const index = helper.findOnlyCheckedIndex(tableItems);
  // const item = tableItems[index];
  const {returnCode, returnMsg, result} = await fetchJson(URL_DATA_ROLES);
  if (returnCode !== 0) {
    showSuccessMsg(returnMsg);
    return;
  }
  // if (item.dataRoles){
  //   const arr = item.dataRoles.split(' , ');
  //   result.filter((item) => {
  //     if (arr.indexOf(item.dataRoleName) !==-1) {
  //       item.checked = true
  //     }
  //   })
  // }
  dispatch(action.assign({dataRoleList: result, filterItems: result,  checkedUserIds}));
};

const onRoleListCheck = (isAll, checked, rowIndex) => (dispatch) => {
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'roleList', rowIndex));
};

const onDataListCheck= (isAll, checked, rowIndex) => (dispatch) => {
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'dataRoleList', rowIndex));
};

const onSetRole = (id, roles = [], type) => async (dispatch, getState) => {
  const state = getSelfState(getState());
  let userRoles = [];
  let roleLists = [];
  state.roleList.map((item) =>{
    if(item.checked){
      roleLists.push(item.id)
    }
  });
  state.checkedUserIds.map((item) =>{
    userRoles.push({
        userId: item,
        roles: roleLists
    })
  });
  // let roleListIds = [];
  // let roleList = [];
  //
  // roles.forEach((role) => {
  //   roleListIds.push(role.id);
  //   roleList.push(role.roleName);
  // });
  //
  // roleList = roleList.join(',');
  if (type === false) {
    const {returnCode} = await fetchJson(URL_SET_ROLE, postOption(userRoles));
    if (returnCode === 0) {
      const {currentPage, searchData} = state;
      const itemForm = (currentPage - 1) * state.pageSize;
      const itemTo = (currentPage) * state.pageSize;
      showSuccessMsg('角色分配成功');
      const list = await search(URL_LIST, itemForm, itemTo, searchData);
      itemsRoleLHandler( list.result.data);
      list.result.data.map((item) => {
        if (item.dataRoles) {
          item.dataRoles = item.dataRoles.map( item => item.dataRoleName);
          item.dataRoles = item.dataRoles.join(' , ');
        }
      });
      dispatch(action.assign({tableItems: list.result.data, currentPage: currentPage}));
      //dispatch(action.update({roles, roleList}, 'tableItems', {key: 'id', value: id}));
    }
  }else {
    const {currentPage, searchData} = state;
    const itemForm = (currentPage - 1) * state.pageSize;
    const itemTo = (currentPage) * state.pageSize;
    let idLists = [];
    let allChecked = [];
    state.dataRoleList.map((item) => {
      if (item.checked) {
        idLists.push(item.id)
      }
    });
    state.checkedUserIds.map((item) =>{
      allChecked.push({
        userId: item,
        idList: idLists
      })
    });
    const {returnCode} = await fetchJson(URL_DATA_ROLES_OK, postOption({allChecked}));
    if (returnCode === 0) {
      const list = await search(URL_LIST, itemForm, itemTo, searchData);
      showSuccessMsg('数据角色分配成功');
      itemsRoleLHandler( list.result.data);
      list.result.data.map((item) => {
        if (item.dataRoles) {
          item.dataRoles = item.dataRoles.map( item => item.dataRoleName);
          item.dataRoles = item.dataRoles.join(' , ');
        }
      });
      dispatch(action.assign({tableItems: list.result.data, currentPage: currentPage}));
    }
  }

};

const onClearRole = (id) =>  async (dispatch, getState) => {
  const state = getSelfState(getState());
  const {returnCode} = await fetchJson(URL_DEL_ROLE, postOption(state.checkedUserIds));
  if (returnCode === 0) {
    const {currentPage, searchData} = state;
    const itemForm = (currentPage - 1) * state.pageSize;
    const itemTo = (currentPage) * state.pageSize;
    showSuccessMsg('清除角色成功');
    const list = await search(URL_LIST, itemForm, itemTo, searchData);
    itemsRoleLHandler( list.result.data);
    list.result.data.map((item) => {
      if (item.dataRoles) {
        item.dataRoles = item.dataRoles.map( item => item.dataRoleName);
        item.dataRoles = item.dataRoles.join(' , ');
      }
    });
    dispatch(action.assign({tableItems: list.result.data, currentPage: currentPage}));
  }
};



const onClearRole2 = (id) =>  async (dispatch, getState) => {
  const state = getSelfState(getState());
  console.log(state)
  const {currentPage, searchData} = state;
  const itemForm = (currentPage - 1) * state.pageSize;
  const itemTo = (currentPage) * state.pageSize;
  const {returnCode} = await fetchJson(URL_DATA_ROLES_DELETE, postOption(state.checkedUserIds));
  //const {returnCode} = await fetchJson(`${URL_DATA_ROLES_DELETE}/${id}`, 'delete');
  if (returnCode === 0) {
    const list = await search(URL_LIST, itemForm, itemTo, searchData);
    itemsRoleLHandler(list.result.data);
    list.result.data.map((item) => {
      if (item.dataRoles) {
        item.dataRoles = item.dataRoles.map(item => item.dataRoleName);
        item.dataRoles = item.dataRoles.join(' , ');
      }
    });
    dispatch(action.assign({tableItems: list.result.data, currentPage: currentPage}));
    showSuccessMsg('清除数据角色成功');
  }
};

const onClearRoleList = () => (dispatch) => {
  dispatch(action.assign({roleList: [], formValue: null}));
};

const mapStateToProps = (state) => {     // 返回state
  return getSelfState(state);
};

//Input搜索框change监听
const changeActionCreator = (value) => (dispatch, getState) =>{
  dispatch(action.assign({formValue: value}));
   const { filterItems, formValue} = getSelfState(getState());
   let newTableItems = [];
   filterItems.forEach((item) => {
     if(item.roleName.toLowerCase().indexOf(formValue.toLowerCase()) > -1) {
       newTableItems.push(item);
     }
   });
   dispatch(action.assign({roleList: newTableItems}));
};

const dataRoleChangeActionCreator = (value) => (dispatch, getState) =>{
  dispatch(action.assign({formValue: value}));
  const { filterItems, formValue} = getSelfState(getState());
  let newTableItems = [];
  filterItems.forEach((item) => {
    if(item.dataRoleName.toLowerCase().indexOf(formValue.toLowerCase()) > -1) {
      newTableItems.push(item);
    }
  });
  dispatch(action.assign({dataRoleList: newTableItems}));
};


const actionCreators = {   // 返回action
  onInit: initActionCreator,
  onPageSizeChange: onPageSizeChange,
  onPageNumberChange: onPageNumberChange,
  searchDataChange: searchDataChange,
  searchDataSearch: searchDataSearch,
  resetSearchData: resetSearchData,
  onSearch: onSearch,
  onCheck: onCheck,
  getRoleList:getRoleList,
  onRoleListCheck: onRoleListCheck,
  onSetRole: onSetRole,
  onClearRole: onClearRole,
  onClearRole2:onClearRole2,
  onClearRoleList: onClearRoleList,
  onDataListCheck: onDataListCheck,
  getDataRoles: getDataRoles,
  onChange: changeActionCreator,
  onDataRoleChange: dataRoleChangeActionCreator,
};
const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(AccountManager));
export default Container;
