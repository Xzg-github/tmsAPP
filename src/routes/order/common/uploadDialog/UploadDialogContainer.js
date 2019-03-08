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

  const previewActionCreator = (file) => {
    return action.assign({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  const closePreviewActionCreator = () => {
    return action.assign({previewVisible: false});
  };

  const cancelActionCreator = () => {
    return afterEditActionCreator();
  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const actionCreators = {
    onCancel: cancelActionCreator,
    onPreview: previewActionCreator,
    onClosePreview: closePreviewActionCreator
  };

  return connect(mapStateToProps, actionCreators)(UploadDialog);
};

const showUploadDialog = async (fileList) => {
  const props =  {
    title: '附件查看',
    fileList: fileList,
    previewVisible: false,
    previewImage: ''
  };
  showDialog(createContainer, props);
};

export default showUploadDialog;
