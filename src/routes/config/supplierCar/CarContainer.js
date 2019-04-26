import {connect} from 'react-redux';
import CarDialog from './CarDialog';
import {Action} from '../../../action-reducer/action';
import showPopup from '../../../standard-business/showPopup';
import helper, {showError} from '../../../common/common';
import {getPathValue} from '../../../action-reducer/helper';
import showAddDialog from '../supplierDriver/addDialog/AddDialogContainer';
import {fetchDictionary, setDictionary2} from '../../../common/dictionary';

const action = new Action(['temp3']);
const URL_UPDATE = '/api/config/supplier_car/updateList';
const URL_CONFIG = '/api/config/supplierDriver/config';
const DRIVER = '/api/config/supplier_car/search/driver'; //司机下拉

const buildState = (config, title,value={},isSupplier) => {
  value.isOwner = isSupplier ? 0 : 1;//如果为供应商车辆时，固定值为0,综合为1
  return {
    ...config,
    title: title,
    visible: true,
    value
  };
};


const getSelfState = (state) => {
  return getPathValue(state, ['temp3']);
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
      dispatch(action.assign({visible: false, ok: json.result}));
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
  let json,id;
  if(key === 'driverId' ){//司机标识跟所属供应商联动
    if(!value.supplierId)
      return showError('请先选择供应商');

    id =  value.supplierId.value;
    const body = {
      supplierId:id,
      name:keyValue
    };
    json = await helper.fetchJson(keyControls.searchUrl,helper.postOption(body))
  }else {
    json = await helper.fuzzySearchEx(keyValue,keyControls);
  }

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
    dispatch(action.update({options:[]}, 'controls', 4));
  }
  dispatch(action.assign({[key]: keyValue}, 'value'));
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const onAddActionCreator = (key) => async(dispatch,getState) => {
  const {edit}  = await helper.fetchJson(URL_CONFIG);
  const {value} = getSelfState(getState());
  if(key === 'driverId'){
    let obj = {};
    if(value.supplierId){
      obj.supplierId = value.supplierId
    }
    const info = await showAddDialog(obj, edit);
    if (info) {
      dispatch(action.assign({driverId: {value: info.id, title: info.driverName}}, 'value'));
    }
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onClick: clickActionCreator,
  onSearch:searchActionCreator,
  onChange:changeActionCreator,
  onExitValid:exitValidActionCreator,
  onAdd:onAddActionCreator
};

const URL_CONFIG_CAR = '/api/config/supplier_car/config';
export default async(value = {},title='新增',isSupplier = true) => {
  const {edit,dictionary} = helper.getJsonResult(await helper.fetchJson(URL_CONFIG_CAR));
  const dictionaryOptions = helper.getJsonResult(await fetchDictionary(dictionary));
  setDictionary2(dictionaryOptions,edit.controls );
  const Container = connect(mapStateToProps, actionCreators)(CarDialog);
  global.store.dispatch(action.create(buildState(edit, title,value,isSupplier)));
  await showPopup(Container,{}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
}
