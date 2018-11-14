import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import helper, {postOption, fetchJson,showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import EditDialogContainer from './EditDialogContainer';

const STATE_PATH = ['platform', 'urlResourceLib','edit','edit'];
const PARENT_STATE_PATH = ['platform', 'urlResourceLib','edit'];
const URL_SAVE_SERVICE = '/api/platform/urlResourceLib/addService';
const URL_SAVE_CONTROLLER = '/api/platform/urlResourceLib/saveController';
const URL_CONTROLLER_RESOURCE_OPTIONS = '/api/platform/urlResourceLib/controller_resource_options';

const createContainer = (statePath, afterEditActionCreator) => {
  const action = new Action(statePath, false);

  const getSelfState = (rootState) => {
    return getPathValue(rootState, statePath);
  };

  const changeActionCreator = (key, value) => {
    return action.assign({[key]: value}, 'value');
  };

  const exitValidActionCreator = () => {
    return action.assign({valid: false});
  };

  const getParentState = (rootState) => {
    return getPathValue(rootState, PARENT_STATE_PATH);
  };

  const okActionCreator = () => async (dispatch, getState) => {
    const {edit, editIndex, value, controls,EditControl,valueParent} = getSelfState(getState());
    if (!helper.validValue(controls, value)) {
      dispatch(action.assign({valid: true}));
      return;
    }
    let data,res,options,dataOption,id;
    //edit=true 控制层新增
    if(edit){
      options = []
      const postData = {
        controllerExplain: value.controllerExplain,
        controllerName: value.controllerName,
        controllerPath: value.controllerPath,
        controllerUrl: value.controllerUrl,
        serviceId:valueParent.supplierGuid.service_id ?
          valueParent.supplierGuid.service_id :valueParent.supplierGuid.service_serviceName.value

      };
      data = await fetchJson(URL_SAVE_CONTROLLER, postOption(postData));
    }else{
      const postData = {
        serviceName: value.serviceName,
        serviceExplain: value.serviceExplain
      };
      data = await fetchJson(URL_SAVE_SERVICE, postOption(postData));
    }
    if (data.returnCode !== 0) {
      showError(data.returnMsg);
      return;
    }
    afterEditActionCreator(data, edit)(dispatch, getState);
  };

  const cancelActionCreator = () => {
    return afterEditActionCreator();
  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const actionCreators = {
    onChange: changeActionCreator,
    onExitValid: exitValidActionCreator,
    onOk: okActionCreator,
    onCancel: cancelActionCreator
  };

  return connect(mapStateToProps, actionCreators)(EditDialog);
};

const AddEditDialogContainer = createContainer(STATE_PATH, EditDialogContainer);
export default AddEditDialogContainer;
export {createContainer};
