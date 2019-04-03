import React, {PropTypes} from 'react';
import {SuperForm, ModalWithDrag} from '../../../components';
import showPopup from '../../../standard-business/showPopup';
import {fetchDictionary2, setDictionary2} from '../../../common/dictionary';
import helper from "../../../common/common";

class SetDialog extends React.Component {
  static propTypes = {
    guidList: PropTypes.array.isRequired,
    controls: PropTypes.array.isRequired,
    afterClose: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {value: {}, valid: false, visible: true, confirmLoading: false, ok: false};
    this.onOk = this.onOk.bind(this);
  }

  async onOk() {
    if (!helper.validValue(this.props.controls, this.state.value)) {
      this.setState({valid: true});
    } else {
      this.setState({confirmLoading: true});
      const body = {
        guidList: this.props.guidList,
        ...this.state.value
      };
      const {returnCode, returnMsg} = await helper.fetchJson(`/api/basic/user/set`, helper.postOption(body));
      if (returnCode !== 0) {
        helper.showError(returnMsg);
        this.setState({confirmLoading: false});
        return;
      }
      this.setState({visible: false, ok: true});
    }
  };

  modalProps = () => {
    return {
      title: this.props.title,
      visible: this.state.visible,
      maskClosable: false,
      confirmLoading: this.state.confirmLoading,
      width: 360,
      onOk: this.onOk,
      onCancel: () => this.setState({visible: false}),
      afterClose: () => this.props.afterClose(this.state.ok)
    };
  };

  formProps = () => {
    return {
      controls: this.props.controls,
      value: this.state.value,
      valid: this.state.valid,
      colNum: 1,
      container: true,
      onChange: (key, value) => this.setState({value: {[key]: value}}),
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

export default async (guidList) => {
  const controls = [{key: 'contractRoles', title: '签署角色', type: 'select', required: true, dictionary: 'contract_roles'}];
  const dic = helper.getJsonResult(await fetchDictionary2(controls));
  setDictionary2(dic, controls);
  return showPopup(SetDialog, {guidList, controls}, true);
}
