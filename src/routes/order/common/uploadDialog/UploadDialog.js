import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {ModalWithDrag} from '../../../../components';
import {Button} from 'antd';
import s from './UploadDialog.less';

class UploadDialog extends React.Component {

  toTop = () => {
    const {previewImage, pictureIndex=0, onPre, onNext} = this.props;
    return (
      <div>
        <Button onClick={onPre}>上一张</Button>
        <label>{pictureIndex+1}/{previewImage.length}</label>
        <Button onClick={onNext}>下一张</Button>
      </div>
    );
  };

  getProps = () => {
    const {onCancel} = this.props;
    return {
      onCancel,
      className: s.root,
      visible: true,
      maskClosable: false,
      width: 450,
      footer: null
    };
  };

  render() {
    const {previewImage, pictureIndex=0} = this.props;
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.toTop()}
        <div><img alt="example" style={{ width: '100%' }} src={previewImage[pictureIndex]} /></div>
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(UploadDialog);
