import {connect} from 'react-redux';
import Freight from './Freight';
import {Action} from '../../../../../action-reducer/action';
import {EnhanceLoading} from '../../../../../components/Enhance';
import {getPathValue} from '../../../../../action-reducer/helper';
import helper, {getJsonResult, postOption, fetchJson, showError, showSuccessMsg} from '../../../../../common/common';
import execWithLoading from '../../../../../standard-business/execWithLoading';
import {search, search2} from '../../../../../common/search';
import showEditDialog from './EditDialog/EditDialogContainer';
import {showImportDialog} from '../../../../../common/modeImport';
import {exportExcelFunc} from '../../../../../common/exportExcelSetting';

const PARENT_PATH = ['customerPrice'];
const STATE_PATH = ['customerPrice', 'edit'];

const action = new Action(STATE_PATH);

const getParentState = (rootState) => {
  const parent = getPathValue(rootState, PARENT_PATH);
  return parent[parent.activeKey];
};

const getSelfState = (rootState) => {
  const parent = getParentState(rootState);
  return parent[parent.activeKey];
};

const createFreightContainer = (config) => {

  const {PATH, API, DIALOG_API, IMPORT_CODE} = config;

  const afterEdit = async (dispatch, pageSize) => {
    await search2(dispatch, action, API.list, 1, pageSize, {}, {currentPage: 1}, [PATH]);
  };

  const addActionCreator = async (dispatch, getState) => {
    const {controls, pageSize} = getSelfState(getState());
    const result = await showEditDialog({type: 0, controls, DIALOG_API});
    result && await afterEdit(dispatch, pageSize);
  };

  const copyActionCreator = async (dispatch, getState) => {
    const {controls, pageSize, items} = getSelfState(getState());
    const index = helper.findOnlyCheckedIndex(items);
    if (index === -1) return showError('请勾选一条数据！');
    const value = items[index];
    const result = await showEditDialog({type: 1, controls, value, DIALOG_API});
    result && await afterEdit(dispatch, pageSize);
  };

  const editActionCreator = async (dispatch, getState) => {
    const {controls, pageSize, items} = getSelfState(getState());
    const index = helper.findOnlyCheckedIndex(items);
    if (index === -1) return showError('请勾选一条数据！');
    const value = items[index];
    if (value['enabledType'] !== 'enabled_type_unenabled') {
      return showError('只能编辑未启用状态记录！');
    }
    const result = await showEditDialog({type: 2, controls, value, DIALOG_API});
    result && await afterEdit(dispatch, pageSize);
  };

  const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
    const {controls, pageSize, items} = getSelfState(getState());
    const value = items[rowIndex];
    if (value['enabledType'] !== 'enabled_type_unenabled') {
      return showError('只能编辑未启用状态记录！');
    }
    const result = await showEditDialog({type: 2, controls, value, DIALOG_API});
    result && await afterEdit(dispatch, pageSize);
  };

  const batchActionCreator = async (dispatch, getState) => {
    const {batchEditControls, pageSize, items} = getSelfState(getState());
    const index = helper.findOnlyCheckedIndex(items);
    if (index === -1) return showError('请勾选一条数据！');
    const value = items[index];
    const result = await showEditDialog({type: 3, controls: batchEditControls, value, DIALOG_API});
    result && await afterEdit(dispatch, pageSize);
  };

  const deleteActionCreator = async (dispatch, getState) => {
    const {items} = getSelfState(getState());
    const checkItems = items.filter(o => o.checked);
    if(checkItems.length < 1) return showError('请勾选一条数据！');
    if (checkItems.some(o => o.enabledType !== 'enabled_type_unenabled')) return showError('请选择未启用状态的数据！');
    const {returnCode, returnMsg} = await fetchJson(API.delete, postOption(checkItems.map(o=>o.id)));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    await afterEdit(dispatch, getState);
  };

  const ableActionCreator = async (type='enabled_type_enabled', dispatch, getState) => {
    const {items} = getSelfState(getState());
    const checkItems = items.filter(o=>o.checked);
    if(checkItems.length < 1) return showError('请勾选一条数据！');
    if(type === 'enabled_type_enabled') {
      if (checkItems.some(o=> o.enabledType === 'enabled_type_enabled')) return showError('请选择未启用或禁用状态的数据！');
    } else if(type === 'enabled_type_disabled') {
      if (checkItems.some(o=> o.enabledType !== 'enabled_type_enabled')) return showError('请选择已启用状态的数据！');
    }
    const params = {
      ids: checkItems.map(o=>o.id),
      type
    };
    const {returnCode, returnMsg} = await fetchJson(API.able, postOption(params));
    if (returnCode !== 0) return showError(returnMsg);
    showSuccessMsg(returnMsg);
    await afterEdit(dispatch, getState);
  };

  const enableActionCreator = async (dispatch, getState) => ableActionCreator('enabled_type_enabled', dispatch, getState);

  const disableActionCreator = async (dispatch, getState) => ableActionCreator('enabled_type_disabled', dispatch, getState);

  const importActionCreator = () => showImportDialog(IMPORT_CODE);

  const exportActionCreator = async (dispatch, getState)=>{
    const {cols, items} = getSelfState(getState());
    exportExcelFunc(cols, items);
  };

  const refreshActionCreator = async (dispatch, getState) => {
    execWithLoading(async () => {
      const {id} = getSelfState(getState());
      const {returnCode, returnMsg} = await fetchJson(`${API.refresh}/${id}`);
      if (returnCode !== 0) return showError(returnMsg);
      showSuccessMsg(returnMsg);
      await afterEdit(dispatch, getState);
    });
  };

  const toolbarActions = {
    add: addActionCreator,
    copy: copyActionCreator,
    edit: editActionCreator,
    batchEdit: batchActionCreator,
    enable: enableActionCreator,
    disable: disableActionCreator,
    delete: deleteActionCreator,
    import: importActionCreator,
    export: exportActionCreator,
    refresh: refreshActionCreator
  };

  const clickActionCreator = (key) => {
    if (toolbarActions.hasOwnProperty(key)) {
      return toolbarActions[key];
    } else {
      return {type: 'unknown'};
    }
  };

  const checkActionCreator = (isAll, checked, rowIndex) => async (dispatch, getState) => {
    isAll && (rowIndex = -1);
    dispatch(action.update({checked}, [PATH, 'items'], rowIndex));
  };

  const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
    const {pageSize, searchData={}} = getSelfState(getState());
    const newState = {currentPage};
    return search2(dispatch, action, API.list, currentPage, pageSize, searchData, newState, [PATH]);
  };

  const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
    const {searchData={}} = getSelfState(getState());
    const newState = {pageSize, currentPage};
    return search2(dispatch, action, API.list, currentPage, pageSize, searchData, newState, [PATH]);
  };

  const initActionCreator = () => async (dispatch, getState) => {
    try {
      dispatch(action.assign({status: 'loading'}, [PATH]));
      const {id, editType} = getParentState(getState());
      const {pageSize} = getSelfState(getState());
      const list = getJsonResult(await search(API.list, 0, pageSize, {id}));
      const payload = {
        editType,
        items: list.data,
        maxRecords: list.returnTotalItem,
        status: 'page'
      };
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
    onCheck: checkActionCreator,
    onDoubleClick: doubleClickActionCreator,
    onPageNumberChange: pageNumberActionCreator,
    onPageSizeChange: pageSizeActionCreator,
  };

  return connect(mapStateToProps, actionCreators)(EnhanceLoading(Freight));
};

