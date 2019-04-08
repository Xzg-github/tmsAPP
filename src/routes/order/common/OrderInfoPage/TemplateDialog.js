import React, {PropTypes} from 'react';
import {Button} from 'antd';
import {SuperForm, ModalWithDrag} from '../../../../components';
import showPopup from '../../../../standard-business/showPopup';
import helper from "../../../../common/common";

class TemplateDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    afterClose: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.onDel = this.onDel.bind(this);
    this.state = {options: props.options, value: {}, valid: false, visible: true, ok: false};
  }

  onOk = () => {
    if (!this.state.value.template) {
      this.setState({valid: true});
    } else {
      this.setState({visible: false, ok: true});
    }
  };

  async onDel() {
    if (!this.state.value.template) {
      this.setState({valid: true});
    } else {
      const {returnCode, returnMsg} = await helper.fetchJson(`/api/order/all/template_delete/${this.state.value.template}`, 'delete');
      if (returnCode !== 0) return helper.showError(returnMsg);
      helper.showSuccessMsg(`删除模板成功`);
      const options = this.state.options.template.filter(item => item.value !== this.state.value.template);
      this.setState({options: {template: options}, value:{}});
    }
  };

  toFooter = () => {
    return (
      <div>
        <Button onClick={() => this.setState({visible: false})}>取消</Button>
        <Button onClick={this.onDel}>删除模板</Button>
        <Button type='primary' onClick={this.onOk}>确定</Button>
      </div>
    );
  };

  modalProps = () => {
    return {
      title: this.props.title,
      visible: this.state.visible,
      maskClosable: false,
      width: 360,
      footer: this.toFooter(),
      onCancel: () => this.setState({visible: false}),
      afterClose: () => this.props.afterClose(this.state.ok ? this.state.value.template : '')
    };
  };

  formProps = () => {
    return {
      controls: this.props.controls,
      options: this.state.options,
      value: this.state.value,
      valid: this.state.valid,
      colNum: 1,
      container: true,
      onChange: (key, value) => this.setState({value:{[key]: value}}),
      onExitValid: () => this.setState({valid: false})
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.modalProps()}>
        <SuperForm {...this.formProps()} />
      </ModalWithDrag>
    );
  }
}

export default async () => {
  const {returnCode, result=[], returnMsg} = await helper.fetchJson(`/api/order/all/template_list`);
  if (returnCode !== 0) {
    helper.showError(returnMsg);
    return;
  }
  const options = result.map(item => ({title: item.templateName, value: item.transportOrderId}));
  const props = {
    controls: [{key: 'template', title: '模板名称', type: 'select', required: true}],
    options: {template: options},
    title: '选择模板',
    buttons: [
      {key: 'cancel', title: '取消'},
      {key: 'del', title: '删除模板'},
      {key: 'ok', title: '确定'},
    ]
  };
  return showPopup(TemplateDialog, props, true);
}
