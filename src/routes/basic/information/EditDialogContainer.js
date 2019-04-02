import { connect } from 'react-redux';
import EditDialog from './EditDialog';
import helper from '../../../common/common';
import {fetchAllDictionary, setDictionary2, fetchDictionary} from '../../../common/dictionary';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import showPopup from '../../../standard-business/showPopup';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) => async (dispatch, getState) => {
  let obj = {[key]: value};
  if (key === 'customerInformationFeedback') {
    obj.subscribeNode = [];
    if (value) {
      const {informationDic} = getSelfState(getState());
      const curentDic = informationDic.filter(item => item.dictionaryCode === value);
      if (curentDic.length !== 1) return;
      const {attribute1, attribute2} = curentDic[0];
      if (attribute1) {
        const dics = helper.getJsonResult(await fetchDictionary([attribute1]));
        let options = dics[attribute1];
        if (attribute2) {
          const delArr = attribute2.split(',');
          options = options.filter(item => !delArr.includes(item.value));
        }
        dispatch(action.update({options, required: true}, 'controls', {key: 'key', value: 'subscribeNode'}));
      }else {
        dispatch(action.update({options: [], required: false}, 'controls', {key: 'key', value: 'subscribeNode'}));
      }
      const hideControls = attribute1 ? [] : ['subscribeNode'];
      dispatch(action.assign({hideControls}));
    }else {
      dispatch(action.assign({hideControls: ['subscribeNode']}));
    }
  }
  dispatch(action.assign(obj, 'value'));
};

const searchActionCreator = (key, filter, config) => async (dispatch, getState) => {
  const {returnCode, result} = await helper.fuzzySearchEx(filter, config);
  dispatch(action.update({options: returnCode === 0 ? result : undefined}, 'controls', {key: 'key', value: key}));
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const getNodeName = (controls, subscribeNode) => {
  if (subscribeNode) {
    let subscribeNodeName = [];
    const {options=[]} = controls.filter(item => item.key === 'subscribeNode')[0];
    subscribeNode.map(code => {
      const {title} = options.filter(item => item.value === code)[0];
      subscribeNodeName.push(title);
    });
    return subscribeNodeName.join(`,`);
  }else {
    return undefined;
  }
};

const okActionCreator = () => async (dispatch, getState) => {
  const {value, controls, isEdit} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  //校验手机号
  if (value.mobile) {
    let errMobile = value.mobile.filter(item => !(/^1[34578]\d{9}$/.test(item)));
    if (errMobile.length) {
      return helper.showError(`手机号不正确:[${errMobile.join(',')}]`);
    }
  }
  //校验邮箱
  if (value.mail) {
    let errMail = value.mail.filter(item => !(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(item)));
    if (errMail.length) {
      return helper.showError(`邮箱不正确:[${errMail.join(',')}]`);
    }
  }
  dispatch(action.assign({confirmLoading: true}));
  const URL_OK = '/api/basic/information';
  const body = {
    ...helper.convert(value),
    subscribeNode: value.subscribeNode ? value.subscribeNode.join(',') : '',
    subscribeNodeName: getNodeName(controls, value.subscribeNode),
    mail: value.mail ? value.mail.join(',') : '',
    mobile: value.mobile ? value.mobile.join(',') : ''
  };
  const {returnCode, returnMsg} = await helper.fetchJson(URL_OK, helper.postOption(body, isEdit ? 'put' : 'post'));
  if (returnCode !== 0) {
    helper.showError(returnMsg);
    dispatch(action.assign({confirmLoading: false}));
    return;
  }
  helper.showSuccessMsg('操作成功');
  dispatch(action.assign({confirmLoading: false, visible: false, res: true}));
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false}));
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

const buildDialogState = async (data, isEdit) => {
  try {
    let controls = [
      {key: 'customerId', title: '客户', type: isEdit === false ? 'search': 'readonly', searchType: 'customer', required: true},
      {key: 'isInterface', title: '接口推送', type: 'select', dictionary: 'zero_one_type', required: true},
      {key: 'customerInformationFeedback', title: '反馈类型', type: isEdit === false ? 'select': 'readonly', dictionary: 'customer_information_feedback', required: true},
      {key: 'subscribeNode', title: '订阅任务', type: 'select', props: {mode: 'multiple'}, span: 3},
      {key: 'mail', title: '邮件接收', type: 'select', props: {mode: 'tags'}, span: 3},
      {key: 'mobile', title: '短信接收', type: 'select', props: {mode: 'tags'}, span: 3},
    ];
    const dic = helper.getJsonResult(await fetchAllDictionary());
    setDictionary2(dic, controls);
    const dicUrl = `/api/basic/sysDictionary/list`;
    const {data:informationDic = []} = helper.getJsonResult(await helper.fetchJson(dicUrl, helper.postOption({dictionaryCode: 'customer_information_feedback'})));
    let hideControls = ['subscribeNode'];
    if (isEdit) {
      const curentDic = informationDic.filter(item => item.dictionaryCode === data.customerInformationFeedback);
      if (curentDic.length === 1 && !!curentDic[0].attribute1) {
        hideControls = [];
        const dics = helper.getJsonResult(await fetchDictionary([curentDic[0].attribute1]));
        let options = dics[curentDic[0].attribute1];
        if (curentDic[0].attribute2) {
          const delArr = curentDic[0].attribute2.split(',');
          options = options.filter(item => !delArr.includes(item.value));
        }
        controls = controls.map(item => {
          return item.key === 'subscribeNode' ? {...item, required: true, options} : item;
        })
      }
    }
    const props = {
      isEdit,
      title: isEdit ? '编辑' : '新增',
      controls,
      hideControls,
      informationDic,
      value: {
        ...data,
        subscribeNode: data.subscribeNode ? data.subscribeNode.split(',') : [],
        mail: data.mail ? data.mail.split(',') : [],
        mobile: data.mobile ? data.mobile.split(',') : [],
      },
      visible: true,
      confirmLoading: false
    };
    global.store.dispatch(action.create(props));
    return true;
  } catch (e) {
    helper.showError(e.message());
  }
};

/*
* 功能：新增、编辑对话框
* 参数：data - 记录信息
*       isEdit - 是否编辑
* 返回：成功返回true,取消或关闭返回空
* */
export default async (data, isEdit) => {
  if (false === await buildDialogState(data, isEdit)) return;
  const Container = connect(mapStateToProps, actionCreators)(EditDialog);
  return showPopup(Container, {}, true);
};
