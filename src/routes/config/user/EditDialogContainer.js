import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import helper, {fetchJson, postOption,showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {afterEditActionCreator} from './TreePageContainer';

const STATE_PATH = ['basic', 'user', 'edit'];
const action = new Action(STATE_PATH, false);
const SAVE_URL = '/api/basic/user';
const NAME_URL = '/api/basic/user/name';
const DEPARTMENT= '/api/basic/user/department';
const INSTITUTION='/api/basic/user/institution';


const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) =>(dispatch)=> {
  if(key==="institutionGuid"){
    dispatch(action.assign({[key]: value,departmentGuid:""}, 'value'));
    dispatch(action.update({options: []}, 'controls', {key: 'key', value:"departmentGuid"}));
  }else{
    dispatch(action.assign({[key]: value}, 'value'));
  };

};

const searchActionCreator = (key, value) => async (dispatch,getState) => {
let opts=[];
  switch(key) {
    case "institutionGuid":
    {
      const {returnCode,returnMsg,result} = await fetchJson(INSTITUTION, postOption({
        "filter": {
          "institutionName":value
        },
        "itemFrom": 0,
        "itemTo": 10
      }, 'post'));
     if(returnCode!==0){return showError(returnMsg)}
      result.data.map(x=>opts.push({value:x.guid,title:x.institutionName}));
      dispatch(action.update({options: opts}, 'controls', {key: 'key', value: key}));
    }
      break;
    case "departmentGuid":
    {
      const{value:val}= getSelfState(getState());
      if(!val.institutionGuid){return showError("请先填写归属机构！")}
      const {returnCode,returnMsg,result} = await fetchJson(DEPARTMENT, postOption({
        "filter": {
          "departmentName":value,
          "institutionGuid":val.institutionGuid.value
        },
        "itemFrom": 0,
        "itemTo": 10
      }, 'post'));
      if(returnCode!==0){return showError(returnMsg)}
      result.data.map(x=>opts.push({value:x.guid,title:x.departmentName}));
      dispatch(action.update({options: opts}, 'controls', {key: 'key', value: key}));
    }
      break;
    case "parentUserGuid":
    {
      const list = await fetchJson(NAME_URL, postOption({filter: value}, 'post'));
      if (list.returnCode === 0) {
        dispatch(action.update({options: list.result.data}, 'controls', {key: 'key', value: key}));
      }
    }
      break;
    default:
      return;
  }

};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const {edit, value, controls} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }

  const option = postOption(helper.convert(value), edit ? 'put': 'post');
  const {returnCode, returnMsg, result} = await fetchJson(SAVE_URL, option);
  if (returnCode === 0) {
    afterEditActionCreator(helper.getObjectExclude(result, ['updateDate']), edit)(dispatch, getState);
  } else {
    helper.showError(returnMsg);
  }
};

const cancelActionCreator = () => {
  return afterEditActionCreator();
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

const Container = connect(mapStateToProps, actionCreators)(EditDialog);
export default Container;
