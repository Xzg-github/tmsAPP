import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog3';
import helper, { postOption, fetchJson, showError, showSuccessMsg, deepCopy } from '../../../common/common';
import { Action } from '../../../action-reducer/action';
import { getPathValue } from '../../../action-reducer/helper';
import { afterEditActionCreator } from './OrderPageContainer';

const URL_SAVE = '/api/config/customersArchives/';
const URL_SALEMEN = '/api/config/customersArchives/salemen';
const URL_CURRENCY = '/api/config/customersArchives/currency';
const URL_DISTRICT = '/api/config/customersArchives/district_options';

const STATE_PATH = ['config', 'customersArchives', 'edit'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (keyName, keyValue) => async (dispatch, getState) => {
  const {value, controls} = getSelfState(getState());
  if(keyValue === value[keyName]) return dispatch(action.assign({[keyName]: keyValue}, 'value'));
  let data, options, body;
  const dealDistrictFunc = async (district, payload) => {
    options = undefined;
    if(keyValue && keyValue.value && keyValue.value !== '') {
      body = {maxNumber: 300, parentDistrictGuid:keyValue.value};
      data = await fetchJson(URL_DISTRICT, postOption(body));
      if (data.returnCode !== 0) return showError(data.returnMsg);
      options = data.result;
    }
    const cols = deepCopy(controls);
    helper.setOptions(district, cols[0].data, options);
    dispatch(action.assign({controls: cols}));
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
      const payload = {[keyName]: keyValue, district:undefined, street:undefined};
      return await dealDistrictFunc('district', payload);
    }
    case 'district': {
      const payload = {[keyName]: keyValue, street:undefined};
      return await dealDistrictFunc('street', payload);
    }
    default:
      dispatch(action.assign({[keyName]: keyValue}, 'value'));
  }
};

const searchActionCreator = (key, value) => async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  let data, options;
  switch (key) {
    case 'salesPersonId': {
      const option = helper.postOption({maxNumber: 20, filter: value});
       data = await fetchJson(URL_SALEMEN, option);
       options = data.result.data;
       break;
    }
    case 'balanceCurrency': {
      const option = helper.postOption({maxNumber: 20, filter: value});
       data = await fetchJson(URL_CURRENCY, option);
       options = data.result;
       break;
    }
    default: return;
  }
  if(data.returnCode !== 0) return showError(data.returnMsg);
  const cols = deepCopy(controls);
  helper.setOptions(key, cols[1].data, options);
  dispatch(action.assign({controls: cols}));
};

const exitValidActionCreator = () => action.assign({valid: false})

const okActionCreator = () => async (dispatch, getState) => {
  const {edit, value, controls} = getSelfState(getState());
  const item = controls.find(item => !helper.validValue(item.data, value));
  if (item) {
    return dispatch(action.assign({valid: item.key}));
  };
  const url = `${URL_SAVE}${edit ? 'edit' : 'add'}`;
  const arr = ['true_false_type_false', 'true_false_type_true'];
  if (typeof value.isContract !== 'number') {
    const isCon = arr.findIndex(o => o === value.isContract);
    value.isContract = isCon < 0 ? null : isCon;
  }
  const {returnCode, returnMsg, result} = await fetchJson(url, postOption(helper.convert(value)));
  if (returnCode !== 0) return showError(returnMsg);
  showSuccessMsg(returnMsg);
  afterEditActionCreator(true, dispatch, getState);
};

const cancelActionCreator = () => (dispatch, getState) => {
  afterEditActionCreator(false, dispatch, getState)
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onSearch: searchActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

const EditDialogContainer = connect(mapStateToProps, actionCreators)(EditDialog);
export default EditDialogContainer;
export {changeActionCreator};
