import { connect } from 'react-redux';
import EditDialog from './EditPage/EditPage';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';


const STATE_PATH = ['message', 'sendMessageByEmail','edit'];
const action = new Action(STATE_PATH);
const CLOSE_ACTION = action.assignParent({edit: undefined});

const buildEditState =(config, data, edit) => {
  return {
    config: config.config,
    tableCols: config.controls,
    title: edit ? config.edit : config.add,
    size: 'middle',
    tableItems:data
  };
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(CLOSE_ACTION);
};
const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};


const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onCancel: cancelActionCreator,
  onClick:clickActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(EditDialog);
export default Container;
export {buildEditState};
