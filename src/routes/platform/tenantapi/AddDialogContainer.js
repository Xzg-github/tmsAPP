import { connect } from 'react-redux';
import AddDialog from './AddDialog';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {postOption, fetchJson, showSuccessMsg, showError} from '../../../common/common';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const URL_SAVE = '/api/config/tenantapi/save';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

export const buildEditState = (config, filterItems, items=[], tenantId, add, dispatch, okFunc) => {
  dispatch(action.create({
    ...config,
    okFunc,
    visible: true,
    add,
    filterItems,
    tenantId,
    tableItems: items
  }));
};

//Input搜索框change监听
const changeActionCreator = (event) => (dispatch, getState) =>{
  dispatch(action.assign({formValue: event.target.value}));
  const { filterItems, formValue} = getSelfState(getState());
  let newTableItems = [];
  filterItems.forEach((item) => {
    if(item.apiName.toLowerCase().indexOf(formValue.toLowerCase()) > -1) {
      newTableItems.push(item);
    }
  });
  dispatch(action.assign({tableItems: newTableItems}));
};
const okActionCreator = ({onClose}) => async(dispatch, getState) => {
  const {status=[], filterItems, tenantId, okFunc} = getSelfState(getState());
  const checkId = [];
  filterItems.filter(item => {
    for (let id of status) {
      if(id == item.id) return item.id ? checkId.push(item.id) : '';
    }
    return false;
  });
  const option = postOption(checkId);
  const res = await fetchJson(`${URL_SAVE}?tenantId=${tenantId}`, option);
  if (res.returnCode === 0) {
    showSuccessMsg('保存成功！');
    okFunc(res.result);
    onClose();
  }else{
    showError(res.returnMsg);
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => (dispatch,getState) => {
  let id = [];
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex));
  const {tableItems} = getSelfState(getState())
  tableItems.forEach(item => {
    item.checked && (id.push(item.id))
  });
  dispatch(action.assign({status: id}));
};

const cancelActionCreator = ({onClose}) => () => {
  onClose();
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onCheck: checkActionCreator,
  onOk: okActionCreator,
  onCancel:cancelActionCreator,
  onChange: changeActionCreator
};

const container = connect(mapStateToProps, actionCreators)(AddDialog);

export default container;
