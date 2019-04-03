import {connect} from 'react-redux';
import BrandDialog from './BrandDialog';
import {Action} from '../../../action-reducer/action';
import showPopup from '../../../standard-business/showPopup';
import helper from '../../../common/common';
import {getDictionaryNames, fetchDictionary, setDictionary2} from '../../../common/dictionary';

const action = new Action(['brand'], false);
const URL_ADD = '/api/config/inside_car/addDic';

const getSelfState = (state) => {
  return state.brand || {};
};

const buildState = (config) => {
  return {
    ...config,
    title: '司机归属区域',
    visible: true,
    value: {parentDictionaryCode:{value:'car_area',title:'车辆归属区域'}},
    tableItems:[]
  };
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const okActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  if (helper.validValue(state.controls, state.value)) {
    const body = {
      ...state.value,
      dictionaryLanguage: state.tableItems
    };
    const json = await helper.fetchJson(URL_ADD, helper.postOption(helper.convert(body), 'post'));
    if (json.returnCode) {
      helper.showError(json.returnMsg);
    } else {
      helper.showSuccessMsg(json.returnMsg);
      dispatch(action.assign({visible: false, ok: true}));
    }
  } else {
    dispatch(action.assign({valid: true}));
  }
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, ok: false}));
};

const addAction = (dispatch, getState) => {
  dispatch(action.add({}, 'tableItems', 0))
};

const delAction = (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const newItems = tableItems.filter(items => !items.checked);
  dispatch(action.assign({tableItems:newItems}));
};



const clickActionCreators = {
  add: addAction,
  del: delAction
};

const clickActionCreator = (key) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key];
  } else {
    return {type: 'unknown'};
  }
};

const contentChangeActionCreator = (rowIndex, keyName, value) => (dispatch, getState) => {
  dispatch(action.update({[keyName]: value}, 'tableItems', rowIndex));
};


const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onClick: clickActionCreator,
  onExitValid: exitValidActionCreator,
  onContentChange: contentChangeActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

const URL_CONFIG = '/api/basic/sysDictionary/config';
export default async () => {
  try {
    const config = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    //字典
    const names = getDictionaryNames(config.edit.tableCols);
    const dictionary = helper.getJsonResult(await fetchDictionary(names));
    setDictionary2(dictionary, config.edit.tableCols);

    const Container = connect(mapStateToProps, actionCreators)(BrandDialog);
    global.store.dispatch(action.create(buildState(config.edit)));
    await showPopup(Container, {}, true);

    const state = getSelfState(global.store.getState());
    global.store.dispatch(action.create({}));
    return state.ok;
  }catch (e){
    helper.showError(e.message)
  }

};

