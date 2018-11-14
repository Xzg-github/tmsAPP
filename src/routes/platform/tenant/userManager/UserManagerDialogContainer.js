import { connect } from 'react-redux';
import UserManagerDialog from './UserManagerDialog';
import helper from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';

const URL_LIST = '/api/basic/tenant/user_list';
const URL_USER_DEL = '/api/basic/tenant/user_del';

const createContainer = (statePath, afterEditActionCreator) => {
  const action = new Action(statePath, false);

  const getSelfState = (rootState) => {
    return getPathValue(rootState, statePath);
  };

  const changeActionCreator = (key, value) =>async (dispatch)=>  {
    dispatch(action.assign({[key]: value}, 'searchData'));
  };

  const optionsSearchActionCreator = (key, filter) => async (dispatch, getState) => {
    let data, options;
    switch (key) {
      case "role": {
        const {tenantGuid} = getSelfState(getState());
        const url = `/api/basic/tenant/role_drop_list/${tenantGuid}`;
        data = await helper.fetchJson(url, 'post');
        break;
      }
      default:
        return;
    }
    if (data.returnCode === 0) {
      options =data.result instanceof Array? data.result:data.result.data;
      dispatch(action.update({options}, 'filters', {key:'key', value: key}));
    }
  };

  const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
    const {allItems=[], pageSize, maxRecords} = getSelfState(getState());
    const p = Number(currentPage);
    const size = Number(pageSize);
    const tableItems = Number(maxRecords) > p*size ? allItems.slice((p-1)*size, p*size) : allItems.slice((p-1)*size);
    dispatch(action.assign({currentPage, tableItems}));
  };

  const pageSizeActionCreator = (pageSize, currentPage) => (dispatch, getState) => {
    const {allItems=[], maxRecords} = getSelfState(getState());
    const p = Number(currentPage);
    const size = Number(pageSize);
    const tableItems = Number(maxRecords) > p*size ? allItems.slice((p-1)*size, p*size) : allItems.slice((p-1)*size);
    dispatch(action.assign({currentPage, tableItems, pageSize}));
  };

  const checkActionCreator = (isAll, checked, rowIndex) => (dispatch, getState) => {
    const selfState = getSelfState(getState());
    isAll && (rowIndex = -1);
    const [...allItems] = selfState.allItems || [];
    let tableItems = selfState.tableItems;
    if (rowIndex === -1) {
      tableItems = selfState.tableItems.map(item => {
        const index2 = allItems.findIndex(({guid}) => guid === item.guid);
        allItems[index2] = {...allItems[index2], checked};
        return {...item, checked}
      });
    }else {
      tableItems = selfState.tableItems.map((item, index) => {
        if (index === rowIndex) {
          const index2 = allItems.findIndex(({guid}) => guid === item.guid);
          allItems[index2] = {...allItems[index2], checked};
          return {...item, checked}
        }else {
          return item;
        }
      });
    }
    dispatch(action.assign({allItems, tableItems}));
  };

  const linkActionCreator = (key, rowIndex, item) => (dispatch, getState) => {
  };

  const searchActionCreator = async (dispatch, getState) => {
    const {pageSize, searchData, tenantGuid} = getSelfState(getState());
    const {returnCode, result=[], returnMsg=''} = await helper.fetchJson(URL_LIST, helper.postOption(helper.convert({...searchData, tenantGuid})));
    if (returnCode !== 0) {
      helper.showError(`${returnCode}${returnMsg}`);
      return;
    }
    const newState = {
      allItems: result,
      currentPage: 1,
      tableItems: result.length > pageSize ? result.slice(0, 10) : result,
      maxRecords: result.length
    };
    dispatch(action.assign(newState));
  };

  const resetActionCreator = (dispatch) => {
    dispatch(action.assign({searchData: {}}));
  };

  const toolbarActions = {
    reset: resetActionCreator,
    search: searchActionCreator
  };

  const clickActionCreator = (key) => {
    if (toolbarActions.hasOwnProperty(key)) {
      return toolbarActions[key];
    } else {
      return {type: 'unknown'};
    }
  };

  const okActionCreator = () => async (dispatch, getState) => {
    const {allItems=[]} = getSelfState(getState());
    const items = allItems.filter(item => item.checked === true).map(item => item.guid);
    if (items.length < 1) return helper.showError('请先勾选记录');
    const {returnCode, returnMsg} = await helper.fetchJson(URL_USER_DEL, helper.postOption(items));
    if (returnCode === 0) {
      helper.showSuccessMsg('用户注销成功');
      return searchActionCreator(dispatch, getState);
    } else {
      helper.showError(returnMsg);
    }
  };

  const cancelActionCreator = () => {
    return afterEditActionCreator();
  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const actionCreators = {
    onChange: changeActionCreator,
    onSearch: optionsSearchActionCreator,
    onPageNumberChange: pageNumberActionCreator,
    onPageSizeChange: pageSizeActionCreator,
    onCheck: checkActionCreator,
    onLink: linkActionCreator,
    onClick: clickActionCreator,
    onOk: okActionCreator,
    onCancel: cancelActionCreator
  };

  return connect(mapStateToProps, actionCreators)(UserManagerDialog);
};

export {createContainer};
