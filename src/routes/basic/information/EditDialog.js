import React from 'react';
import {ModalWithDrag, SuperForm} from '../../../components';

class EditDialog extends React.Component {

  toBody = () => {
    const {controls, value, valid, hideControls, onChange, onSearch, onExitValid} = this.props;
    const formProps = {
      controls,
      hideControls,
      valid,
      value,
      container: true,
      colNum: 3,
      onChange, onSearch, onExitValid
    };
    return <SuperForm {...formProps}/>;
  };

  getProps = () => {
    const {title, visible, confirmLoading, res, onCancel, onOk, afterClose} = this.props;
    return {
      title,
      visible,
      onCancel,
      onOk,
      afterClose: () => afterClose(res),
      width: 900,
      maskClosable: false,
      confirmLoading
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.toBody()}
      </ModalWithDrag>
    );
  }
}

export default EditDialog;
