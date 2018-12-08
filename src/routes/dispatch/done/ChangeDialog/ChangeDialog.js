import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {SuperForm, ModalWithDrag} from '../../../../components';
import s from './ChangeDialog.less';

class ChangeDialog extends React.Component {

  toForm = () => {
    const {controls, value, valid, hideControls, onChange, onSearch, onExitValid} = this.props;
    const props = {
      controls,
      value,
      valid,
      hideControls,
      colNum: 2,
      onChange, onSearch, onExitValid
    };
    return <SuperForm {...props} /> ;
  };

  toBody = () => {
    return (
      <div className={s.root}>
        {this.toForm()}
      </div>
    );
  };

  getProps = () => {
    const {title, ok, cancel, visible, confirmLoading, res, onCancel, onOk, afterClose} = this.props;
    return {
      title,
      visible,
      onCancel,
      onOk,
      afterClose: () => afterClose(res),
      okText: ok,
      cancelText: cancel,
      width: 520,
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

export default withStyles(s)(ChangeDialog);
