import React, {PropTypes} from 'react';
import {SuperForm, ModalWithDrag} from '../../../components';
import showPopup from '../../../standard-business/showPopup';

class PromptDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    afterClose: PropTypes.func.isRequired
  };

  state = {value: '', valid: false, visible: true, ok: false};

  onOk = () => {
    if (!this.state.value) {
      this.setState({valid: true});
    } else {
      this.setState({visible: false, ok: true});
    }
  };

  modalProps = () => {
    return {
      title: this.props.title,
      visible: this.state.visible,
      maskClosable: false,
      width: 360,
      onOk: this.onOk,
      onCancel: () => this.setState({visible: false}),
      afterClose: () => this.props.afterClose(this.state.ok ? this.state.value : '')
    };
  };

  formProps = () => {
    return {
      controls: [{key: 'label', title: this.props.label, type: this.props.type, required: true, props:this.props.controlProps}],
      value: {label: this.state.value},
      valid: this.state.valid,
      colNum: 1,
      container: true,
      onChange: (key, value) => this.setState({value}),
      onExitValid: () => this.setState({valid: false})
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.modalProps()}>
        {this.props.description && (<label>{this.props.description}</label>)}
        <SuperForm {...this.formProps()} />
      </ModalWithDrag>
    );
  }
}

export default (title, label, description=undefined, type='textArea', controlProps={}) => {
  return showPopup(PromptDialog, {title, label, description, type, controlProps}, true);
}
