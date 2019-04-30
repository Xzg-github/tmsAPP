import { Upload, Icon, Modal, Button } from 'antd';
import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PictureWall.less';
import { Card } from '../../../../../../components';
import helper from '../../../../../../common/common';

const FORMATS = ['image/jpeg', 'image/gif', 'image/bmp', 'image/jpg', 'image/png', 'image/tiff', 'image/gif', 'image/pcx', 'image/tga', 'image/exif', 'image/fpx', 'image/svg', 'image/psd', 'image/cdr', 'image/pcd', 'image/dxf', 'image/ufo', 'image/eps', 'image/ai', 'image/raw', 'image/WMF'];

const FORMATS1 = ['.jpeg', '.gif', '.bmp', '.jpg', '.png', '.tiff', '.gif', '.pcx', '.tga', '.exif', '.fpx', '.svg', '.psd', '.cdr', '.pcd', '.dxf', '.ufo', '.eps', '.ai', '.raw', '.WMF'];

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
    if (!FORMATS.includes(file.type)) {
      return helper.download(file.url);
    }
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
      previewImageAltText: file.name
    });
  }

  beforeUpload = (file) => {
    // if (!FORMATS.includes(file.type)) {
    //   // 限制图片格式
    //   helper.showError('请上传正确的图片格式！');
    //   return false;
    // }
    if (file.size / 1024 / 1024 >= 5) {
      // 限制图片大小
      helper.showError('图片大小不能超过5M！');
      return false;
    }
    return true;
  }

  toUploadBotton = (fileList) => {
    const flag = fileList.length >= 10;
    return <Button className={s.uploadButton} disabled={flag}><Icon type="plus" />Upload</Button>
  }

  render() {
    const { previewVisible, previewImage, previewImageAltText } = this.state;
    const { fileList=[], uploadText, handleImgChange, handleImgRemove } = this.props;
    const list = fileList.map(file => {
      const name = file.fileName || file.name || '';
      const flag = FORMATS1.includes(name.substr(name.lastIndexOf('.')));
      return {
        ...file,
        type: flag ? 'image/jpeg' : undefined,
        thumbUrl: flag ? undefined : '/default.png'
      }
    });
    const props = {
      className: 'upload-list-inline',
      listType: 'picture',
      multiple: true,
      fileList: list,
      action: '/api/proxy/zuul/tms-service/file/upload/document',
      onPreview: this.handlePreview,
      onChange: handleImgChange,
      onRemove: handleImgRemove,
      beforeUpload: this.beforeUpload
    };
    return (
      <div className={s.root}>
        <Upload {...props}>
          {this.toUploadBotton(fileList)}
          <div className={s.text}>{uploadText}</div>
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <Card><img className={s.previewImage} alt={previewImageAltText} src={previewImage}/></Card>
        </Modal>
      </div>
    );
  }
}

export default withStyles(s)(PicturesWall);
