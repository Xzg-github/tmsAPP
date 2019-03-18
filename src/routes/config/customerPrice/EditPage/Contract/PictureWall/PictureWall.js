import { Upload, Icon, Modal } from 'antd';
import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PictureWall.less';
import { Card } from '../../../../../../components';
import helper from '../../../../../../common/common';

const FORMATS = ['image/jpeg', 'image/gif', 'image/bmp', 'image/jpg', 'image/png', 'image/tiff', 'image/gif', 'image/pcx', 'image/tga', 'image/exif', 'image/fpx', 'image/svg', 'image/psd', 'image/cdr', 'image/pcd', 'image/dxf', 'image/ufo', 'image/eps', 'image/ai', 'image/raw', 'image/WMF'];

class PicturesWall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewImageAltText: 'example'
    };
  }

  static propTypes = {
    fileList: PropTypes.array,
    handleImgChange: PropTypes.func,
    handleImgRemove: PropTypes.func,
    uploadText: PropTypes.string,
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
      previewImageAltText: file.name
    });
  }

  beforeUpload = (file) => {
    if (!FORMATS.includes(file.type)) {
      // 限制图片格式
      helper.showError('请上传正确的图片格式！');
      return false;
    }
    if (file.size / 1024 / 1024 >= 5) {
      // 限制图片大小
      helper.showError('图片大小不能超过5M！');
      return false;
    }
    return true;
  }

  toUploadBotton = () => {
    return <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  }

  render() {
    const { previewVisible, previewImage, previewImageAltText } = this.state;
    const { fileList=[], uploadText, handleImgChange, handleImgRemove } = this.props;
    const props = {
      listType: 'picture-card',
      multiple: true,
      fileList,
      action: '/api/proxy/zuul/tms-service/file/upload/document',
      onPreview: this.handlePreview,
      onChange: handleImgChange,
      onRemove: handleImgRemove,
      beforeUpload: this.beforeUpload
    };
    return (
      <div className={s.root}>
        <div className={s.text}>{uploadText}</div>
        <Upload {...props}>
          {fileList.length >= 10 ? null : this.toUploadBotton()}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <Card><img className={s.previewImage} alt={previewImageAltText} src={previewImage}/></Card>
        </Modal>
      </div>
    );
  }
}

export default withStyles(s)(PicturesWall);
