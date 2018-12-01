import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {SuperForm, ModalWithDrag} from '../../../../components';
import s from './AddDialog.less';

class AddDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    ok: PropTypes.string,
    cancel: PropTypes.string,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    onSearch: PropTypes.func,
  };

  toForm = () => {
    const {controls, value, valid, onChange, onExitValid, onSearch, readonly} = this.props;
    const props = {
      controls,
      value,
      valid,
      onChange,
      onSearch,
      onExitValid,
      readonly
    };
    return <SuperForm {...props} /> ;
  };

  getProps = () => {
    const {visible, ok, cancel, onCancel, onOk, edit, res, afterClose} = this.props;
    return {
      title: edit ? '编辑' : '新增',
      okText: ok,
      cancelText: cancel,
      visible,
      onCancel,
      onOk,
      afterClose: () => afterClose(res),
      width: 800,
      maskClosable: false
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        <div className={s.root}>
            {this.toForm()}
        </div>
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(AddDialog);
