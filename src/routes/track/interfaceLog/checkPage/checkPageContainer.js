import { connect } from 'react-redux';
import CheckePage from './checkPage';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showPopup from "../../../../standard-business/showPopup";

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH, false);


const buildState = (data, height) => {
  return {
    title: '内容展示',
    visible: true,
    result: data,
    height
  }
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};


const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible:false}));
};

const clickActionCreators = {
  close: closeActionCreator
};

const clickActionCreator = (key) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key]();
  }else{
    return {type: 'unknown'}
  }
};

const actionCreators = {
  onClick: clickActionCreator
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const Container = connect(mapStateToProps, actionCreators)(CheckePage);


export default async(data={}, height) => {
  global.store.dispatch(action.create(buildState(data, height)));
  await showPopup(Container, data,true);
};
