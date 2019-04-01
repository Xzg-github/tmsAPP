import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {ModalWithDrag, SuperForm, SuperTable2, SuperToolbar} from '../../../../components';
import s from './UploadDialog.less';

class UploadDialog extends React.Component {

  toTable = () => {
    const {cols, items, onContentChange, onCheck, onLink} = this.props;
    const props ={
      cols, items,
      callback: {
        onContentChange, onCheck, onLink
      }
    };
    return <SuperTable2 {...props}/>;
  };

  toToolbar = () => {
    return <SuperToolbar buttons={this.props.buttons} onClick={this.props.onClick}/>;
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
    const {onOk, onCancel, afterClose, res, title, label, visible, confirmLoading=false} = this.props;
    return {
      onOk,
      onCancel,
      afterClose: () => {afterClose(res)},
      className: s.root,
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
        {this.toToolbar()}
        {this.toTable()}
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(UploadDialog);