const ACITON_PATH = 'freight';  // PATH与tab页签的key值一致

const URL_FREIGHT_DETAIL = '/api/config/customerPrice/freightDetail';
const URL_DELETE = '/api/config/customerPrice/freightDelete';
const URL_ABLE = '/api/config/customerPrice/freightAble';
const URL_REFRESH = '/api/config/customerPrice/freightRefresh';

const URL_ADD = '/api/config/customerPrice/freightAdd';
const URL_EDIT = '/api/config/customerPrice/freightEdit';
const URL_CUSTOMER = '/api/config/customerPrice/customer';
const URL_CAOMODE = '/api/config/customerPrice/carMode';
const URL_CURRENCY = '/api/config/customerPrice/currency';
const URL_BATCHEDIT = '/api/config/customerPrice/freightBatchEdit';

const Container = createFreightContainer({
  PATH: ACITON_PATH,
  API: {
    list: URL_FREIGHT_DETAIL,
    delete: URL_DELETE,
    able: URL_ABLE,
    refresh: URL_REFRESH
  },
  DIALOG_API: {
    newAdd: URL_ADD,
    editSave: URL_EDIT,
    search_customer: URL_CUSTOMER,
    search_carMode: URL_CAOMODE,
    search_currency: URL_CURRENCY,
    batchEdit: URL_BATCHEDIT
  },
  IMPORT_CODE: 'customer_price_master_import_detail'
});

export default Container;
export {createFreightContainer};
