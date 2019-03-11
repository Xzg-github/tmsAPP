import {connect} from 'react-redux';
import EditPage from './EditPage';
import {Action} from '../../../../action-reducer/action';
import {EnhanceLoading} from '../../../../components/Enhance';
import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';

const PARENT_PATH = ['supplierPrice'];
const STATE_PATH = ['supplierPrice', 'edit'];

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, PARENT_PATH);
  return parent[parent.activeKey];
};

const onTabChangeActionCreator = (key) => action.assign({activeKey: key});

const initActionCreator = () => async (dispatch, getState) => {
  try {
    // 这里可以放三个页签公共的数据处理
    dispatch(action.assign({status: 'page'}));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onTabChange: onTabChangeActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage));
export default Container;
