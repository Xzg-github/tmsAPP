import React, {PropTypes} from 'react';
import {ModalWithDrag, SuperForm} from '../../../components';

class SetDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    controls: PropTypes.array,
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

  modalProps = (props) => {
    return {
      title: props.title,
      visible: props.visible,
      maskClosable: false,
      width: 350,
      onOk: this.onClick.bind(null, 'ok'),
      onCancel: this.onClick.bind(null, 'close'),
      afterClose: props.afterClose
    };
  };

  formProps = (props) => {
    return {
      controls: props.controls,
      value: props.value,
      valid: props.valid,
      options: props.options,
      onChange: props.onChange,
      onSearch:props.onSearch,
      onExitValid: props.onExitValid,
      onAdd:props.onAdd,
      colNum:2
    };
  };

  render() {
    const props = this.props;
    return (
      <ModalWithDrag {...this.modalProps(props)}>
        <SuperForm {...this.formProps(props)} />
      </ModalWithDrag>
    );
  }
}

export default SetDialog;
