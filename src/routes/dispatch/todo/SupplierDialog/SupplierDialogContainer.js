import { connect } from 'react-redux';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';
import {fetchDictionary2, setDictionary2} from '../../../../common/dictionary';
import SupplierDialog from './SupplierDialog';
import showPopup from '../../../../standard-business/showPopup';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const getItems = async (searchData={}) => {
  let items = [];
  const {returnCode, result} = await helper.fetchJson('/api/dispatch/todo/supplier_list', helper.postOption({itemFrom: 0, itemTo: 65536, filter:searchData}));
  if (returnCode === 0 && result.data) {
    items = result.data.map(item => {
      const {contactList=[]} = item;
      let supplierContactId='', defaultContact={};
      const options = contactList.map(contact => {
        const obj = {supplierContactName:contact.contactName,  supplierContactTelephone: contact.contactMobile || '', supplierContactEmail: contact.contactEmail || ''};
        const value = JSON.stringify(obj);
        if (contactList.length === 1 || contact.isDefault === 1) {
          supplierContactId = value;
          defaultContact = contact;
        }
        return {title: contact.contactName, value};
      });
      const {contactName: supplierContactName, contactEmail: supplierContactEmail, contactMobile: supplierContactTelephone} = defaultContact;
      return {...item, supplierContactId, supplierContactName, supplierContactTelephone, supplierContactEmail, options: {supplierContactId: options}};
    });
  }
  return items;
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false}));
};

const okActionCreator = () => async (dispatch, getState) => {
  const {items, data} = getSelfState(getState());
  const checkedItems = items.filter(item => item.checked === true);
  if (checkedItems.length !== 1) return helper.showError(`请先勾选一条记录`);
  if (!checkedItems[0].supplierContactName) return helper.showError(`联系人不能为空`);
  dispatch(action.assign({confirmLoading: true}));
  const body = {
    ...helper.getObject(checkedItems[0], ['supplierId', 'supplierContactName', 'supplierContactTelephone', 'supplierContactEmail']),
    transportOrderId: data.id,
    ownerCarTag: 0
  };
  const {returnCode, returnMsg} = await helper.fetchJson(`/api/dispatch/todo/dispatch_supplier`, helper.postOption(body));
  if (returnCode !== 0) {
    dispatch(action.assign({confirmLoading: false}));
    helper.showError(returnMsg);
    return;
  }
  dispatch(action.assign({visible: false, res: true}));
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'searchData');
};

const contentChangeActionCreator = (rowIndex, key, value) => (dispatch) => {
  if (key === 'supplierContactId') {
    let obj = {[key]: value, supplierContactName: '', supplierContactTelephone: '', supplierContactEmail: ''};
    if (value) {
      obj = {...obj, ...JSON.parse(value)};
    }
    dispatch(action.update(obj, 'items', rowIndex));
  }
};

const checkActionCreator = (rowIndex, keyName, checked) => (dispatch) => {
  if (rowIndex === -1) return;
  dispatch(action.update({[keyName]: false}, 'items', -1));
  dispatch(action.update({[keyName]: true}, 'items', rowIndex));
};

const resetActionCreator = (dispatch) => {
  dispatch(action.assign({searchData: {}}));
};

const searchDataActionCreator = async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  const items = await getItems(searchData);
  dispatch(action.assign({items}));
};

const buttons = {
  reset: resetActionCreator,
  search: searchDataActionCreator
};

const clickActionCreator = (key) => {
  if (buttons[key]) {
    return buttons[key];
  }else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel: cancelActionCreator,
  onChange: changeActionCreator,
  onContentChange : contentChangeActionCreator,
  onCheck: checkActionCreator,
  onClick: clickActionCreator
};

const buildDialogState = async (data) => {
  const config = {
    title: '派供应商',
    ok: '确定',
    cancel: '取消',
    searchConfig: {
      search: '搜索',
      more: '更多',
      reset: '重置'
    },
    filters: [
      {key: 'supplierName', title: '供应商名称', type: 'text'},
      {key: 'companyLevel', title: '供应商级别', type: 'select', dictionary: 'company_level'}
    ],
    cols: [
      {key: 'checked', type:'checkbox', title: '选择'},
      {key: 'index', type: 'index', title: '序号'},
      {key: 'supplierName', title: '供应商'},
      {key: 'companyLevel', title: '供应商级别', dictionary: 'company_level'},
      {key: 'supplierContactId', title: '联系人', type: 'select', require: true},
      {key: 'supplierContactTelephone', title: '联系电话'},
      {key: 'supplierContactEmail', title: '邮箱'},
    ]
  };
  const dic = await fetchDictionary2(config.cols);
  setDictionary2(dic.result, config.cols, config.filters);
  const items = await getItems();
  global.store.dispatch(action.create({
    ...config,
    data,
    items,
    searchData: {},
    visible: true,
    confirmLoading: false,
  }));
};

/*
* 功能：派供应商对话框
* 参数：data: 【必需】待派供应商的记录信息
* 返回值：成功返回true，取消或关闭时返回空
*/
export default async (data) => {
  await buildDialogState(data);
  const Container = connect(mapStateToProps, actionCreators)(SupplierDialog);
  return showPopup(Container, {}, true);
};
