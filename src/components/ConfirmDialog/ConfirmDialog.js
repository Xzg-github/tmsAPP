import React, { PropTypes } from 'react';
import ModalWithDrag from '../ModalWithDrag';

class ConfirmDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    // content: PropTypes.string, //string或object
    ok: PropTypes.string,
    cancel: PropTypes.string,
    onCancel: PropTypes.func,
    onOk: PropTypes.func
  };

  getProps = () => {
    const {title, ok, cancel, onOk, onCancel,width=300} = this.props;
    return {
      title, onOk, onCancel,
      visible: true,
      width,
      maskClosable: false,
      okText: ok,
      cancelText: cancel
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.props.content}
      </ModalWithDrag>
    );
  }
}

export default ConfirmDialog;
