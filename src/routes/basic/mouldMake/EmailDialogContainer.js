import { connect } from 'react-redux';
import EmailDialog from './EmailDialog';
import help,{postOption, fetchJson, showError, validValue} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {updateTable} from './OrderPageContainer';
import {toFormValue} from '../../../common/check';
import showPopup from '../../../standard-business/showPopup';
import UserAddDialog from './UserAddDialog';

const URL_NEW = '/api/platform/mouldMake/new';
const URL_UPDATE = '/api/platform/mouldMake/edit';
const URL_USERS = '/api/platform/mouldMake/user_list';
const URL_CONFIG = '/api/platform/mouldMake/user_add_config';

const PARENT_STATE_PATH = ['platform', 'mouldMake'];
const STATE_PATH = ['platform', 'mouldMake', 'emailDialog'];
const action = new Action(STATE_PATH);
const actionParent = new Action(PARENT_STATE_PATH);
const CLOSE_ACTION = action.assignParent({emailDialog: undefined});

const buildEmailState = (config, data, key, isEdit, editIndex) => {
  let newConfig = config;
  return {
    key,
    isEdit,
    editIndex,
    config: config.config,
    ...newConfig,
    controls: newConfig.emailControls,
    title: isEdit ? config.edit : config.add,
    value: data,
    size: 'middle'
  };
};

const createContainer = (statePath, afterEditActionCreator) => {
  const action = new Action(statePath);

  const getSelfState = (rootState) => {
    return getPathValue(rootState, statePath);
  };

const changeActionCreator = (key, value) => async (dispatch,getState) => {
  dispatch(action.assign({[key]: value}, 'value'));
};

const formSearchActionCreator = () => {

};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

//加载界面配置
const getConfig = async () => {
  const {returnCode, result} = await fetchJson(URL_CONFIG);
  if (returnCode !== 0) {
    showError('加载界面失败！');
    return;
  }
  return result;
};

//加载列表数据
const getList = async (url) => {
  const {returnCode, result} = await fetchJson(url, postOption({filter:''}));
  if (returnCode === 0) {
    return result;
  }
  return [];
};

const showUserAddDialog = async (onOkFunc, addKey, value) => {
  const dialogConfig = await getConfig();
  if (dialogConfig) {
    const props = {
      value,
      addKey,
      onOkFunc,
      ...dialogConfig,
      tableItems: await getList(URL_USERS)
    };
    return showPopup(UserAddDialog, props);
  }
};

const addActionCreator = (addKey) => async (dispatch, getState) => {
  const {value, controls} = getSelfState(getState());
  const onOkFunc = (resultList, addKey) => {
    if (!resultList) {
      dispatch(action.assign({loading: false}));
      return;
    }
    let arr = [];
    resultList.map((item) => {
      arr.push(item.userEmail)
    });

    if(addKey === 'recipient' && value.recipient){
      dispatch(action.assign({[addKey]: value.recipient.concat(arr)}, 'value'));
    }else if(addKey === 'recipientCcls' && value.recipientCcls){
      dispatch(action.assign({[addKey]: value.recipientCcls.concat(arr)}, 'value'));
    }else{
      dispatch(action.assign({[addKey]: arr}, 'value'));
    }

  };
  return showUserAddDialog(onOkFunc, addKey, value);
};

const okActionCreator = () => async (dispatch, getState) => {
  const {isEdit, editIndex, value, controls, key} = getSelfState(getState());
  if (!validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  const postData = {
    id: value.id? value.id: '',
    modelType: value.modelType? value.modelType: key,
    excelReportGroup: value.excelReportGroup,
    modelName: value.modelName,
    recipient: value.recipient,
    recipientCcls: value.recipientCcls? value.recipientCcls: [],
    subject: value.subject,
    content: value.content
  };
  let option, data;
  if(isEdit){
    data = await fetchJson(URL_UPDATE, postOption(toFormValue(postData), 'put'));
  }else{
    data = await fetchJson(URL_NEW, postOption(toFormValue(postData)));
  }
  if (data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  const result = data.result;
  afterEditActionCreator(result)(dispatch, getState);
};

const cancelActionCreator = () => (dispatch, getState) => {
  afterEditActionCreator()(dispatch, getState);
};

const actionCreators = {
  onAdd:addActionCreator,
  onChange: changeActionCreator,
  onSearch: formSearchActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  return connect(mapStateToProps, actionCreators)(EmailDialog);
};


const afterEditActionCreator = (result) => (dispatch, getState) => {
  dispatch(CLOSE_ACTION);
  result && updateTable(dispatch, getState);
};

const Container = createContainer(STATE_PATH, afterEditActionCreator);
export default Container;
export {buildEmailState, createContainer};
