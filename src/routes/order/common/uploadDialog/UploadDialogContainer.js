import { connect } from 'react-redux';
import UploadDialog from './UploadDialog';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showDialog from '../../../../standard-business/showDialog';

const createContainer = (statePath, afterEditActionCreator) => {
  const action = new Action(statePath, false);

  const getSelfState = (rootState) => {
    return getPathValue(rootState, statePath);
  };

  const cancelActionCreator = () => {
    return afterEditActionCreator();
  };

  const preActionCreator = () => (dispatch, getState) => {
    const {pictureIndex} = getSelfState(getState());
    pictureIndex && dispatch(action.assign({pictureIndex: pictureIndex-1}));
  };

  const nextActionCreator = () => (dispatch, getState) => {
    const {pictureIndex, previewImage} = getSelfState(getState());
    (previewImage.length-1 > pictureIndex) && dispatch(action.assign({pictureIndex: pictureIndex+1}));
  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const actionCreators = {
    onCancel: cancelActionCreator,
    onPre: preActionCreator,
    onNext: nextActionCreator
  };

  return connect(mapStateToProps, actionCreators)(UploadDialog);
};

const showUploadDialog = async (fileList) => {
  const props =  {
    previewImage: fileList.map(item => {return item.url || item.thumbUrl;}),
    pictureIndex: 0
  };
  showDialog(createContainer, props);
};

export default showUploadDialog;
