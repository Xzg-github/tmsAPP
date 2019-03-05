import { Upload, Icon, Modal } from 'antd';
import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PictureWall.less';
import { Card } from '../../../../../components';

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

  toUploadBotton = () => {
    return <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  }

  render() {
    const { previewVisible, previewImage, previewImageAltText } = this.state;
    const { fileList=[], uploadText, handleImgChange } = this.props;
    const props = {
      listType: 'picture-card',
      fileList,
      action: '//jsonplaceholder.typicode.com/posts/',
      onPreview: this.handlePreview,
      onChange: handleImgChange
    };
    return (
      <div className={s.root}>
        <div className={s.text}>{uploadText}</div>
        <Upload {...props}>
          {fileList.length >= 5 ? null : this.toUploadBotton()}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <Card><img className={s.previewImage} alt={previewImageAltText} src={previewImage}/></Card>
        </Modal>
      </div>
    );
  }
}

export default withStyles(s)(PicturesWall);
