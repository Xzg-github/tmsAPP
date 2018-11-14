import React, { PropTypes } from 'react';
import {SuperForm, ModalWithDrag} from '../../../components';
import helper from '../../../common/common';
import showPopup from '../../../standard-business/showPopup';

class AddDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    ok: PropTypes.string,
    cancel: PropTypes.string,
    controls: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.initState(props);
    this.onHandleOk = this.onHandleOk.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.initState(nextProps);
  }

  initState = (props) => {
    this.state = {
      value: {},
      valid: false,
      confirmLoading: false,
      visible: true
    };
  };

  async onHandleOk() {
    if (!helper.validValue(this.props.controls, this.state.value)) {
      this.setState({...this.state, valid: true});
      return;
    }
    this.setState({...this.state, confirmLoading: true});
    const url = '/api/basic/formExpand';
    const body = {
      tablePropertyCode: this.state.value.tablePropertyName.value,
      tablePropertyName: this.state.value.tablePropertyName.title,
      enabledType: 'enabled_type_enabled'
    };
    const {returnCode, returnMsg, result} = await helper.fetchJson(url, helper.postOption(body));
    if (returnCode !== 0) {
      helper.showError(`${returnCode}${returnMsg}`);
      this.setState({...this.state, confirmLoading: false});
      return;
    }
    helper.showSuccessMsg('新增成功');
    this.setState({...this.state, visible:false, res:{isOk: true, item: result}});
  };

  toForm = () => {
    const props = {
      controls: this.props.controls,
      value: this.state.value,
      valid: this.state.valid,
      onChange: (key, value) => {this.setState({...this.state, value: {...this.state.value, [key]: value}})},
      onExitValid: () => {this.setState({...this.state, valid: false})},
      colNum: 2
    };
    return <SuperForm {...props}/>
  };

  getProps = () => {
    return {
      title: this.props.title,
      onOk: this.onHandleOk,
      onCancel: () => {this.setState({...this.state, visible: false, res: {isOk: false}})},
      afterClose: () => {this.props.afterClose(this.state.res)},
      width: 400,
      visible: this.state.visible,
      maskClosable: false,
      okText: this.props.ok,
      cancelText: this.props.cancel,
      confirmLoading: this.state.confirmLoading
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.toForm()}
      </ModalWithDrag>
    );
  }
}

export default (config) => {
  return showPopup(AddDialog, {...config}, true);
};

