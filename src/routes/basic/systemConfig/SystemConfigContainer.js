import { connect } from 'react-redux';
import SystemConfig from './SystemConfig';
import {EnhanceLoading} from '../../../components/Enhance';
import helper from '../../../common/common';
import {fetchDictionary} from '../../../common/dictionary';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';

const STATE_PATH = ['basic', 'systemConfig'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const {returnCode, result, returnMsg} = await helper.fetchJson('/api/basic/systemConfig/data');
  if (returnCode !== 0) {
    helper.showError(returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  const dic = await fetchDictionary(['system_settings']);
  if (dic.returnCode !== 0) {
    helper.showError(dic.returnMsg);
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  let sections = [];
  for (let item of dic.result.system_settings) {
    const section = {title: item.title};
    const dic2 = await fetchDictionary([item.value]);
    if (dic2.returnCode !== 0) {
      helper.showError(dic2.returnMsg);
      dispatch(action.assign({status: 'retry'}));
      return;
    }
    section.options = dic2.result[item.value].map(item2 => ({label:item2.title, value:item2.value}));
    sections.push(section);
  }
  const payload = {
    sections,
    value: result.system_settings || [],
    buttons: [{key: 'ok', title: '保存', bsStyle:'primary'}],
    status: 'page'
  };
  dispatch(action.create(payload));
};

const changeActionCreator = (arr = []) => {
  return action.assign({value: arr});
};

const okActionCreator = async (dispatch, getState) => {
  const {value} = getSelfState(getState());
  const {returnCode, returnMsg} = await helper.fetchJson('/api/basic/systemConfig/save', helper.postOption(value));
  if (returnCode !== 0) return helper.showError(returnMsg);
  helper.showSuccessMsg('保存成功');
};

const toolbarActions = {
  ok: okActionCreator
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onChange: changeActionCreator,
  onClick: clickActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(SystemConfig));
export default Container;
