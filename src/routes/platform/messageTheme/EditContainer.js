import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import helper from '../../../common/common';
import execWithLoading from '../../../standard-business/execWithLoading';


const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);
const URL_BATCH_EDIT = '/api/platform/messageTheme/add';


const buildEditState = (config, data, edit,dispatch) => {

  config.controls.forEach(item => {
    item.key === 'id' && (item.type = edit ? 'readonly'  : 'text')
  });

  const payload  = {
    edit,
    config: config.config,
    controls: config.controls,
    title: edit ? config.edit : config.add,
    value: data,
    size: 'middle',
    inset:false
  };
  dispatch(action.create(payload));
  return true;
};


const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};


const changeActionCreator = (key, value) => (dispatch, getState) => {
  dispatch(action.assign({[key]: value}, 'value'));

};


const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

/**
 * 功能：判断一个值是否为空(null,undefined,''和[]属于空)
 */
const isEmpty2 = (value,obj,key) => {
  const type = typeof value;
  if (type === 'number' || type === 'boolean' ) {
    return false;
  } else if (Array.isArray(value)) {
    return !value.length;
  }else if(type === 'undefined'){
    return true
  }else {
    if(value.replace(/(^\s*)|(\s*$)/g, "").length  === 0){
      obj[key] = '';
      value = false
    }
    return !value;
  }
};

/**
 * 功能：依据fields来验证value中指定属性(key)是否为空
 *  fields：[必须]，对象数组，每个对象用于描述value中的相应的属性是否为必填项(不能为空)
 *   对象中必须有key属性，以及可选的required属性，required为true表明指示的key为必填项
 *  value：[必须]，对象(key-value对)
 * 返回值：通过校验返回true，未通过返回false
 */
const validValue = (fields, value) => {
  return fields.every(({key, required}) => {
    return !required || !isEmpty2(value[key],value,key);
  });
};



const okActionCreator = (props) => (dispatch, getState) => {
  execWithLoading(async () => {
    if (validValue(props.controls, props.value)) {
      if(props.value.isLifecycle && props.value.isLifecycle == 1 ){
        if(!props.value.isTaskUnitType ||  props.value.isTaskUnitType ==0){
          helper.showError('生命周期与作业单元联动,作业单元必填');
          return
        }
      }
      const json = await helper.fetchJson(URL_BATCH_EDIT, helper.postOption(props.value,props.edit ? 'put' : 'post'));
      if (!json.returnCode) {
        helper.showSuccessMsg('操作成功');
        props.refreshTable(dispatch, getState);
        props.onClose();
      } else {
        helper.showError(json.returnMsg);
      }
    } else {
      dispatch(action.assign({valid: true}));
    }
  });
};

const cancelActionCreator = (props) => (dispatch, getState) => {
  props.onClose();
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
};

export default connect(mapStateToProps, actionCreators)(EditDialog);
export {buildEditState}
