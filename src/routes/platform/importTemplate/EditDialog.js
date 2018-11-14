import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {SuperForm, ModalWithDrag} from '../../../components';
import {Upload, Icon, Button} from 'antd';
import s from './EditDialog.less';

class EditDialog extends React.Component {
  toUpload = () => {
    const { fileList=[], onChange, onRemove } = this.props;
    const props = {
      action: '/api/proxy/zuul/charge_service/file/upload/document',
      accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      fileList,
      onRemove,
      beforeUpload: onChange
    };

    return (
      <Upload {...props}>
        <Button>
          <Icon type="upload" />选择模板
        </Button>
      </Upload >
    );
  };

  toLabel = () => {
    return (
      <label>上传文档:(上传文件大小限制在5M以内)</label>
    );
  };

  toForm = () => {
    const {controls, editControls, value, isEdit} = this.props;
    let props = {};
    if(isEdit){
      if(value.active === "active_activated"){
        props = {
          controls: editControls,
          value: value,
          valid: this.props.valid,
          onChange: this.props.onFormChange,
          onSearch: this.props.onFormSearch,
          onExitValid: this.props.onExitValid,
          colNum: 2
        };
      }else if(value.active === 'active_unactivated'){
        props = {
          controls: controls,
          value: value,
          valid: this.props.valid,
          onChange: this.props.onFormChange,
          onSearch: this.props.onFormSearch,
          onExitValid: this.props.onExitValid,
          colNum: 2
        };
      }
    }else{
      props = {
        controls: controls,
        value: value,
        valid: this.props.valid,
        onChange: this.props.onFormChange,
        onSearch: this.props.onFormSearch,
        onExitValid: this.props.onExitValid,
        colNum: 2
      };
    }

    return <SuperForm {...props}/>
  };

  getProps = () => {
    const {onOk, onCancel, title, config, confirmLoading=false} = this.props;
    return {
      onOk, onCancel,
      className: s.root,
      title: title ,
      visible: true,
      maskClosable: false,
      width: 610,
      okText: config.ok,
      cancelText: config.cancel,
      confirmLoading
    };
  };

  render() {
    const {upload} = this.props;
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.toForm()}
        {upload===true && this.toLabel()}
        {upload===true && this.toUpload()}
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(EditDialog);
