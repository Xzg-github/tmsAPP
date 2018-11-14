import { connect } from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import helper from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import showDialog from '../../../standard-business/showDialog';

const PARENT_STATE_PATH = ['platform', 'excelOutputConfiguration','edit'];

const createContainer = (statePath, afterEditActionCreator) => {
  const action = new Action(statePath, false);
  const actionParents = new Action(PARENT_STATE_PATH, false);

  const getSelfState = (rootState) => {
    return getPathValue(rootState, statePath);
  };

  const checkActionCreator = (isAll, checked, rowIndex) => {
    isAll && (rowIndex = -1);
    return action.update({checked}, 'tableItems', rowIndex);
  };


  const cancelActionCreator= () =>  (dispatch, getState) => {
     afterEditActionCreator()();
  };


  const changeActionCreator = (keyName, keyValue) => async (dispatch, getState) => {
    dispatch(action.assign({[keyName]: keyValue}, 'value'));
  };

  const findCheckedIndex1 = (items) => {
    const index = items.reduce((result = [], item, index) => {
      item.checked && result.push(index);
      return result;
    }, []);
    return !index.length ? -1 : index;
  };


  const okActionCreator = () => async (dispatch, getState) => {
    const {value,okFunc} = getSelfState(getState());
    try{
      dispatch(actionParents.assign({tableItems2:JSON.parse(value.gridConfig)}));
    }catch (e){
      helper.showError('导入数据为JSON数组');
      dispatch(actionParents.assign({tableItems2:[]}));
    }
    okFunc && okFunc();
    afterEditActionCreator()();

  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const actionCreators = {
    onOk: okActionCreator,
    onCancel: cancelActionCreator,
    onChange: changeActionCreator,
    onCheck:checkActionCreator
  };

  return connect(mapStateToProps, actionCreators)(EditDialog);
};

const showImportDiaLog = (data={},okFunc) => {
  const controls = [
    {key: 'gridConfig', title: '',type:'textArea',span:2},
  ]

  const props =  {
    config: {
      ok: '确定',
      cancel: '取消'
    },
    controls,
    title: '导入模板',
    size: 'small',
    value: data,
    okFunc,
};
  showDialog(createContainer, props);
};

export default showImportDiaLog;
