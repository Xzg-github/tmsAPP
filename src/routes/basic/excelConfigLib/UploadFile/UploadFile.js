import React, { PropTypes } from 'react';
/*import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './UploadFile.less';*/
import { Upload, Button, Icon } from 'antd';
import {ModalWithDrag} from '../../../../components';

class UploadFile extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onUpload: PropTypes.func.isRequired,
  };

  state = {
    visible: true,
    uploading: false,
    fileList: [],
  };
  onRemove = (file) => {
    this.setState(({ fileList }) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  onPreview = (file) => {
    const a = document.createElement('a');
    a.href = this.state.url;
    a.download = file.name;
    a.id = 'uploadsheet';
    document.body.append(a);

    const download = document.getElementById('uploadsheet');
    download.click();
    a.remove();
  };

  handleUpload = () => {
    const { fileList } = this.state;
    this.props.onUpload(fileList[0]);
    this.setState({ uploading: true });
    setTimeout(() => { this.setState({ uploading: false }); }, 3000);
  };

  beforeUpload = (file) => {
    const r = new FileReader();
    r.readAsDataURL(file);
    r.onload = (e) => {
      const url = e.target.result;
      this.setState({ url });
    };
    this.setState({ fileList: [file] });
    return false;
  };
  render() {
    const { uploading } = this.state;
    const props = {
      action: '/',
      accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      loading: { uploading },
      onRemove: this.onRemove,
      beforeUpload: this.beforeUpload,
      onPreview: this.onPreview,
      fileList: this.state.fileList,
    };
    return (
      <ModalWithDrag
        title="上传模板"
        visible={this.props.visible}
        footer={null}
        onCancel={this.onCancel}
      >
        <Upload {...props}>
          <Button>
            <Icon type="upload" />选择模板
          </Button>
        </Upload>
        <Button
          style={{ marginTop: '16px' }}
          type="primary"
          onClick={this.handleUpload}
          disabled={this.state.fileList.length === 0}
          loading={uploading}
        >
          {uploading ? '上传中....' : '上传'}
        </Button>

      </ModalWithDrag>
    );
  }

}

export default UploadFile;
