import { connect } from 'react-redux';
import EditDialog from './EditDialogPage';
import helper, {postOption, fetchJson} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showDialog from "../../../../standard-business/showDialog";

const URL_OK = '/api/platform/jurisdiction/tenantRuleTypes/ok';

const createContainer = (statePath, afterEditActionCreator) => {
  const action = new Action(statePath, true);

  const getSelfState = (rootState) => {
    return getPathValue(rootState, statePath);
  };

  //Input搜索框change监听
  const changeActionCreator = (event) => (dispatch, getState) =>{
    dispatch(action.assign({formValue: event.target.value}));
    const { filterItems, formValue} = getSelfState(getState());
    let newTableItems = [];
    filterItems.forEach((item) => {
      if(item.ruleTypeName.toLowerCase().indexOf(formValue.toLowerCase()) > -1) {
        newTableItems.push(item);
      }
    });
    dispatch(action.assign({tableItems: newTableItems}));
  };

  const okActionCreator = () => async (dispatch, getState) => {
    const {tableItems, tenantId, afterEdit} = getSelfState(getState());
    console.log(getSelfState(getState()));
    const value = tableItems.filter(item => item.checked).map(item => item.value);
    const option = postOption({idList: value, tenantId: tenantId});
    const {returnCode, returnMsg} = await fetchJson(URL_OK, option);
    if (returnCode !== 0) {
      helper.showError(returnMsg);
      return
    }
    afterEdit && afterEdit();
    afterEditActionCreator()();
  };

  const cancelActionCreator = () => () => {
    afterEditActionCreator()();
  };

  const checkActionCreator = (isAll, checked, rowIndex) => {
    isAll && (rowIndex = -1);
    return action.update({checked}, 'tableItems', rowIndex);
  };


  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const actionCreators = {
    onChange: changeActionCreator,
    onOk: okActionCreator,
    onCancel: cancelActionCreator,
    onCheck: checkActionCreator
  };

  return connect(mapStateToProps, actionCreators)(EditDialog);
};
const showEditDialog = (item, tenantId, afterEdit) => {
  const tableCols =[
    {key: 'ruleTypeName', title: '数据权限类型'}
  ]
  const props = {
    label: {
      ok: '确定',
      cancel: '取消'
    },
    tableCols,
    title: '选择数据类型',
    tableItems: item,
    filterItems: item,
    tenantId: tenantId,
    afterEdit: afterEdit,
  };
  showDialog(createContainer, props);
}
export default showEditDialog;
