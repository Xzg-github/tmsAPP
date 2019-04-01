import { connect } from 'react-redux';
import EditDialog from './EditDialog';
import helper from '../../../common/common';
import {fetchAllDictionary, setDictionary2} from '../../../common/dictionary';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import showPopup from '../../../standard-business/showPopup';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) => (dispatch, getState) => {
  let obj = {[key]: value};
  if (key === 'customerId') {
    const {formValue} = getSelfState(getState());
    if (value && formValue.customerId && value.value === formValue.customerId.value) return;
    obj.consignorId = '';
    obj.consigneeId = '';
  }
  dispatch(action.assign(obj, 'formValue'));
};

const searchActionCreator = (key, filter, config) => async (dispatch, getState) => {
  if (key === 'consignorId' || key === 'consigneeId') {
    const {formValue} = getSelfState(getState());
    let options = [];
    if (formValue.customerId) {
      const url = `/api/order/input/customer_factory_drop_list`;
      const data = await helper.fetchJson(url, helper.postOption({customerId: formValue.customerId.value, name: filter, isAll: 1}));
      if (data.returnCode === 0) {
        options = data.result || [];
      }
    }
    dispatch(action.update({options}, ['controls'], {key: 'key', value: key}));
  }else {
    const {returnCode, result} = await helper.fuzzySearchEx(filter, config);
    dispatch(action.update({options: returnCode === 0 ? result : undefined}, 'controls', {key: 'key', value: key}));
  }
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const {formValue, value, sections, controls, type} = getSelfState(getState());
  if (!helper.validValue(controls, formValue)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  dispatch(action.assign({confirmLoading: true}));
  const URL_OK = '/api/config/customer_task';
  const body = {
    ...helper.convert(formValue),
    taskList: sections.map(item => {
      const newItem = {...item.dataSource};
      newItem.subList = item.options.map(item2 => {
        return {...item2.dataSource, isCheck: value.includes(item2.value) ? 1 : 0};
      });
      return newItem;
    })
  };
  const {returnCode, returnMsg} = await helper.fetchJson(URL_OK, helper.postOption(body, type === 1 ? 'put' : 'post'));
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

const checkboxChangeActionCreator = (arr = []) => {
  return action.assign({value: arr});
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onCheckboxChange: checkboxChangeActionCreator,
  onChange: changeActionCreator,
  onSearch: searchActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

const URL_BRANCH = '/api/config/customer_task/options/departments';  // 部门

const buildDialogState = async (data, type) => {
  try {
    let controls = [
      {key: 'customerId', title: '客户', type: type === 0 ? 'search': 'readonly', searchType: 'customer', required: true},
      {key: 'consignorId', title: '发货人', type: type === 0 ? 'search': 'readonly', props: {searchWhenClick: true}, required: true},
      {key: 'consigneeId', title: '收货人', type: type === 0 ? 'search': 'readonly', props: {searchWhenClick: true}, required: true},
      {key: 'businessType', title: '运输类型', type: type === 0 ? 'select': 'readonly', dictionary: 'business_type', required: true},
      {key: 'deptmentId', title: '部门', type: type === 0 ? 'search': 'readonly',searchUrl: URL_BRANCH, required: true}
    ];
    const dic = helper.getJsonResult(await fetchAllDictionary());
    setDictionary2(dic, controls);
    const url = `/api/basic/sysDictionary/list`;
    let json = helper.getJsonResult(await helper.fetchJson(url, helper.postOption({dictionaryCode: 'task_type'})));
    let taskTypes = json.data.filter(item => item.active === 'active_activated');
    let sections = [];
    let defaultValue = [];
    for (let item of taskTypes) {
      const {dictionaryCode, dictionaryName} = item;
      let json2 = helper.getJsonResult(await helper.fetchJson(url, helper.postOption({dictionaryCode})));
      const options = json2.data.filter(item => item.active === 'active_activated').map(item => {
        const disabled = Number(item.attributeNumber2 || 0) === 1;
        disabled && defaultValue.push(item.dictionaryCode);
        return {dataSource: item, label:item.dictionaryName, value:item.dictionaryCode, disabled: type === 2 ? true : disabled};
      });
      sections.push({dataSource: item, title: dictionaryName, options});
    }
    let value = [];
    if (data.taskList) {
      data.taskList.map(item => {
        const currentValue = item.subList.filter(item => item.isCheck === 1).map(item => item.dictionaryCode);
        value = value.concat(currentValue);
      })
    }
    const titles = ['新增', '编辑', '查看'];
    const props = {
      type,
      title: titles[type],
      controls,
      formValue: data,
      sections,
      value: type === 0 ? defaultValue : value,
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
* 功能：新增、编辑、查看对话框
* 参数：data - 记录信息
*       type - 0:新增 1:编辑 2:查看
* 返回：成功返回true,取消或关闭返回空
* */
export default async (data, type) => {
  if (false === await buildDialogState(data, type)) return;
  const Container = connect(mapStateToProps, actionCreators)(EditDialog);
  return showPopup(Container, {}, true);
};
