import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import Import from './Import';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from "../../../action-reducer/action";
import helper from "../../../common/common";
import {showImportDialog} from '../../../common/modeImport';

const STATE_PATH = ['import'];
const action = new Action(STATE_PATH);

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  try {
    const urlConfig = '/api/order/import/config';
    const urlList = '/api/config/modeinput/list?modelTypeCode=transport_import';
    const config = helper.getJsonResult(await helper.fetchJson(urlConfig));
    const tableItems = helper.getJsonResult(await helper.fetchJson(urlList));
    const allItems = tableItems.map(item => ({...item, down: item.url ? '下载' : ''}));
    const payload = {
      ...config,
      allItems,
      tableItems: allItems,
      searchData: {},
      checkedRows: [],
      status: 'page'
    };
    dispatch(action.create(payload));
  }catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const resetActionCreator = (dispatch) => {
  dispatch(action.assign({searchData: {}}));
};

const searchActionCreator = (dispatch, getState) => {
  const {allItems, searchData} = getSelfState(getState());
  const {modelName} = searchData;
  const tableItems = modelName ? allItems.filter(item => item.modelName.includes(modelName)) : allItems;
  dispatch(action.assign({tableItems, checkedRows: []}));
};

const importActionCreator = async (dispatch, getState) => {
  const {checkedRows, tableItems} = getSelfState(getState());
  if (checkedRows.length !== 1) return helper.showError(`请先选择一个模板`);
  return showImportDialog('transport_import', undefined, false, '', '', tableItems[checkedRows.pop()].id);
};

const buttons = {
  reset: resetActionCreator,
  search: searchActionCreator,
  import: importActionCreator,
};

const clickActionCreator = (key) => {
  if (buttons[key]) {
    return buttons[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'searchData');
};

const radioActionCreator = (checkedRows) => {
  return action.assign({checkedRows});
};

const linkActionCreator = (key, rowIndex, item) => async () => {
  if (key === 'modelCode') {
    return showImportDialog('transport_import', undefined, false, '', '', item.id);
  }else if (key === 'down') {
    const URL_DOWNLOAD= '/api/track/file_manager/download';  // 点击下载
    const {returnCode, result, returnMsg} = await helper.fetchJson(`${URL_DOWNLOAD}/${item.url}`);
    if (returnCode !== 0) {
      return helper.showError(returnMsg);
    }
    helper.download(`/api/proxy/zuul/file-center-service/${result[item.url]}`,'file');
  }
};

const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const selfState = getSelfState(getState());
  const item = selfState.tableItems[index];
  return showImportDialog('transport_import', undefined, false, '', '', item.id);
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onRadio: radioActionCreator,
  onLink: linkActionCreator,
  onDoubleClick: doubleClickActionCreator,
};

export default connect(mapStateToProps, actionCreators)(EnhanceLoading(Import));

