import { connect } from 'react-redux';
import EditDialog2 from '../../../components/EditDialog2';
import helper, {postOption, fetchJson, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import Fence from '../../../standard-business/showElectricFence';
import {updateTable} from  "./OrderPageContainer";

const fence = new Fence();
const URL_SAVE = '/api/config/customer_factory/add';
const URL_CUSTOMER = '/api/config/customer_factory/customer';
const URL_DISTRICT_OPTIONS = '/api/config/customer_factory/district_options';
const URL_CHARGE_PLACE_OPTIONS = '/api/config/customer_factory/charge_place_options';

const changeRequire=(array,controls,keyValue)=>{
  array.map(x=>{
    controls.map(y=> {
      if (y.key === x) {
        if (keyValue === 1) {
          y.required = false;
        } else {
          y.required = true;
        }
      }
    })
  })
};

const buildEditState = (config, data, edit, onOkExFunc = undefined) => {
  const x=['country','province','city','chargingPlaceGuid'];
  if(!edit){
    data.factoryType=0;
    changeRequire(x,config.controls,data.factoryType);
  }else{
    changeRequire(x,config.controls,data.factoryType);
  }
  const {customerFactoryContactList=[], ...baseInfo} = data;
  if (baseInfo.forbidCarType) {
    baseInfo.forbidCarType = baseInfo.forbidCarType.split(',');
  }
  return {
    edit,
    options: config.options,
    config: config.config,
    controls: config.controls,
    tableCols: config.tableCols,
    buttons: config.buttons,
    title: edit ? config.edit : config.add,
    value: baseInfo || {},
    tableItems: customerFactoryContactList,
    size: 'large',
    onOkExFunc
  };
};

const createContainer = (statePath, afterEditActionCreator) => {
  const action = new Action(statePath);

  const getSelfState = (rootState) => {
    return getPathValue(rootState, statePath);
  };

  const changeActionCreator = (keyName, keyValue) => async (dispatch, getState) => {
    const {value} = getSelfState(getState());
    if(keyValue === value[keyName]) {
      dispatch(action.assign({[keyName]: keyValue}, 'value'));
      return;
    }
    let data, options, body;
    const dealDistrictFunc = async (district, payload) => {
      options = undefined;
      if(keyValue && keyValue.value && keyValue.value !== '') {
        body = {maxNumber: 300, parentDistrictGuid:keyValue.value};
        data = await fetchJson(URL_DISTRICT_OPTIONS, postOption(body));
        if (data.returnCode !== 0) {
          showError(data.returnMsg);
          return;
        }
        options = data.result;
      }
      dispatch(action.update({options}, 'controls', {key:'key', value:district}));
      dispatch(action.assign(payload, 'value'));
    };
    switch (keyName) {
      case 'country': {
        const payload = {[keyName]: keyValue, province:undefined, city:undefined, district:undefined, street:undefined};
        return await dealDistrictFunc('province', payload);
      }
      case 'province': {
        const payload = {[keyName]: keyValue, city:undefined, district:undefined, street:undefined};
        return await dealDistrictFunc('city', payload);
      }
      case 'city': {
        const payload = {[keyName]: keyValue, district:undefined, street:undefined, chargingPlaceId: keyValue};
        return await dealDistrictFunc('district', payload);
      }
      case 'district': {
        const payload = {[keyName]: keyValue, street:undefined};
        return await dealDistrictFunc('street', payload);
      }
      case 'address':
        dispatch(action.assign(fence.getEmptyData(keyValue), 'value'));
        break;
      default:
        dispatch(action.assign({[keyName]: keyValue}, 'value'));
    }
  };

  const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
    const {controls, value} = getSelfState(getState());
    let data, options, body;
    switch (key) {
      case 'customerId': {
        body = {maxNumber: 10, customerName: title};
        data = await fetchJson(URL_CUSTOMER, postOption(body));
        break;
      }
      case 'chargingPlaceId': {
        body = {maxNumber: 10, placeName: title};
        data = await fetchJson(URL_CHARGE_PLACE_OPTIONS, postOption(body));
        break;
      }
      case 'province' : {
        body = {maxNumber: 300, parentDistrictGuid: value['country'].value};
        data = await fetchJson(URL_DISTRICT_OPTIONS, postOption(body));
        break;
      }
      case 'city': {
        body = {maxNumber: 300, parentDistrictGuid: value['province'].value};
        data = await fetchJson(URL_DISTRICT_OPTIONS, postOption(body));
        break;
      }
      case 'district': {
        body = {maxNumber: 300, parentDistrictGuid: value['city'].value};
        data = await fetchJson(URL_DISTRICT_OPTIONS, postOption(body));
        break;
      }
      case 'street': {
        body = {maxNumber: 300, parentDistrictGuid: value['district'].value};
        data = await fetchJson(URL_DISTRICT_OPTIONS, postOption(body));
        break;
      }
      default:
        return;
    }
    if (data.returnCode !== 0) {
      showError(data.returnMsg);
      return;
    }
    options = data.result;
    const index = controls.findIndex(item => item.key === key);
    dispatch(action.update({options}, 'controls', index));
  };

  const exitValidActionCreator = () => {
    return action.assign({valid: false});
  };

  const okActionCreator = () => async (dispatch, getState) => {
    const { value, controls, tableItems=[], tableCols=[], onOkExFunc} = getSelfState(getState());
    if (!helper.validValue(controls, value)) {
      dispatch(action.assign({valid: true}));
      return;
    }
    if (!helper.validArray(tableCols, tableItems)) {
      dispatch(action.assign({tableValid: true}));
      return;
    }
    const body = helper.convert(value);
    body.customerFactoryContactList = tableItems;
    Array.isArray(body.forbidCarType) && (body.forbidCarType = body.forbidCarType.join(','));
    const option = postOption(body);
    const {returnCode, result, returnMsg} = await fetchJson(URL_SAVE, option);
    if (returnCode !== 0) {
      showError(returnMsg);
      return;
    }
    afterEditActionCreator(result)(dispatch, getState);
    onOkExFunc && onOkExFunc(result);
  };

  const cancelActionCreator = () => (dispatch, getState) => {
    afterEditActionCreator()(dispatch, getState);
  };

  const fenceActionCreator = () => async (dispatch, getState) => {
    const {value} = getSelfState(getState());
    if (!value.address) {
      showError('定义围栏前需要先输入详细地址');
    } else {
      const {country, province, city, district, street, address} = value;
      const addressEx = `${country ? country.title : ''}${province ? province.title : ''}${city ? city.title : ''}${district ? district.title : ''}${street ? street.title : ''}${address}`;
      const result = await fence.showEx(value, addressEx);
      if (result) {
        dispatch(action.assign(result, 'value'));
      }
    }
  };

  const contentChangeActionCreator = (rowIndex, keyName, value) => (dispatch) => {
    dispatch(action.update({[keyName]: value}, 'tableItems', rowIndex));
  };

  const tableExitValidActionCreator = () => {
    return action.assign({tableValid: false});
  };

  const addActionCreator = (dispatch) => {
    dispatch(action.add({}, 'tableItems'));
  };

  const delActionCreator = (dispatch, getState) => {
    const {tableItems=[]} = getSelfState(getState());
    const newItems = tableItems.filter(item => item.checked !== true);
    dispatch(action.assign({tableItems: newItems}));
  };

  const buttons = {
    add: addActionCreator,
    del: delActionCreator
  };

  const clickActionCreator = (key) => {
    if (buttons.hasOwnProperty(key)) {
      return buttons[key];
    } else {
      console.log('unknown key:', key);
      return {type: 'unknown'};
    }
  };

  const actionCreators = {
    onChange: changeActionCreator,
    onSearch: formSearchActionCreator,
    onExitValid: exitValidActionCreator,
    onContentChange: contentChangeActionCreator,
    onTableExitValid: tableExitValidActionCreator,
    onClick: clickActionCreator,
    onOk: okActionCreator,
    onCancel: cancelActionCreator,
    onFence: fenceActionCreator
  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  return connect(mapStateToProps, actionCreators)(EditDialog2);
};

const STATE_PATH = ['config', 'customerFactory', 'edit'];
const action = new Action(STATE_PATH);
const CLOSE_ACTION = action.assignParent({edit: undefined});

const afterEditActionCreator = (result) => (dispatch, getState) => {
  dispatch(CLOSE_ACTION);
  result && updateTable(dispatch, getState);
};

const Container = createContainer(STATE_PATH, afterEditActionCreator);
export default Container;
export {buildEditState, createContainer};
