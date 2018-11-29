import {connect} from 'react-redux';
import CarDialog from './CarDialog';
import {Action} from '../../../action-reducer/action';
import showPopup from '../../../standard-business/showPopup';
import helper, {showError} from '../../../common/common';

const action = new Action(['temp'], false);
const URL_UPDATE = '/api/config/supplier_car/updateList';

const buildState = (config, title,value={},isSupplier) => {
  value.isOwner = isSupplier ? 0 : 1;//如果为供应商车辆时，固定值为0,综合为1
  !isSupplier && (value.supplierId = -1);//如果为综合时，固定值为-1
  return {
    ...config,
    title: title,
    visible: true,
    value
  };
};


const getSelfState = (state) => {
  return state.temp || {};
};


const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, ok: false}));
};

const okActionCreator = () => async(dispatch,getState) => {
  const state = getSelfState(getState());
  if (helper.validValue(state.controls, state.value)) {
    let body,sendMethod;
    body = helper.convert(state.value);

    const json = await helper.fetchJson(URL_UPDATE, helper.postOption(body,'post'));
    if (json.returnCode) {
      helper.showError(json.returnMsg);
    } else {
      dispatch(action.assign({visible: false, ok: true}));
    }
  } else {
    dispatch(action.assign({valid: true}));
  }
};



const clickActionCreators = {
  close: closeActionCreator,
  ok:okActionCreator
};

const clickActionCreator = (key) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key]();
  } else {
    return {type: 'unknown'};
  }
};

const searchActionCreator = (key,keyValue,keyControls) => async(dispatch,getState) => {
  const {controls,value} = getSelfState(getState());
  if(key === 'driverId' ){//司机标识跟所属供应商联动
    if(!value.supplierId)
      return showError('请先选择供应商');

    keyValue = typeof (value.supplierId) === 'number' ? value.supplierId : value.supplierId.value;
  }
  const json = await helper.fuzzySearchEx(keyValue,keyControls);
  if (!json.returnCode) {
    const index = controls.findIndex(item => item.key == key);
    dispatch(action.update({options:json.result}, 'controls', index));
  }else {
    helper.showError(json.returnMsg)
  }

};

const changeActionCreator = (key, keyValue) => (dispatch,getState) => {
  const {value} = getSelfState(getState());
  if(key === 'supplierId'){
    dispatch(action.assign({['driverId']: ''}, 'value'));
  }
  dispatch(action.assign({[key]: keyValue}, 'value'));
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};


const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onClick: clickActionCreator,
  onSearch:searchActionCreator,
  onChange:changeActionCreator,
  onExitValid:exitValidActionCreator
};


export default async(config,value = {},title='新增',isSupplier = true) => {
  const Container = connect(mapStateToProps, actionCreators)(CarDialog);
  global.store.dispatch(action.create(buildState(config, title,value,isSupplier)));
  await showPopup(Container,{}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
}
