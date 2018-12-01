import React, {PropTypes} from 'react';
import {ModalWithDrag, SuperForm} from '../../../components';

class EditDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    controls: PropTypes.array,
    size: PropTypes.oneOf(['extra-small', 'small', 'default', 'middle', 'large']),
    value: PropTypes.object,
    valid: PropTypes.bool,
    afterClose: PropTypes.func,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    onExitValid: PropTypes.func
  };

  onClick = (key) => {
    this.props.onClick(key);
  };

  getWidth = () => {
    const {size='default'} = this.props;
    if (size === 'small') {
      return 416;
    } else if (size === 'middle') {
      return 700;
    } else if (size === 'large') {
      return 910;
    } else if (size === 'default') {
      return 520;
    } else {
      return 260;
    }
  };

  getColNumber = () => {
    const {size='default'} = this.props;
    if (size === 'large') {
      return 4;
    } else if (size === 'middle') {
      return 3;
    } else if ((size === 'default') || (size === 'small')) {
      return 2;
    } else {
      return 1;
    }
  };

  modalProps = ()=> {
    return {
      title: this.props.title,
      visible: this.props.visible,
      maskClosable: false,
      width: this.getWidth(),
      onOk: this.onClick.bind(null, 'ok'),
      onCancel: this.onClick.bind(null, 'close'),
      afterClose: this.props.afterClose
    };
  };

  formProps = () => {
    return {
      colNum: this.getColNumber(),
      controls: this.props.controls,
      value: this.props.value,
      valid: this.props.valid,
      options: this.props.options,
      onChange: this.props.onChange,
      onSearch: this.props.onSearch,
      onExitValid: this.props.onExitValid
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.modalProps()}>
        <SuperForm {...this.formProps()} />
      </ModalWithDrag>
    )
  }
}

export default EditDialog;
