import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import showPopup from '../../../standard-business/showPopup';
import helper, {fetchJson} from "../../../common/common";

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const URL_SAVE = '/api/config/supplier_tax/ownerTax';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, keyValue) => (dispatch, getState) => {
  if (key === 'taxRate') {
    return keyValue >= 100 ?
      helper.showError('税率必须小于100') :
      dispatch(action.assign({[key]: keyValue}, 'value'));
  } else if (key === 'taxRateWay') {
    const {controls, value} = getSelfState(getState());
    //如果是不计税(字典值: tax_rate_way_not_calculate) 税率为0且不可编辑
    if (keyValue === 'tax_rate_way_not_calculate') {
      const newControls = controls.map(item => {
        if (item.key === 'taxRate') item.type = 'readonly';
        return item;
      });
      dispatch(action.assign(({controls: newControls, initialValue: value.taxRate})));
      dispatch(action.assign({[key]: keyValue, taxRate: '0'}, 'value'));
    } else {
      const state = getSelfState(getState());
      const newControls = controls.map(item => {
        if (item.key === 'taxRate' && item.type === 'readonly') item.type = 'number';
        return item;
      });
      dispatch(action.assign(({controls: newControls})));
      dispatch(action.assign({[key]: keyValue, taxRate: state.initialValue || value.taxRate}, 'value'));

    }
  }
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const {value, controls} = getSelfState(getState());
  if (!helper.validValue(controls, value)){
    return dispatch(action.assign({valid: true}));
  }
  const {returnCode, returnMsg} = await fetchJson(URL_SAVE, helper.postOption(value));
  return returnCode === 0 ?
    dispatch(action.assign({visible: false, res: true})) :
    helper.showError(returnMsg);
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, res: false}));
};

const actionCreators = {
  onChange: changeActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

export default (config) => {
  const props = {...config, container: true};
  global.store.dispatch(action.create(props));
  const Container = connect(mapStateToProps, actionCreators)(EditDialog);
  return showPopup(Container, {},true );
};
