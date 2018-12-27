import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {ModalWithDrag, SuperForm} from '../../../../components';
import {Upload, Icon} from 'antd';
import helper from '../../../../common/common';
import s from './UploadDialog.less';

class UploadDialog extends React.Component {

  toUploadIcon = () => {  // 上传按钮
    return (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
  };

  toUpload = () => {
    const { fileList=[], onChange, onRemove, onPreview } = this.props;
    const props = {
      action: '/api/proxy/zuul/tms-service/file/upload/document',
      fileList,
      listType: 'picture-card',
      onChange,
      onRemove,
      onPreview,
      beforeUpload:  (file) => {
        const isLt2M = file.size / 1024 / 1024 < 5;      // 附件限制至5M
        if (!isLt2M) {
          helper.showError('附件大小不能超过5M');
          onChange({fileList});
        }
        return isLt2M;
      }
    };

    return (
      <Upload {...props}>
        {fileList.length < 10 && this.toUploadIcon()}
      </Upload >
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

  toLabel = () => {
    return (
      <label>上传文档:(单个文件大小限制在5M以内,上传个数不能超过10个,如若大于10个请压缩后上传)</label>
    );
  };

  toForm = () => {
    const {controls, formValue, valid, onFormChange, onExitValid} = this.props;
    const props = {
      controls,
      value: formValue,
      valid,
      onChange: onFormChange,
      onExitValid
    };
    return <SuperForm {...props} />;
  };

  getProps = () => {
    const {onOk, onCancel, afterClose, res, title, label, visible, fileList=[], confirmLoading=false} = this.props;
    return {
      onOk,
      onCancel,
      afterClose: () => {afterClose(res)},
      className: fileList.length < 10 ? s.root : s.root2,
      title ,
      visible,
      maskClosable: false,
      width: 900,
      okText: label.ok,
      cancelText: label.cancel,
      confirmLoading
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.toForm()}
        {this.toLabel()}
        {this.toUpload()}
        {this.toPreviewDialog()}
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(UploadDialog);
