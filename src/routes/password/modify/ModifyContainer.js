import {connect} from 'react-redux';
import PasswordDialog from './PasswordDialog';
import {Action} from '../../../action-reducer/action';
import showPopup from '../../../standard-business/showPopup';
import helper from '../../../common/common';
import execWithLoading from '../../../standard-business/execWithLoading';

const action = new Action(['temp'], false);
const URL_MODIFY = '/api/password/modify';


const buildState = () => {
  const controls = [
    {key:'old',title:'请输入旧密码',type:'password',required:true,span:2},
    {key:'new',title:'请输入新密码',type:'password',required:true,span:2},
    {key:'confirm',title:'请确认新密码',type:'password',required:true,span:2},
  ];
  return {
    controls,
    title: '修改密码',
    visible: true,
    value:{}
  };
};


const getSelfState = (state) => {
  return state.temp || {};
};


const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false}));
};

const okActionCreator = () => async(dispatch,getState) => {
  const {controls,value} = getSelfState(getState());
  if (helper.validValue(controls, value)) {
    if (value.new !== value.confirm) {
      helper.showError('输入的新密码不一致');
      return;
    }
    execWithLoading(async () => {
      const option = helper.postOption({newPassword: value.new, oldPassword: value.old}, 'put');

      const {returnCode, returnMsg} = await helper.fetchJson(URL_MODIFY, option);
      if (returnCode === 0) {
        helper.showSuccessMsg('密码修改成功');
        dispatch(action.assign({visible: false}));
      } else if (returnCode === 40002) {
        helper.showError('原密码错误');
      } else {
        helper.showError(returnMsg);
      }
    });


  }else {
    dispatch(action.assign({valid: true}))
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



const changeActionCreator = (key, keyValue) => (dispatch,getState) => {
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
  onChange:changeActionCreator,
  onExitValid:exitValidActionCreator
};


export default async() => {
  const Container = connect(mapStateToProps, actionCreators)(PasswordDialog);
  global.store.dispatch(action.create(buildState()));
  await showPopup(Container,{}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
}
