import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import helper, {postOption, fetchJson,showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {afterEditActionCreator} from './OrderPageContainer';

const STATE_PATH = ['basic', 'institution', 'edit'];
const action = new Action(STATE_PATH, false);
const SAVE_URL = '/api/basic/institution';
const LEGAL_PERSON_URL = '/api/basic/institution/legal_person';
const URL_USER = '/api/basic/user/name';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildEditState = (config, data, edit) => {
  if(data.isLegalPerson&&data.isLegalPerson==="true_false_type_false"){
    config.controls.map(x=>{if(x.key==='parentInstitutionId'){
      x.required=true;
    }})
  }else{
    config.controls.map(x=>{if(x.key==='parentInstitutionId'){
      x.required=false;
    }})
  }

  return {
    edit,
    config: config.config,
    controls: config.controls,
    title: edit ? config.edit : config.add,
    value: data
  };
};

const changeActionCreator = (key, value) =>(dispatch,getState)=> {
   if(key==="isLegalPerson"&&value==="true_false_type_false"){
     dispatch(action.update({required:true},"controls",{key:"key",value:"parentInstitutionId"}))
   }else if(key==="isLegalPerson"&&value!=="true_false_type_false"){
     dispatch(action.update({required:false},"controls",{key:"key",value:"parentInstitutionId"}))
   }
  dispatch(action.assign({[key]: value}, 'value'));
};

const searchActionCreator = (key, value) => async (dispatch,getState) => {
  let data;
  switch (key){
    case "institutionOwner":
    {
    data = await fetchJson(URL_USER, postOption({filter: value}));

    }
      break;
    case "parentInstitutionId":
    {
      data= await fetchJson(LEGAL_PERSON_URL,postOption({institutionName: value}))
    }
      break;
    default:
      return;
  }
     if(data.returnCode !== 0){return showError(data.returnMsg)};
   const val=data.result instanceof Array ?data.result:data.result.data;
    dispatch(action.assign({[key]: val}, 'options'));
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
    afterEditActionCreator(result, edit)(dispatch, getState);
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

const EditDialogContainer = connect(mapStateToProps, actionCreators)(EditDialog);

export default EditDialogContainer;
export {buildEditState};
