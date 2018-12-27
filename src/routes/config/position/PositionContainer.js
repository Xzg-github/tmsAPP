import excel from './excel';
import {connect} from 'react-redux';
import Position from './Position';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import helper from '../../../common/common';
import Fence from '../../../standard-business/showElectricFence';
import execWithLoading from '../../../standard-business/execWithLoading';
import moment from 'moment';

const action = new Action(['position'], false);
const URL_CONFIG = '/api/config/position/config';
const fence = new Fence();

const getSelfState = (state) => {
  return state.position || {};
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const payload = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    payload.status = 'page';
    payload.items = [];
    payload.checkedRows = [];
    payload.handled = false;
    dispatch(action.assign(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const importActionCreator = () => (dispatch, getState) => {
  const state = getSelfState(getState());
  excel.importExcel(state.cols, (items) => {
    if (!items) {
      helper.showError('excel表头不正确');
    } else {
      dispatch(action.assign({items, handled: false}));
    }
  });
};

const batchActionCreator = () => (dispatch, getState) => {
  const state = getSelfState(getState());
  if (!state.items.length) {
    helper.showError('请先导入有数据的excel文件');
  } else if (state.handled) {
    helper.showError('经纬度已经获取，请不要重复获取');
  } else {
    execWithLoading(async () => {
      const items = await fence.getPoints(state.items);
      dispatch(action.assign({items, handled: true}));
    });
  }
};

const adjustActionCreator = () => async (dispatch, getState) => {
  const {checkedRows, items} = getSelfState(getState());
  if (checkedRows.length !== 1) {
    helper.showError('请勾选一条记录');
  } else {
    const result = await fence.showEx(items[checkedRows[0]]);
    if (result) {
      dispatch(action.update(result, 'items', checkedRows[0]));
    }
  }
};

const exportActionCreator = () => (dispatch, getState) => {
  const state = getSelfState(getState());
  excel.exportExcel(state.cols, state.items, moment().format('YYYYMMDDHHmmss'));
};

const clickActionCreators = {
  import: importActionCreator,
  batch: batchActionCreator,
  adjust: adjustActionCreator,
  export: exportActionCreator
};

const clickActionCreator = (key) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key]();
  } else {
    return {type: 'unknown'};
  }
};

const checkActionCreator = (checkedRows) => {
  return action.assign({checkedRows});
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onClick: clickActionCreator,
  onCheck: checkActionCreator,
};

export default connect(mapStateToProps, actionCreators)(EnhanceLoading(Position));
