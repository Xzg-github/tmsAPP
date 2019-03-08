import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {ModalWithDrag} from '../../../../components';
import {Upload} from 'antd';
import s from './UploadDialog.less';

class UploadDialog extends React.Component {

  toUpload = () => {
    const { fileList=[], onPreview } = this.props;
    const props = {
      action: '/api/proxy/zuul/tms_service/file/upload/document',
      fileList,
      listType: 'picture-card',
      showUploadList: {showPreviewIcon: true, showRemoveIcon: false},
      onPreview
    };

    return (
      <Upload {...props} />
    );
  };

  toPreviewDialog = () => {
    const {previewImage, onClosePreview, previewVisible=false} = this.props;
    const props = {
      title: '预览',
      onCancel: onClosePreview,
      visible: previewVisible,
      maskClosable: true,
      footer: null
    };
    return (
      <ModalWithDrag {...props}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </ModalWithDrag>
    );
  };

  getProps = () => {
    const {onCancel, title} = this.props;
    return {
      onCancel,
      className: s.root,
      title,
      visible: true,
      maskClosable: false,
      width: 610,
      footer: null
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.toUpload()}
        {this.toPreviewDialog()}
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(UploadDialog);
